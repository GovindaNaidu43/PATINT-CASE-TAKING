from typing import Literal
from pydantic import BaseModel, Field
class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    age: int | None = Field(default=None, ge=0, le=130)
    gender: str | None = Field(default=None, max_length=30)
    contact: str | None = Field(default=None, max_length=40)
    blood_group: str | None = Field(default=None, max_length=5)
    occupation: str | None = Field(default=None, max_length=120)
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

class PrescriptionCreate(BaseModel):
    consultation_id: str
    remedy: str = Field(min_length=1, max_length=200)
    potency: str = Field(min_length=1, max_length=40)
    dosage: str = Field(min_length=1, max_length=120)
    schedule: str = Field(min_length=1, max_length=120)
    duration: str = Field(min_length=1, max_length=120)
    instructions: str | None = Field(default=None, max_length=1000)
