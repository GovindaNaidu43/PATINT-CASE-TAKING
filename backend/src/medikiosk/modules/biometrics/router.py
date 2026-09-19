"""FastAPI router for biometric step-up authentication."""
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from medikiosk.core.database import get_db
from medikiosk.core.security import require_physician, require_staff
from medikiosk.domain.models import AuditEvent, BiometricProfile
from medikiosk.modules.biometrics.crypto import build_template, matches, recovery_hash

router = APIRouter(prefix="/auth/biometric", tags=["biometric authentication"])
challenges: dict[str, datetime] = {}


class QualitySample(BaseModel):
    pitch: float = Field(ge=-90, le=90)
    yaw: float = Field(ge=-90, le=90)
    lux: float = Field(ge=0)
    width: int = Field(ge=0)
    height: int = Field(ge=0)


class Enrollment(BaseModel):
    challenge: str
    descriptors: list[list[float]] = Field(min_length=5, max_length=5)
    quality: list[QualitySample] = Field(min_length=5, max_length=5)
    liveness_passed: bool
    biometric_consent: bool


class Verification(BaseModel):
    challenge: str
    descriptor: list[float]
    liveness_passed: bool


class Recovery(BaseModel):
    recovery_key: str = Field(min_length=24, max_length=200)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


@router.post("/challenge")
def challenge(staff: dict = Depends(require_staff)):
    value = secrets.token_urlsafe(32)
    challenges[value] = _utcnow() + timedelta(minutes=5)
    return {"challenge": value, "expires_at": challenges[value].isoformat(), "purpose": "biometric_step_up"}


@router.post("/enroll", status_code=201)
def enroll(
    payload: Enrollment,
    staff: dict = Depends(require_physician),
    db: Session = Depends(get_db),
):
    subject = staff.get("sub")
    _validate_challenge(payload.challenge)
    _validate_enrollment(payload)
    if not subject:
        raise HTTPException(400, "Staff subject claim is required")
    encrypted, nonce, salt = build_template(payload.descriptors)
    recovery_key = secrets.token_urlsafe(32)
    existing = db.query(BiometricProfile).filter(BiometricProfile.subject == subject).one_or_none()
    profile = existing or BiometricProfile(
        id=str(uuid.uuid4()),
        subject=subject,
        recovery_key_hash=recovery_hash(recovery_key),
    )
    profile.encrypted_template = encrypted
    profile.nonce = nonce
    profile.salt = salt
    profile.recovery_key_hash = recovery_hash(recovery_key)
    profile.failed_attempts = 0
    profile.locked_until = None
    profile.revoked_at = None
    profile.consented_at = _utcnow()
    db.add(profile)
    db.add(
        AuditEvent(
            id=str(uuid.uuid4()),
            actor=subject,
            action="biometric_enrolled",
            entity_type="biometric_profile",
            entity_id=profile.id,
            detail={"liveness": True, "sample_count": 5},
        )
    )
    db.commit()
    return {
        "profile_id": profile.id,
        "recovery_key": recovery_key,
        "warning": "Store this recovery key once. It cannot be displayed again.",
    }


@router.post("/verify")
def verify(
    payload: Verification,
    staff: dict = Depends(require_staff),
    db: Session = Depends(get_db),
):
    subject = staff.get("sub")
    _validate_challenge(payload.challenge)
    if not payload.liveness_passed:
        raise HTTPException(401, "Liveness verification is required")
    profile = (
        db.query(BiometricProfile)
        .filter(BiometricProfile.subject == subject, BiometricProfile.revoked_at.is_(None))
        .one_or_none()
    )
    if not profile:
        raise HTTPException(404, "No biometric profile enrolled")
    if profile.locked_until and profile.locked_until > _utcnow():
        raise HTTPException(429, "Face verification is locked; use OTP recovery")
    try:
        valid = matches(payload.descriptor, profile.encrypted_template, profile.nonce, profile.salt)
    except (ValueError, RuntimeError):
        raise HTTPException(422, "Invalid biometric template")
    if not valid:
        profile.failed_attempts += 1
        if profile.failed_attempts >= 3:
            profile.locked_until = _utcnow() + timedelta(minutes=15)
        db.commit()
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS if profile.locked_until else status.HTTP_401_UNAUTHORIZED,
            "Face verification failed; use OTP recovery",
        )
    profile.failed_attempts = 0
    db.commit()
    return {"verified": True, "subject": subject, "step_up": True, "session": "existing-keycloak-session-required"}


@router.post("/revoke")
def revoke(staff: dict = Depends(require_staff), db: Session = Depends(get_db)):
    subject = staff.get("sub")
    profile = db.query(BiometricProfile).filter(BiometricProfile.subject == subject).one_or_none()
    if not profile:
        raise HTTPException(404, "No biometric profile enrolled")
    profile.revoked_at = _utcnow()
    db.add(
        AuditEvent(
            id=str(uuid.uuid4()),
            actor=subject,
            action="biometric_revoked",
            entity_type="biometric_profile",
            entity_id=profile.id,
            detail={},
        )
    )
    db.commit()
    return {"revoked": True}


@router.post("/recover/revoke")
def recover_revoke(
    payload: Recovery,
    staff: dict = Depends(require_staff),
    db: Session = Depends(get_db),
):
    subject = staff.get("sub")
    profile = db.query(BiometricProfile).filter(BiometricProfile.subject == subject).one_or_none()
    if not profile or not secrets.compare_digest(profile.recovery_key_hash, recovery_hash(payload.recovery_key)):
        raise HTTPException(403, "Invalid recovery key")
    profile.revoked_at = _utcnow()
    profile.recovery_key_hash = recovery_hash(secrets.token_urlsafe(32))
    db.commit()
    return {"revoked": True}


def _validate_challenge(value: str) -> None:
    expires = challenges.pop(value, None)
    if not expires or expires < _utcnow():
        raise HTTPException(400, "Biometric challenge is invalid or expired")


def _validate_enrollment(payload: Enrollment) -> None:
    if not payload.biometric_consent:
        raise HTTPException(422, "Explicit biometric consent is required")
    if not payload.liveness_passed:
        raise HTTPException(422, "Active liveness verification is required")
    if any(
        abs(s.pitch) > 15 or abs(s.yaw) > 15 or s.lux < 300 or s.width < 120 or s.height < 120
        for s in payload.quality
    ):
        raise HTTPException(422, "One or more enrollment samples failed quality checks")
