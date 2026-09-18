from typing import Literal
from pydantic import BaseModel, Field
class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    abha_id: str | None = None
    consent_granted: bool = False
class ConsultationCreate(BaseModel): patient_id: str
class ConsentCreate(BaseModel):
    consultation_id: str
    purposes: list[Literal["care", "voice_biomarker", "jihva_image", "followup"]] = Field(min_length=1)
    language: Literal["en", "hi"]
class DialogueTurn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    modality: Literal["voice", "touch", "text"] = "text"
    language: Literal["en", "hi"] = "en"
