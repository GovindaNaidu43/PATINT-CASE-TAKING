from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Consultation
from schemas import DialogueTurn
from state_machine import InterviewState
from security import kiosk_identity
from events import hub
router = APIRouter(prefix="/dialogue", tags=["dialogue"])

@router.post("/turn")
async def add_turn(consultation_id: str, turn: DialogueTurn, _: str = Depends(kiosk_identity), db: Session = Depends(get_db)):
	consultation = db.get(Consultation, consultation_id)
	if not consultation:
		raise HTTPException(404, "Consultation not found")

	state = InterviewState.from_turns(consultation.turns or [])
	result = state.process(turn.text, turn.modality, turn.language)
	consultation.turns = [
		*(consultation.turns or []),
		{
			"text": turn.text,
			"modality": turn.modality,
			"language": turn.language,
			"answer_key": result["answered_key"],
			"phase": result["phase"],
			"red_flags": result["red_flags"],
		},
	]
	known_flags = {flag["phrase"]: flag for flag in (consultation.red_flags or [])}
	known_flags.update({flag["phrase"]: flag for flag in result["red_flags"]})
	consultation.red_flags = list(known_flags.values())
	consultation.status = "priority_review" if result["red_flags"] else ("awaiting_review" if result["phase"] == "complete" else "active")
	db.add(consultation)
	db.commit()
	await hub.publish("consultation.updated", {"consultation_id": consultation.id, "patient_id": consultation.patient_id, "status": consultation.status, "red_flag_count": len(consultation.red_flags or [])})
	return {"consultation_id": consultation_id, **result}
