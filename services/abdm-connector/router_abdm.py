from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from abha_client import ABHAClient
from consent_manager import handle_webhook
router = APIRouter(prefix="/abdm", tags=["ABDM"])
class Verify(BaseModel): abha_address: str
@router.post("/abha/verify")
def verify(data: Verify): return ABHAClient().verify(data.abha_address)
@router.post("/consent/webhook")
def consent(payload: dict):
    try: return handle_webhook(payload)
    except ValueError as error: raise HTTPException(422, str(error))
