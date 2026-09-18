from dataclasses import dataclass
import os

@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./medikiosk.db")
    mock_external_services: bool = os.getenv("MOCK_EXTERNAL_SERVICES", "true").lower() == "true"
    abdm_base_url: str = os.getenv("ABDM_BASE_URL", "https://sandbox.abdm.gov.in")

settings = Settings()
