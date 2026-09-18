def handle_webhook(payload: dict) -> dict:
    consent_id = payload.get("consentId") or payload.get("consent_id")
    if not consent_id: raise ValueError("consentId is required")
    return {"consent_id": consent_id, "status": payload.get("status", "received"), "processed": True}
