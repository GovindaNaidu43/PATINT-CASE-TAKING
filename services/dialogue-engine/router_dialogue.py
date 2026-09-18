from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Consultation
from schemas import DialogueTurn
from state_machine import InterviewState
router = APIRouter(prefix="/dialogue", tags=["dialogue"])

@router.post("/turn")
def add_turn(consultation_id: str, turn: DialogueTurn, db: Session = Depends(get_db)):
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
	db.add(consultation)
	db.commit()
	return {"consultation_id": consultation_id, **result}
