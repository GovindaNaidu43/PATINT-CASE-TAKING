from dataclasses import dataclass
import os
from pathlib import Path

DEFAULT_DATABASE_URL = f"sqlite:///{(Path(__file__).resolve().parent / 'medikiosk.db').as_posix()}"

def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL).strip()
    if database_url.startswith("postgres://"):
        database_url = "postgresql+psycopg://" + database_url.removeprefix("postgres://")
    elif database_url.startswith("postgresql://"):
        database_url = "postgresql+psycopg://" + database_url.removeprefix("postgresql://")
    if "@host/" in database_url or "@postgres/" in database_url and os.getenv("ENVIRONMENT") == "production":
        raise ValueError("DATABASE_URL still contains a placeholder host; copy the Internal Database URL from Render Postgres")
    return database_url

@dataclass(frozen=True)
class Settings:
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = get_database_url()
    mock_external_services: bool = os.getenv("MOCK_EXTERNAL_SERVICES", "true").lower() == "true"
    abdm_base_url: str = os.getenv("ABDM_BASE_URL", "https://sandbox.abdm.gov.in")
    allowed_origins: tuple[str, ...] = tuple(filter(None, os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")))
    kiosk_api_key: str = os.getenv("KIOSK_API_KEY", "local-development-kiosk-key" if os.getenv("ENVIRONMENT", "development") == "development" else "")
    keycloak_issuer: str = os.getenv("KEYCLOAK_ISSUER", "")
    keycloak_jwks_url: str = os.getenv("KEYCLOAK_JWKS_URL", "")
    keycloak_audience: str = os.getenv("KEYCLOAK_AUDIENCE", "medikiosk-api")
    abdm_client_id: str = os.getenv("ABDM_CLIENT_ID", "")
    abdm_client_secret: str = os.getenv("ABDM_CLIENT_SECRET", "")
    bhashini_inference_url: str = os.getenv("AI4BHARAT_PIPELINE_URL", os.getenv("BHASHINI_INFERENCE_URL", "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"))
    bhashini_api_key: str = os.getenv("BHASHINI_API_KEY", "")
    bhashini_user_id: str = os.getenv("BHASHINI_USER_ID", "")
    ai4bharat_llm_url: str = os.getenv("AI4BHARAT_LLM_URL", "")
    ai4bharat_llm_api_key: str = os.getenv("AI4BHARAT_LLM_API_KEY", "")
    biometric_encryption_key: str = os.getenv("BIOMETRIC_ENCRYPTION_KEY", "")
    biometric_match_threshold: float = float(os.getenv("BIOMETRIC_MATCH_THRESHOLD", "0.20"))

settings = Settings()
