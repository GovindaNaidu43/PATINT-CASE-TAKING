"""FastAPI router for ABDM ABHA verification and FHIR bundle export."""
import uuid
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from medikiosk.core.database import get_db
from medikiosk.core.security import require_physician
from medikiosk.domain.models import AuditEvent, ConsentRecord, Consultation, Document, Patient, SummaryDraft
from medikiosk.modules.integrations.abdm.client import ABHAClient
from medikiosk.modules.integrations.abdm.fhir_builder import consultation_bundle, handle_webhook

router = APIRouter(prefix="/abdm", tags=["ABDM"])


class Verify(BaseModel):
    abha_address: str


class OtpRequest(BaseModel):
    abha_address: str


class OtpConfirm(BaseModel):
    transaction_id: str
    otp: str


@router.post("/abha/verify")
def verify(data: Verify):
    return ABHAClient().verify(data.abha_address)


@router.post("/abha/request-otp")
def request_otp(data: OtpRequest):
    try:
        return ABHAClient().request_otp(data.abha_address)
    except (ValueError, RuntimeError) as error:
        raise HTTPException(422, str(error))


@router.post("/abha/confirm-otp")
def confirm_otp(data: OtpConfirm):
    try:
        return ABHAClient().confirm_otp(data.transaction_id, data.otp)
    except (ValueError, RuntimeError) as error:
        raise HTTPException(422, str(error))


@router.post("/consent/webhook")
def consent(payload: dict):
    try:
        return handle_webhook(payload)
    except ValueError as error:
        raise HTTPException(422, str(error))


@router.post("/consultations/{consultation_id}/bundle")
def bundle(
    consultation_id: str,
    staff: dict = Depends(require_physician),
    db: Session = Depends(get_db),
):
    consultation = db.get(Consultation, consultation_id)
    if not consultation:
        raise HTTPException(404, "Consultation not found")
    summary = (
        db.execute(
            select(SummaryDraft)
            .where(
                SummaryDraft.consultation_id == consultation_id,
                SummaryDraft.released_at.is_not(None),
            )
            .order_by(SummaryDraft.released_at.desc())
        )
        .scalars()
        .first()
    )
    if not summary:
        raise HTTPException(409, "A released physician-confirmed summary is required")
    consent_record = (
        db.execute(
            select(ConsentRecord).where(
                ConsentRecord.consultation_id == consultation_id,
                ConsentRecord.withdrawn_at.is_(None),
            )
        )
        .scalars()
        .first()
    )
    if not consent_record or "care" not in consent_record.purposes:
        raise HTTPException(409, "Active care consent is required")
    patient = db.get(Patient, consultation.patient_id)
    documents = (
        db.query(Document)
        .filter(Document.consultation_id == consultation_id, Document.status == "accepted")
        .all()
    )
    result = consultation_bundle(
        patient.id,
        summary.content,
        True,
        abha_number=patient.abha_id,
        doctor_name=staff.get("preferred_username"),
        documents=[{"id": item.id, "filename": item.filename} for item in documents],
    )
    actor = staff.get("preferred_username") or staff.get("sub") or "physician"
    db.add(
        AuditEvent(
            id=str(uuid.uuid4()),
            actor=actor,
            action="fhir_bundle_exported",
            entity_type="consultation",
            entity_id=consultation_id,
            detail={"summary_id": summary.id},
        )
    )
    db.commit()
    return result
