from pydantic import BaseModel, Field
class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    abha_id: str | None = None
    consent_granted: bool = False
class ConsultationCreate(BaseModel): patient_id: str
class DialogueTurn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    modality: str = "text"
