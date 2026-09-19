# MediKiosk

MediKiosk is an integrated, multilingual clinical history platform for Ayurvedic and general OPD workflows. It helps a patient provide history at a kiosk, gives clinicians a structured review workspace, and connects approved records to ABDM/FHIR workflows.

**Context:** SIH25047, All India Institute of Ayurveda (AIIA), Ministry of AYUSH
**Primary stack:** FastAPI, SQLAlchemy, React/Vite/Electron, Next.js, Flutter, PostgreSQL, Keycloak, Redis, and MinIO

## What the system does

The project is organized around one patient journey:

1. The patient uses the **mobile companion** to view an ABHA card/QR code, queue information, and follow-up tasks.
2. The **kiosk** identifies the patient, records consent, and collects a multilingual history through voice and touch interactions.
3. The kiosk can process medical documents with OCR/NER and collect tongue and voice supporting signals.
4. The backend stores the structured consultation, detects red flags, and publishes updates for the clinical team.
5. The **doctor dashboard** shows the queue, consultation data, vitals, documents, and supporting signals.
6. A grounded summary is created as a draft. A physician must confirm and release it before it can be exported as an ABDM/FHIR bundle.

Signals such as Jihva and voice-Prakriti are decision support only. They are never diagnoses and must remain visibly labelled as supporting signals.

## Architecture

```text
Mobile Companion (Flutter)
    | QR, queue, follow-up
    v
Kiosk Frontend (React/Vite, optional Electron shell)
    | patient intake, consent, voice/touch, OCR, signals
    v
FastAPI API Gateway
    |-- patient and consultation APIs
    |-- dialogue and red-flag engine
    |-- OCR/NER and clinical signal routes
    |-- grounded summaries and physician confirmation
    |-- ABHA/consent/FHIR integration
    |-- speech, AI4Bharat, biometric, and follow-up routes
    v
Doctor Dashboard (Next.js)
    | queue, review, confirmation, and release
    v
PostgreSQL / Redis / MinIO / Keycloak
```

### Repository map

| Path | Responsibility |
| --- | --- |
| `services/api-gateway` | FastAPI application, configuration, database, security, and API routers |
| `services/dialogue-engine` | Adaptive interview state machine, red-flag detection, and repertory matching |
| `services/ocr-ner-service` | Document OCR and named-entity extraction |
| `services/cv-jihva-service` | Jihva/tongue supporting-signal analysis |
| `services/voice-prakriti-service` | Voice-based Prakriti supporting-signal extraction |
| `services/summary-service` | Grounding checks and summary drafts |
| `services/abdm-connector` | ABHA, consent webhook, and FHIR bundle handling |
| `services/followup-service` | Follow-up tasks and telephony integration |
| `services/asr-tts-service` | Speech routes and provider integration |
| `apps/kiosk-frontend` | Patient-facing React/Vite/Electron application |
| `apps/doctor-dashboard` | Physician-facing Next.js application |
| `apps/mobile-companion` | Flutter patient companion |
| `packages/theme`, `packages/ui` | Shared design tokens and UI components |
| `tests` | Python API and domain tests |
| `docs` | Architecture, consent, FHIR, setup, and safety documentation |

## Prerequisites

For local development install:

- Python 3.11 or newer
- Node.js and npm
- Flutter SDK 3.x with a browser, Android emulator, or device configured for the mobile app
- Docker Desktop, only if using the integrated infrastructure profile

## Quick start: local development

This mode uses SQLite and local/mock external services. It is the fastest way to run the code and execute the tests.

### 1. Configure Python

From the repository root:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

Alternatively, install the packages from `requirements.txt` with `python -m pip install -r requirements.txt`.

### 2. Start the API

```bash
uvicorn main:app --app-dir services/api-gateway --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`. Useful links:

- Health check: `http://localhost:8000/health`
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

The default local database is `services/api-gateway/medikiosk.db`. It is created automatically when the API starts. Set `DATABASE_URL` to use another database.

### 3. Start the kiosk

In a second terminal:

```bash
cd apps/kiosk-frontend
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`. To run the Electron shell instead, use `npm run electron:dev`.

### 4. Start the doctor dashboard

In a third terminal:

```bash
cd apps/doctor-dashboard
npm install
npm run dev
```

The Next.js dashboard normally runs at `http://localhost:3000`.

### 5. Start the mobile companion

In another terminal:

```bash
cd apps/mobile-companion
flutter pub get
flutter run -d chrome
```

Use `flutter devices` to find an Android emulator or connected device, then replace `chrome` with its device ID.

## Integrated environment with Docker Compose

Use this mode when you need PostgreSQL, Redis, MinIO, and Keycloak together.

1. Copy `.env.example` to `.env`.
2. Set at least `MEDIKIOSK_DB_PASSWORD`, `KIOSK_API_KEY`, `KEYCLOAK_ADMIN_USERNAME`, `KEYCLOAK_ADMIN_PASSWORD`, `MINIO_ACCESS_KEY`, and `MINIO_SECRET_KEY`.
3. Start the infrastructure from the repository root:

```bash
docker compose --env-file .env -f infra/docker-compose.kiosk.yml up --build
```

The exposed services are:

| Service | URL/port |
| --- | --- |
| API gateway | `http://localhost:8000` |
| Doctor dashboard | `http://localhost:3000` when started locally |
| Kiosk | `http://localhost:5173` when started locally |
| Keycloak | `http://localhost:8080` |
| MinIO API | `http://localhost:9000` |
| MinIO console | `http://localhost:9001` |

Stop the stack with `docker compose -f infra/docker-compose.kiosk.yml down`. Add `-v` only when you intentionally want to remove database and object-storage volumes.

## Environment configuration

`.env.example` documents the supported settings. The most important groups are:

- **Runtime:** `ENVIRONMENT`, `DATABASE_URL`, `ALLOWED_ORIGINS`, and `MOCK_EXTERNAL_SERVICES`
- **Authentication:** `KEYCLOAK_ISSUER`, `KEYCLOAK_JWKS_URL`, `KEYCLOAK_AUDIENCE`, and `KIOSK_API_KEY`
- **ABDM:** `ABDM_BASE_URL`, `ABDM_CLIENT_ID`, and `ABDM_CLIENT_SECRET`
- **AI4Bharat/Bhashini:** `AI4BHARAT_PIPELINE_URL`, `BHASHINI_API_KEY`, `BHASHINI_USER_ID`, `AI4BHARAT_LLM_URL`, and `AI4BHARAT_LLM_API_KEY`
- **Biometric step-up:** `BIOMETRIC_ENCRYPTION_KEY` and `BIOMETRIC_MATCH_THRESHOLD`
- **Storage and follow-up:** MinIO and Twilio variables

For local development, `MOCK_EXTERNAL_SERVICES=true` is the default. Provider credentials and Keycloak are required for a realistic integrated environment. Never use mock mode with real patient information.

## Clinical and security workflow

- Kiosk routes authenticate with the configured kiosk key; staff routes use Keycloak bearer tokens.
- Consent is explicit and purpose-specific. ABDM export requires active care consent.
- Summary generation produces a draft. Release is blocked until a physician confirms it.
- FHIR export is blocked unless a released physician-confirmed summary and active consent exist.
- Biometric authentication is an optional step-up factor. It does not replace Keycloak or ABHA OTP recovery.
- The browser should perform face detection and active liveness locally. Do not store camera frames or raw biometric descriptors.
- Raw audio and images should remain on the device where possible; send only the structured data required by the current operation over TLS.

## Testing and quality checks

From the repository root with the virtual environment active:

```bash
pytest
ruff check .
```

Build the web applications with:

```bash
cd apps/kiosk-frontend && npm run build
cd ../doctor-dashboard && npm run build
```

Run Flutter checks with:

```bash
cd apps/mobile-companion
flutter analyze
flutter test
```

## Further documentation

- [Architecture](docs/architecture.md)
- [Consent flow](docs/consent-flow.md)
- [FHIR mapping](docs/fhir-mapping.md)
- [Local clinic setup](docs/local-clinic-setup.md)
- [Safety guardrails](docs/safety-guardrails.md)
