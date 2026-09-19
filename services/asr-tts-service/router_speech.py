from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from asr_tts_client import ASRTTSClient
from security import kiosk_identity

router = APIRouter(prefix="/speech", tags=["speech"])

class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    language: str = Field(default="hi", min_length=2, max_length=10)

@router.post("/tts")
def text_to_speech(payload: TTSRequest, _: str = Depends(kiosk_identity)):
    try: return ASRTTSClient().synthesize(payload.text, payload.language)
    except (ValueError, KeyError) as error: raise HTTPException(422, str(error))