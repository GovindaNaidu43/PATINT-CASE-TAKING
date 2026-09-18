from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    age: Mapped[int | None] = mapped_column(nullable=True)
    gender: Mapped[str | None] = mapped_column(String(30), nullable=True)
    contact: Mapped[str | None] = mapped_column(String(40), nullable=True)
    blood_group: Mapped[str | None] = mapped_column(String(5), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(120), nullable=True)
    abha_id: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    consent_granted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
class Consultation(Base):
    __tablename__ = "consultations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    status: Mapped[str] = mapped_column(String, default="active")
    turns: Mapped[list] = mapped_column(JSON, default=list)
    red_flags: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
class ConsentRecord(Base):
    __tablename__ = "consent_records"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    consultation_id: Mapped[str] = mapped_column(ForeignKey("consultations.id"), index=True)
    purposes: Mapped[list] = mapped_column(JSON)
    language: Mapped[str] = mapped_column(String(10))
    granted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    actor: Mapped[str] = mapped_column(String)
    action: Mapped[str] = mapped_column(String)
    entity_type: Mapped[str] = mapped_column(String)
    entity_id: Mapped[str] = mapped_column(String)
    detail: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
class SummaryDraft(Base):
    __tablename__ = "summary_drafts"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    consultation_id: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text)
    sources: Mapped[list] = mapped_column(JSON)
    physician_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)

class Prescription(Base):
    __tablename__ = "prescriptions"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    consultation_id: Mapped[str] = mapped_column(ForeignKey("consultations.id"), index=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    remedy: Mapped[str] = mapped_column(String)
    potency: Mapped[str] = mapped_column(String)
    dosage: Mapped[str] = mapped_column(String)
    schedule: Mapped[str] = mapped_column(String)
    duration: Mapped[str] = mapped_column(String)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, default="draft")
    prescribed_by: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class FollowUp(Base):
    __tablename__ = "followups"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    consultation_id: Mapped[str] = mapped_column(ForeignKey("consultations.id"), index=True)
    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"), index=True)
    destination: Mapped[str] = mapped_column(String)
    due_at: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="scheduled")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
