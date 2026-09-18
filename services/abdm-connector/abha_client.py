import uuid
class ABHAClient:
    def verify(self, abha_address: str) -> dict:
        if not abha_address: raise ValueError("ABHA identifier is required")
        return {"verified": True, "mode": "mock", "transaction_id": str(uuid.uuid4()), "abha_address": abha_address}
