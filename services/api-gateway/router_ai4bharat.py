from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ai4bharat_client import AI4BharatClient
from security import ai_identity

router = APIRouter(prefix="/api/ai", tags=["AI4Bharat"])
client = AI4BharatClient()

class ASRRequest(BaseModel): audio_base64: str = Field(min_length=1, max_length=15_000_000); language: str = Field(default="hi", min_length=2, max_length=10)
class TTSRequest(BaseModel): text: str = Field(min_length=1, max_length=5000); language: str = Field(default="hi", min_length=2, max_length=10)
class TranslateRequest(BaseModel): text: str = Field(min_length=1, max_length=5000); source_lang: str = Field(min_length=2, max_length=10); target_lang: str = Field(min_length=2, max_length=10)
class TransliterateRequest(BaseModel): text: str = Field(min_length=1, max_length=5000); target_lang: str = Field(default="hi", min_length=2, max_length=10)
class LMMCRequest(BaseModel): narrative: str = Field(min_length=1, max_length=10000); language: str = Field(default="hi", min_length=2, max_length=10)

@router.post("/asr")
def asr(payload: ASRRequest, _: str | dict = Depends(ai_identity)):
    try: return client.speech_to_text(payload.audio_base64, payload.language)
    except (ValueError, KeyError) as error: raise HTTPException(422, str(error))

@router.post("/tts")
def tts(payload: TTSRequest, _: str | dict = Depends(ai_identity)):
    try: return client.text_to_speech(payload.text, payload.language)
    except (ValueError, KeyError) as error: raise HTTPException(422, str(error))

@router.post("/translate")
def translate(payload: TranslateRequest, _: str | dict = Depends(ai_identity)):
    try: return client.translate(payload.text, payload.source_lang, payload.target_lang)
    except (ValueError, KeyError) as error: raise HTTPException(422, str(error))

@router.post("/transliterate")
def transliterate(payload: TransliterateRequest, _: str | dict = Depends(ai_identity)):
    try: return client.transliterate(payload.text, payload.target_lang)
    except (ValueError, KeyError) as error: raise HTTPException(422, str(error))

@router.post("/lmmc")
def lmmc(payload: LMMCRequest, _: str | dict = Depends(ai_identity)):
    try: return client.extract_lmmc(payload.narrative, payload.language)
    except ValueError as error: raise HTTPException(422, str(error))