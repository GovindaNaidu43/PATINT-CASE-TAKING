# Ayush-Nidana

## Secure biometric step-up

Biometric authentication is an optional convenience factor for authenticated clinic staff. It does not replace Keycloak, ABHA OTP recovery, or the existing staff session.

Before enabling enrollment, generate a 32-byte base64 key and set `BIOMETRIC_ENCRYPTION_KEY` in the server environment. Keep it in a secret manager in shared environments; losing it makes enrolled templates unrecoverable.

The API enforces the following controls:

- five enrollment descriptors, explicit consent, active liveness, and face quality thresholds
- cancelable 64-bit projection plus AES-256-GCM envelope encryption
- three failed attempts followed by a 15-minute lockout
- one-time recovery key and authenticated revocation
- audit events for enrollment and revocation

Endpoints:

- `POST /auth/biometric/challenge`
- `POST /auth/biometric/enroll`
- `POST /auth/biometric/verify`
- `POST /auth/biometric/revoke`
- `POST /auth/biometric/recover/revoke`

The browser must perform face detection and active liveness locally, then send only the descriptor needed for the current operation over TLS. Do not store camera frames or raw descriptors. The backend currently exposes the secure contract; a production UI must still bundle pinned face model assets and implement blink/head-turn checks before calling enrollment or verification.

## AI4Bharat gateway

The authenticated AI gateway exposes `POST /api/ai/asr`, `/api/ai/tts`, `/api/ai/translate`, `/api/ai/transliterate`, and `/api/ai/lmmc`. Kiosk requests use `X-Kiosk-Key`; staff requests use the existing Keycloak bearer token. Configure `AI4BHARAT_PIPELINE_URL`, `BHASHINI_API_KEY`, and `BHASHINI_USER_ID` to use Bhashini/Dhruva. With `MOCK_EXTERNAL_SERVICES=true` or missing provider credentials, the gateway uses browser/local fallbacks and marks clinical outputs for review.
