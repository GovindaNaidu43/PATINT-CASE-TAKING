"""Cancelable biometric templates with AES-GCM envelope encryption.

Only a keyed, 64-bit projection is persisted. Raw descriptors are never written
to the database. The encryption key must come from a secret manager in deployed
environments and is intentionally not generated automatically.
"""
import base64
import hashlib
import hmac
import json
import secrets
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from config import settings

DESCRIPTOR_SIZE = 128
PROJECTION_SIZE = 64

def _master_key() -> bytes:
    if not settings.biometric_encryption_key:
        raise RuntimeError("Biometric encryption is not configured")
    try:
        key = base64.urlsafe_b64decode(settings.biometric_encryption_key + "===")
    except ValueError as error:
        raise RuntimeError("BIOMETRIC_ENCRYPTION_KEY must be base64 encoded") from error
    if len(key) != 32:
        raise RuntimeError("BIOMETRIC_ENCRYPTION_KEY must decode to 32 bytes")
    return key

def _projection(descriptor: list[float], salt: bytes) -> list[int]:
    if len(descriptor) != DESCRIPTOR_SIZE or not all(isinstance(value, (int, float)) for value in descriptor):
        raise ValueError("Face descriptor must contain exactly 128 numeric values")
    magnitude = sum(float(value) ** 2 for value in descriptor) ** 0.5
    if magnitude == 0:
        raise ValueError("Face descriptor cannot be zero")
    normalized = [float(value) / magnitude for value in descriptor]
    bits = []
    for row in range(PROJECTION_SIZE):
        seed = hmac.new(salt, f"projection:{row}".encode(), hashlib.sha256).digest()
        total = 0.0
        for index, value in enumerate(normalized):
            coefficient = 1.0 if seed[index % len(seed)] & (1 << (index % 8)) else -1.0
            total += value * coefficient
        bits.append(1 if total >= 0 else 0)
    return bits

def build_template(descriptors: list[list[float]]) -> tuple[str, str, str]:
    if len(descriptors) != 5:
        raise ValueError("Exactly five enrollment descriptors are required")
    salt = secrets.token_bytes(32)
    descriptor_centroid = [sum(descriptor[index] for descriptor in descriptors) / len(descriptors) for index in range(DESCRIPTOR_SIZE)]
    centroid = _projection(descriptor_centroid, salt)
    nonce = secrets.token_bytes(12)
    encrypted = AESGCM(_master_key()).encrypt(nonce, json.dumps(centroid).encode(), salt)
    return (base64.urlsafe_b64encode(encrypted).decode(), base64.urlsafe_b64encode(nonce).decode(), base64.urlsafe_b64encode(salt).decode())

def matches(descriptor: list[float], encrypted_template: str, nonce: str, salt: str) -> bool:
    salt_bytes = base64.urlsafe_b64decode(salt)
    stored = json.loads(AESGCM(_master_key()).decrypt(base64.urlsafe_b64decode(nonce), base64.urlsafe_b64decode(encrypted_template), salt_bytes))
    candidate = _projection(descriptor, salt_bytes)
    distance = sum(left != right for left, right in zip(candidate, stored)) / PROJECTION_SIZE
    return distance <= settings.biometric_match_threshold

def recovery_hash(recovery_key: str) -> str:
    return hashlib.sha256(recovery_key.encode()).hexdigest()