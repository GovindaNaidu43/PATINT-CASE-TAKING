from fastapi import APIRouter
from pydantic import BaseModel, Field
from state_machine import InterviewState
router = APIRouter(prefix="/dialogue", tags=["dialogue"]); sessions: dict[str, InterviewState] = {}
class Turn(BaseModel): consultation_id: str; text: str = Field(min_length=1, max_length=5000)
@router.post("/turn")
def add_turn(turn: Turn): return sessions.setdefault(turn.consultation_id, InterviewState()).process(turn.text)
