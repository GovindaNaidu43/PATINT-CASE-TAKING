import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Consultation, Patient
from schemas import ConsultationCreate
router = APIRouter(prefix="/consultations", tags=["consultations"])
@router.post("", status_code=201)
def create_consultation(payload: ConsultationCreate, db: Session = Depends(get_db)):
    if not db.get(Patient, payload.patient_id): raise HTTPException(404, "Patient not found")
    consultation = Consultation(id=str(uuid.uuid4()), patient_id=payload.patient_id, turns=[]); db.add(consultation); db.commit()
    return {"id": consultation.id, "status": consultation.status}
