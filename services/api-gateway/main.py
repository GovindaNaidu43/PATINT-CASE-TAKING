"""MediKiosk API gateway."""
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

HERE = Path(__file__).resolve().parent
for directory in (HERE, HERE.parent / "dialogue-engine", HERE.parent / "ocr-ner-service", HERE.parent / "cv-jihva-service", HERE.parent / "voice-prakriti-service", HERE.parent / "summary-service", HERE.parent / "abdm-connector", HERE.parent / "followup-service"):
    sys.path.insert(0, str(directory))
from database import Base, engine
from router_patients import router as patients_router
from router_consultations import router as consultations_router
from router_dialogue import router as dialogue_router
from router_ocr import router as ocr_router
from router_signals import router as signals_router
from router_summaries import router as summaries_router
from router_abdm import router as abdm_router
from router_followup import router as followup_router

Base.metadata.create_all(bind=engine)
app = FastAPI(title="MediKiosk", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
for router in (patients_router, consultations_router, dialogue_router, ocr_router, signals_router, summaries_router, abdm_router, followup_router): app.include_router(router)
@app.get("/health", tags=["system"])
def health(): return {"status": "ok", "clinical_decision_support": True}
