import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db
from models import Consultation, Patient
from security import require_staff
from events import hub

router = APIRouter(prefix="/operations", tags=["doctor operations"])

@router.get("/queue")
def queue(_: dict = Depends(require_staff), db: Session = Depends(get_db)):
    rows = db.execute(
        select(Consultation, Patient).join(Patient, Consultation.patient_id == Patient.id).order_by(Consultation.created_at.desc())
    ).all()
    return [{
        "consultation_id": consultation.id, "patient_id": patient.id, "patient_name": patient.name,
        "status": consultation.status, "red_flag_count": len(consultation.red_flags or []),
        "created_at": consultation.created_at.isoformat(),
    } for consultation, patient in rows]

@router.get("/events")
async def events(_: dict = Depends(require_staff)):
    async def generate():
        async for event in hub.stream():
            yield f"event: {event['type']}\ndata: {json.dumps(event['data'])}\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
