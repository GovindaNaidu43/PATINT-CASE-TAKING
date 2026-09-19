"""MediKiosk API gateway."""
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

HERE = Path(__file__).resolve().parent
for directory in (HERE, HERE.parent / "dialogue-engine", HERE.parent / "ocr-ner-service", HERE.parent / "cv-jihva-service", HERE.parent / "voice-prakriti-service", HERE.parent / "summary-service", HERE.parent / "abdm-connector", HERE.parent / "followup-service", HERE.parent / "asr-tts-service"):
    sys.path.insert(0, str(directory))
from database import Base, engine, migrate_sqlite_schema
from router_patients import router as patients_router
from router_consultations import router as consultations_router
from router_dialogue import router as dialogue_router
from router_ocr import router as ocr_router
from router_signals import router as signals_router
from router_summaries import router as summaries_router
from router_abdm import router as abdm_router
from router_followup import router as followup_router
from router_operations import router as operations_router
from router_speech import router as speech_router
from router_biometric import router as biometric_router
from router_ai4bharat import router as ai4bharat_router
from config import settings

Base.metadata.create_all(bind=engine)
migrate_sqlite_schema()
app = FastAPI(title="MediKiosk", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
for router in (patients_router, consultations_router, dialogue_router, ocr_router, signals_router, summaries_router, abdm_router, followup_router, operations_router, speech_router, biometric_router, ai4bharat_router): app.include_router(router)
@app.get("/health", tags=["system"])
def health(): return {"status": "ok", "clinical_decision_support": True}
