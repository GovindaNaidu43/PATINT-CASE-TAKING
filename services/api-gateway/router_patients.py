import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Patient
from schemas import PatientCreate
router = APIRouter(prefix="/patients", tags=["patients"])
@router.post("", status_code=201)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(id=str(uuid.uuid4()), **payload.model_dump()); db.add(patient); db.commit(); db.refresh(patient)
    return {"id": patient.id, "name": patient.name, "consent_granted": patient.consent_granted}
@router.get("/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.get(Patient, patient_id)
    if not patient: raise HTTPException(404, "Patient not found")
    return {"id": patient.id, "name": patient.name, "abha_id": patient.abha_id, "consent_granted": patient.consent_granted}
