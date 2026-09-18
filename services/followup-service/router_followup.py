from fastapi import APIRouter
from pydantic import BaseModel
from tasks import schedule_followup, assess_response
router = APIRouter(prefix="/followups", tags=["follow-up"])
class Schedule(BaseModel): consultation_id: str; destination: str; hours: int = 24
class Response(BaseModel): text: str
@router.post("/schedule")
def schedule(data: Schedule): return schedule_followup(data.consultation_id, data.destination, data.hours)
@router.post("/response")
def response(data: Response): return assess_response(data.text)
