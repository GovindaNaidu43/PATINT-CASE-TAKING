from dataclasses import dataclass
import os

@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./medikiosk.db")
    mock_external_services: bool = os.getenv("MOCK_EXTERNAL_SERVICES", "true").lower() == "true"
    abdm_base_url: str = os.getenv("ABDM_BASE_URL", "https://sandbox.abdm.gov.in")
    allowed_origins: tuple[str, ...] = tuple(filter(None, os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")))
    kiosk_api_key: str = os.getenv("KIOSK_API_KEY", "")
    keycloak_issuer: str = os.getenv("KEYCLOAK_ISSUER", "")
    keycloak_jwks_url: str = os.getenv("KEYCLOAK_JWKS_URL", "")
    keycloak_audience: str = os.getenv("KEYCLOAK_AUDIENCE", "medikiosk-api")

settings = Settings()
