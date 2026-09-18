import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import AuditEvent, Consultation, SummaryDraft
from security import require_physician, require_staff
from llm_summarizer import summarize
router = APIRouter(prefix="/summaries", tags=["grounded summaries"])
class SummaryRequest(BaseModel): consultation_id: str; facts: list[str]; sources: list[str]
@router.post("", status_code=201)
def create(payload: SummaryRequest, _: dict = Depends(require_staff), db: Session = Depends(get_db)):
    if not db.get(Consultation, payload.consultation_id): raise HTTPException(404, "Consultation not found")
    try: draft = summarize(payload.facts, payload.sources)
    except ValueError as error: raise HTTPException(422, str(error))
    record = SummaryDraft(id=str(uuid.uuid4()), consultation_id=payload.consultation_id, content=draft["content"], sources=draft["sources"], physician_confirmed=False); db.add(record); db.commit(); db.refresh(record); return summary_response(record)
@router.post("/{draft_id}/confirm")
def confirm(draft_id: str, staff: dict = Depends(require_physician), db: Session = Depends(get_db)):
    draft = db.get(SummaryDraft, draft_id)
    if not draft: raise HTTPException(404, "Summary draft not found")
    physician_id = staff.get("preferred_username") or staff.get("sub") or "physician"; draft.physician_confirmed = True
    db.add(AuditEvent(id=str(uuid.uuid4()), actor=physician_id, action="summary_confirmed", entity_type="summary", entity_id=draft.id, detail={"consultation_id": draft.consultation_id})); db.commit(); db.refresh(draft); return summary_response(draft)
@router.post("/{draft_id}/release")
def release(draft_id: str, _: dict = Depends(require_physician), db: Session = Depends(get_db)):
    draft = db.get(SummaryDraft, draft_id)
    if not draft: raise HTTPException(404, "Summary draft not found")
    if not draft.physician_confirmed: raise HTTPException(409, "Physician confirmation is required before release")
    return {"status": "released", "draft_id": draft_id}

def summary_response(draft: SummaryDraft) -> dict:
    return {"id": draft.id, "consultation_id": draft.consultation_id, "content": draft.content, "sources": draft.sources, "physician_confirmed": draft.physician_confirmed, "status": "physician_confirmed" if draft.physician_confirmed else "draft"}
