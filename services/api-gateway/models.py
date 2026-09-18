from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    abha_id: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    consent_granted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
class Consultation(Base):
    __tablename__ = "consultations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    status: Mapped[str] = mapped_column(String, default="active")
    turns: Mapped[list] = mapped_column(JSON, default=list)
class SummaryDraft(Base):
    __tablename__ = "summary_drafts"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    consultation_id: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text)
    sources: Mapped[list] = mapped_column(JSON)
    physician_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
