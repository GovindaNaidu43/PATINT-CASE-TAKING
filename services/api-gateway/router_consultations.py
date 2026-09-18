import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db
from models import AuditEvent, Consultation, ConsentRecord, Patient, Prescription
from schemas import ConsultationCreate, PrescriptionCreate
from security import kiosk_identity, require_physician, require_staff
from events import hub
router = APIRouter(prefix="/consultations", tags=["consultations"])
@router.post("", status_code=201)
async def create_consultation(payload: ConsultationCreate, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    if not db.get(Patient, payload.patient_id): raise HTTPException(404, "Patient not found")
    consultation = Consultation(id=str(uuid.uuid4()), patient_id=payload.patient_id, turns=[]); db.add(consultation); db.commit()
    await hub.publish("consultation.created", {"consultation_id": consultation.id, "patient_id": consultation.patient_id, "status": consultation.status})
    return {"id": consultation.id, "status": consultation.status}

@router.get("/{consultation_id}")
def get_consultation(consultation_id: str, _: dict = Depends(require_staff), db: Session = Depends(get_db)):
    consultation = db.get(Consultation, consultation_id)
    if not consultation: raise HTTPException(404, "Consultation not found")
    patient = db.get(Patient, consultation.patient_id)
    consent = db.execute(select(ConsentRecord).where(ConsentRecord.consultation_id == consultation.id).order_by(ConsentRecord.granted_at.desc())).scalars().first()
    prescriptions = db.execute(select(Prescription).where(Prescription.consultation_id == consultation.id).order_by(Prescription.created_at.desc())).scalars().all()
    return {"id": consultation.id, "status": consultation.status, "created_at": consultation.created_at.isoformat(), "updated_at": consultation.updated_at.isoformat(), "patient": {"id": patient.id, "name": patient.name, "age": patient.age, "gender": patient.gender, "contact": patient.contact, "blood_group": patient.blood_group, "occupation": patient.occupation, "abha_id": patient.abha_id}, "turns": consultation.turns or [], "red_flags": consultation.red_flags or [], "consent": {"purposes": consent.purposes, "language": consent.language, "granted_at": consent.granted_at.isoformat()} if consent else None, "prescriptions": [prescription_response(item) for item in prescriptions]}

@router.post("/{consultation_id}/prescriptions", status_code=201)
def create_prescription(consultation_id: str, payload: PrescriptionCreate, staff: dict = Depends(require_physician), db: Session = Depends(get_db)):
    consultation = db.get(Consultation, consultation_id)
    if not consultation or payload.consultation_id != consultation_id: raise HTTPException(404, "Consultation not found")
    clinician = staff.get("preferred_username") or staff.get("sub") or "physician"
    prescription = Prescription(id=str(uuid.uuid4()), consultation_id=consultation.id, patient_id=consultation.patient_id, remedy=payload.remedy, potency=payload.potency, dosage=payload.dosage, schedule=payload.schedule, duration=payload.duration, instructions=payload.instructions, prescribed_by=clinician)
    db.add(prescription); db.add(AuditEvent(id=str(uuid.uuid4()), actor=clinician, action="prescription_created", entity_type="consultation", entity_id=consultation.id, detail={"prescription_id": prescription.id})); db.commit(); db.refresh(prescription)
    return prescription_response(prescription)

@router.post("/{consultation_id}/prescriptions/{prescription_id}/sign")
def sign_prescription(consultation_id: str, prescription_id: str, staff: dict = Depends(require_physician), db: Session = Depends(get_db)):
    prescription = db.get(Prescription, prescription_id)
    if not prescription or prescription.consultation_id != consultation_id: raise HTTPException(404, "Prescription not found")
    prescription.status = "signed"; clinician = staff.get("preferred_username") or staff.get("sub") or "physician"
    db.add(AuditEvent(id=str(uuid.uuid4()), actor=clinician, action="prescription_signed", entity_type="prescription", entity_id=prescription.id, detail={})); db.commit(); db.refresh(prescription)
    return prescription_response(prescription)

def prescription_response(item: Prescription) -> dict:
    return {"id": item.id, "consultation_id": item.consultation_id, "patient_id": item.patient_id, "remedy": item.remedy, "potency": item.potency, "dosage": item.dosage, "schedule": item.schedule, "duration": item.duration, "instructions": item.instructions, "status": item.status, "prescribed_by": item.prescribed_by, "created_at": item.created_at.isoformat()}
