import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import AuditEvent, Consultation, Document
from security import kiosk_identity, require_staff
from ocr_engine import extract_text
from ner_extractor import extract_entities
from ocr_processor import DocumentDigitizer
router = APIRouter(prefix="/documents", tags=["documents"]); review_queue = []
digitizer = DocumentDigitizer()
@router.post("/ingest")
async def ingest(file: UploadFile = File(...), consultation_id: str = Form(...), _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    consultation = db.get(Consultation, consultation_id)
    if not consultation: raise HTTPException(404, "Consultation not found")
    content = await file.read(); text = digitizer.extract_text_from_image(content, file.filename or "document")
    result = {"text": text, "engine": "tesseract-or-text-fallback", "requires_hitl_review": True, "filename": file.filename or "document", "entities": {**extract_entities(text), **digitizer.parse_clinical_entities(text)}}
    document = Document(id=str(uuid.uuid4()), patient_id=consultation.patient_id, consultation_id=consultation.id, filename=result["filename"], raw_text=result["text"], entities=result["entities"])
    db.add(document); db.commit(); db.refresh(document); review_queue.append(result)
    return {"id": document.id, **result, "status": document.status}
@router.get("/review-queue")
def review_items(_: dict = Depends(require_staff), db: Session = Depends(get_db)): return {"items": [{"id": item.id, "consultation_id": item.consultation_id, "filename": item.filename, "entities": item.entities, "status": item.status, "created_at": item.created_at.isoformat()} for item in db.query(Document).filter(Document.status == "pending_review").order_by(Document.created_at.desc()).all()]}

@router.get("/{document_id}")
def get_document(document_id: str, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
    document = db.get(Document, document_id)
    if not document: raise HTTPException(404, "Document not found")
    return {"id": document.id, "consultation_id": document.consultation_id, "filename": document.filename, "text": document.raw_text, "entities": document.entities, "status": document.status}

@router.post("/{document_id}/review")
def review(document_id: str, decision: str = Form(...), staff: dict = Depends(require_staff), db: Session = Depends(get_db)):
    if decision not in {"accepted", "rejected"}: raise HTTPException(422, "Decision must be accepted or rejected")
    document = db.get(Document, document_id)
    if not document: raise HTTPException(404, "Document not found")
    actor = staff.get("preferred_username") or staff.get("sub") or "staff"; document.status = decision; document.reviewed_by = actor; document.reviewed_at = datetime.utcnow(); db.add(AuditEvent(id=str(uuid.uuid4()), actor=actor, action=f"document_{decision}", entity_type="document", entity_id=document.id, detail={})); db.commit()
    return {"id": document.id, "status": document.status, "reviewed_at": document.reviewed_at.isoformat()}
