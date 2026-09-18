import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import AuditEvent, ConsentRecord, Consultation, Patient
from schemas import ConsentCreate, PatientCreate
from security import kiosk_identity
router = APIRouter(prefix="/patients", tags=["patients"])
@router.get("")
def find_patient(abha_id: str, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.abha_id == abha_id).one_or_none()
    if not patient: raise HTTPException(404, "Patient not found locally")
    return patient_response(patient)
@router.post("", status_code=201)
def create_patient(payload: PatientCreate, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    # Consent is recorded only by the dedicated, auditable consent endpoint.
    patient = Patient(id=str(uuid.uuid4()), name=payload.name, age=payload.age, gender=payload.gender, contact=payload.contact, blood_group=payload.blood_group, occupation=payload.occupation, abha_id=payload.abha_id, consent_granted=False); db.add(patient); db.commit(); db.refresh(patient)
    return patient_response(patient)
@router.get("/{patient_id}")
def get_patient(patient_id: str, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    patient = db.get(Patient, patient_id)
    if not patient: raise HTTPException(404, "Patient not found")
    return patient_response(patient)

def patient_response(patient: Patient) -> dict:
    return {"id": patient.id, "name": patient.name, "age": patient.age, "gender": patient.gender, "contact": patient.contact, "blood_group": patient.blood_group, "occupation": patient.occupation, "abha_id": patient.abha_id, "consent_granted": patient.consent_granted}
@router.post("/consents", status_code=201)
def grant_consent(payload: ConsentCreate, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    consultation = db.get(Consultation, payload.consultation_id)
    if not consultation: raise HTTPException(404, "Consultation not found")
    consent = ConsentRecord(id=str(uuid.uuid4()), patient_id=consultation.patient_id, consultation_id=consultation.id, purposes=payload.purposes, language=payload.language)
    patient = db.get(Patient, consultation.patient_id)
    patient.consent_granted = True
    db.add_all([consent, AuditEvent(id=str(uuid.uuid4()), actor="kiosk", action="consent_granted", entity_type="consultation", entity_id=consultation.id, detail={"purposes": payload.purposes, "language": payload.language})])
    db.commit()
    return {"id": consent.id, "consultation_id": consent.consultation_id, "purposes": consent.purposes, "granted_at": consent.granted_at.isoformat()}
