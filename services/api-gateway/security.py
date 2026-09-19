"""Authentication boundaries for kiosk devices and authenticated clinic staff."""
from functools import lru_cache
import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from config import settings

bearer = HTTPBearer(auto_error=False)

def require_kiosk(x_kiosk_key: str | None = None) -> str:
    # The header is injected by FastAPI below to keep this dependency testable.
    if not settings.kiosk_api_key:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Kiosk authentication is not configured")
    if not x_kiosk_key or x_kiosk_key != settings.kiosk_api_key:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid kiosk credential")
    return "kiosk"

async def kiosk_identity(x_kiosk_key: str | None = Header(default=None, alias="X-Kiosk-Key")) -> str:
    return require_kiosk(x_kiosk_key)

def ai_identity(
    x_kiosk_key: str | None = Header(default=None, alias="X-Kiosk-Key"),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> str | dict:
    """Allow AI calls from a trusted kiosk or an authenticated clinic staff member."""
    if x_kiosk_key is not None:
        return require_kiosk(x_kiosk_key)
    return require_staff(credentials)

@lru_cache(maxsize=1)
def jwks_client() -> jwt.PyJWKClient:
    if not settings.keycloak_issuer:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Staff authentication is not configured")
    jwks_url = settings.keycloak_jwks_url or f"{settings.keycloak_issuer.rstrip('/')}/protocol/openid-connect/certs"
    return jwt.PyJWKClient(jwks_url)

def require_staff(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if not credentials:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Staff sign-in is required")
    try:
        key = jwks_client().get_signing_key_from_jwt(credentials.credentials)
        claims = jwt.decode(credentials.credentials, key.key, algorithms=["RS256"], audience=settings.keycloak_audience, issuer=settings.keycloak_issuer)
    except (jwt.PyJWTError, ValueError) as error:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid staff session") from error
    roles = set(claims.get("realm_access", {}).get("roles", []))
    if not roles.intersection({"physician", "clinic_admin"}):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Physician role is required")
    return claims

def require_physician(staff: dict = Depends(require_staff)) -> dict:
    roles = set(staff.get("realm_access", {}).get("roles", []))
    if "physician" not in roles:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Physician role is required for clinical signing")
    return staff
