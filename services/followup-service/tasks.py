from datetime import datetime, timedelta, timezone
from red_flags import detect_red_flags
def schedule_followup(consultation_id: str, destination: str, hours=24) -> dict:
    return {"consultation_id": consultation_id, "destination": destination, "due_at": (datetime.now(timezone.utc) + timedelta(hours=hours)).isoformat(), "status": "scheduled"}
def assess_response(text: str) -> dict:
    flags = detect_red_flags(text)
    return {"escalate": bool(flags), "red_flags": flags, "message": "Clinical escalation required" if flags else "Continue monitoring"}
