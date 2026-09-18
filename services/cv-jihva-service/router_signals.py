from fastapi import APIRouter, UploadFile, File, HTTPException
from jihva_analyzer import analyze_jihva
from prakriti_voice_extractor import analyze_voice
router = APIRouter(prefix="/signals", tags=["supporting signals"])
@router.post("/jihva")
async def jihva(image: UploadFile = File(...)):
    try: return analyze_jihva(await image.read())
    except ValueError as error: raise HTTPException(422, str(error))
@router.post("/voice")
async def voice(audio: UploadFile = File(...)):
    try: return analyze_voice(await audio.read())
    except ValueError as error: raise HTTPException(422, str(error))
