"""Background tasks for follow-up processing and response assessment."""
import uuid
from datetime import datetime, timezone
from medikiosk.modules.dialogue.red_flags import detect_red_flags
from medikiosk.modules.followup.telephony import TelephonyClient


def assess_response(text: str) -> dict:
    flags = detect_red_flags(text)
    return {
        "escalate": bool(flags),
        "red_flags": flags,
        "message": "Clinical escalation required" if flags else "Continue monitoring",
    }


def process_due_followups(db, now: datetime | None = None) -> int:
    from medikiosk.domain.models import FollowUp, FollowUpAttempt, Patient

    current = now or datetime.now(timezone.utc).replace(tzinfo=None)
    processed = 0
    for followup in (
        db.query(FollowUp)
        .filter(FollowUp.status == "scheduled", FollowUp.due_at <= current)
        .all()
    ):
        patient = db.get(Patient, followup.patient_id)
        message = (
            f"Namaste {patient.name if patient else 'there'}, "
            f"this is your MediKiosk follow-up. "
            f"Reply 1 if improving, 2 if unchanged, 3 if worsening."
        )
        try:
            result = TelephonyClient().send_checkin(followup.destination, message)
            followup.status = "sent"
            attempt = FollowUpAttempt(
                id=str(uuid.uuid4()),
                followup_id=followup.id,
                status=result["status"],
                provider=result.get("provider", "unknown"),
                provider_id=result.get("id"),
            )
        except Exception as error:
            followup.status = "failed"
            attempt = FollowUpAttempt(
                id=str(uuid.uuid4()),
                followup_id=followup.id,
                status="failed",
                provider="unknown",
                error=str(error),
            )
        db.add(attempt)
        processed += 1
    db.commit()
    return processed
