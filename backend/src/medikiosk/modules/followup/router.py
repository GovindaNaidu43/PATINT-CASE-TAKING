"""FastAPI router for post-consultation follow-up scheduling and response assessment."""
import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from medikiosk.core.database import get_db
from medikiosk.core.security import require_staff
from medikiosk.domain.models import AuditEvent, ConsentRecord, Consultation, FollowUp
from medikiosk.modules.followup.tasks import assess_response

router = APIRouter(prefix="/followups", tags=["follow-up"])


class Schedule(BaseModel):
    consultation_id: str
    destination: str
    hours: int = 24


class Response(BaseModel):
    text: str


@router.post("/schedule")
def schedule(
    data: Schedule,
    staff: dict = Depends(require_staff),
    db: Session = Depends(get_db),
):
    if data.hours < 1 or data.hours > 8760:
        raise HTTPException(422, "Follow-up interval must be between 1 hour and 1 year")
    consultation = db.get(Consultation, data.consultation_id)
    if not consultation:
        raise HTTPException(404, "Consultation not found")
    consent = (
        db.execute(
            select(ConsentRecord).where(
                ConsentRecord.consultation_id == consultation.id,
                ConsentRecord.withdrawn_at.is_(None),
            )
        )
        .scalars()
        .first()
    )
    if not consent or "followup" not in consent.purposes:
        raise HTTPException(409, "Active follow-up consent is required")
    followup = FollowUp(
        id=str(uuid.uuid4()),
        consultation_id=consultation.id,
        patient_id=consultation.patient_id,
        destination=data.destination,
        due_at=datetime.now(timezone.utc) + timedelta(hours=data.hours),
    )
    actor = staff.get("preferred_username") or staff.get("sub") or "staff"
    db.add(followup)
    db.add(
        AuditEvent(
            id=str(uuid.uuid4()),
            actor=actor,
            action="followup_scheduled",
            entity_type="consultation",
            entity_id=consultation.id,
            detail={"followup_id": followup.id},
        )
    )
    db.commit()
    db.refresh(followup)
    return {
        "id": followup.id,
        "consultation_id": followup.consultation_id,
        "patient_id": followup.patient_id,
        "destination": followup.destination,
        "due_at": followup.due_at.isoformat(),
        "status": followup.status,
    }


@router.post("/response")
def response(data: Response, _: dict = Depends(require_staff)):
    return assess_response(data.text)


@router.get("/{consultation_id}")
def list_followups(
    consultation_id: str,
    _: dict = Depends(require_staff),
    db: Session = Depends(get_db),
):
    return [
        {
            "id": item.id,
            "consultation_id": item.consultation_id,
            "patient_id": item.patient_id,
            "destination": item.destination,
            "due_at": item.due_at.isoformat(),
            "status": item.status,
        }
        for item in db.query(FollowUp)
        .filter(FollowUp.consultation_id == consultation_id)
        .order_by(FollowUp.due_at.asc())
        .all()
    ]
