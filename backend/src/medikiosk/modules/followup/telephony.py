"""Telephony client for patient follow-up SMS/IVR outreach."""


class TelephonyClient:
    def send_checkin(self, destination: str, message: str) -> dict:
        if not destination:
            raise ValueError("A destination is required")
        return {
            "status": "queued",
            "provider": "mock",
            "destination": destination,
            "message": message,
        }
