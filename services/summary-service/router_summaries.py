import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from llm_summarizer import summarize
router = APIRouter(prefix="/summaries", tags=["grounded summaries"]); drafts = {}
class SummaryRequest(BaseModel): consultation_id: str; facts: list[str]; sources: list[str]
@router.post("", status_code=201)
def create(payload: SummaryRequest):
    try: draft = summarize(payload.facts, payload.sources)
    except ValueError as error: raise HTTPException(422, str(error))
    draft["id"] = str(uuid.uuid4()); draft["consultation_id"] = payload.consultation_id; drafts[draft["id"]] = draft; return draft
@router.post("/{draft_id}/confirm")
def confirm(draft_id: str, physician_id: str):
    draft = drafts.get(draft_id)
    if not draft: raise HTTPException(404, "Summary draft not found")
    if not physician_id.strip(): raise HTTPException(422, "Physician identity is required")
    draft.update(physician_confirmed=True, status="physician_confirmed", confirmed_by=physician_id); return draft
@router.post("/{draft_id}/release")
def release(draft_id: str):
    draft = drafts.get(draft_id)
    if not draft: raise HTTPException(404, "Summary draft not found")
    if not draft["physician_confirmed"]: raise HTTPException(409, "Physician confirmation is required before release")
    return {"status": "released", "draft_id": draft_id}
