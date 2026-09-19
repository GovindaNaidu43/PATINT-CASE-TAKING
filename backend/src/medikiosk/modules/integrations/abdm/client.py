"""ABHA client for ABDM identity verification and OTP confirmation."""
import uuid
from medikiosk.config import settings

_mock_transactions: dict[str, str] = {}


class ABHAClient:
    def verify(self, abha_address: str) -> dict:
        if not abha_address:
            raise ValueError("ABHA identifier is required")
        return {
            "verified": True,
            "mode": "mock",
            "transaction_id": str(uuid.uuid4()),
            "abha_address": abha_address,
        }

    def request_otp(self, abha_address: str) -> dict:
        if not abha_address.strip():
            raise ValueError("ABHA identifier is required")
        if settings.mock_external_services:
            transaction_id = str(uuid.uuid4())
            _mock_transactions[transaction_id] = abha_address
            return {
                "accepted": True,
                "mode": "mock",
                "transaction_id": transaction_id,
                "message": "Use OTP 123456 in local mock mode.",
            }
        import httpx

        token = self._session_token()
        response = httpx.post(
            f"{settings.abdm_base_url.rstrip('/')}/gateway/v0.5/identity/verify/requestOtp",
            headers={"Authorization": f"Bearer {token}"},
            json={"healthId": abha_address, "authMethod": "MOBILE_OTP"},
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    def confirm_otp(self, transaction_id: str, otp: str) -> dict:
        if not transaction_id or not otp:
            raise ValueError("Transaction ID and OTP are required")
        if settings.mock_external_services:
            if _mock_transactions.get(transaction_id) is None or otp != "123456":
                raise ValueError("Invalid mock OTP")
            return {
                "verified": True,
                "mode": "mock",
                "transaction_id": transaction_id,
                "abha_address": _mock_transactions[transaction_id],
                "profile": {},
            }
        import httpx

        token = self._session_token()
        response = httpx.post(
            f"{settings.abdm_base_url.rstrip('/')}/gateway/v0.5/identity/verify/confirmOtp",
            headers={"Authorization": f"Bearer {token}"},
            json={"transactionId": transaction_id, "otp": otp},
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    def _session_token(self) -> str:
        if not settings.abdm_client_id or not settings.abdm_client_secret:
            raise RuntimeError("ABDM credentials are not configured")
        import httpx

        response = httpx.post(
            f"{settings.abdm_base_url.rstrip('/')}/gateway/v0.5/sessions",
            json={"clientId": settings.abdm_client_id, "clientSecret": settings.abdm_client_secret},
            timeout=15,
        )
        response.raise_for_status()
        return response.json()["accessToken"]
