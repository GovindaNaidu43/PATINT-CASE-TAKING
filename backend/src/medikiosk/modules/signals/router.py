"""FastAPI router for supporting clinical signals (Jihva, Voice)."""
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from sqlalchemy.orm import Session
from medikiosk.core.database import get_db
from medikiosk.core.security import kiosk_identity
from medikiosk.domain.models import Consultation, SupportingSignal
from medikiosk.modules.signals.jihva_analyzer import analyze_jihva
from medikiosk.modules.signals.voice_extractor import analyze_voice

router = APIRouter(prefix="/signals", tags=["supporting signals"])


@router.post("/jihva")
async def jihva(
    image: UploadFile = File(...),
    consultation_id: str = Form(...),
    _: str = Depends(kiosk_identity),
    db: Session = Depends(get_db),
):
    consultation = db.get(Consultation, consultation_id)
    if not consultation:
        raise HTTPException(404, "Consultation not found")
    try:
        result = analyze_jihva(await image.read())
        signal = SupportingSignal(
            id=str(uuid.uuid4()),
            consultation_id=consultation.id,
            kind="jihva",
            payload=result,
        )
        db.add(signal)
        db.commit()
        return {"id": signal.id, **result, "consultation_id": consultation.id}
    except ValueError as error:
        raise HTTPException(422, str(error))


@router.post("/voice")
async def voice(audio: UploadFile = File(...)):
    try:
        return analyze_voice(await audio.read())
    except ValueError as error:
        raise HTTPException(422, str(error))
