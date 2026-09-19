# Local clinic setup

This compose file is suitable for an internal pilot on a clinic-controlled machine. Do not expose its ports to the internet and do not use Keycloak's `start-dev` mode for a public production service. Production requires a TLS reverse proxy, encrypted database backups, a restricted network, and a security review.

## 1. Install prerequisites

Install Docker Desktop with Compose, then install Node.js 20+ and Python 3.12+ on the kiosk/development workstation. The application containers install their own Python packages; Node is needed to run the two front ends.

## 2. Create local secrets

Copy `.env.example` to `.env` and set unique values. In PowerShell, generate the kiosk key using:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Set these four values in `.env`; never commit this file:

```text
MEDIKIOSK_DB_PASSWORD=<long unique password>
KIOSK_API_KEY=<generated random key>
KEYCLOAK_ADMIN_USERNAME=<local administrator username>
KEYCLOAK_ADMIN_PASSWORD=<long unique password>
```

Create `apps/kiosk-frontend/.env` from its example and paste the same kiosk key. Create `apps/doctor-dashboard/.env.local` from its example.

## 3. Start protected local services

```powershell
docker compose --env-file .env -f infra/docker-compose.kiosk.yml up --build
```

The first startup creates PostgreSQL, Redis, MinIO, the API, and Keycloak. Check `http://localhost:8000/health`; it must report `ok` before starting either UI.

## 4. Create doctor accounts

Open `http://localhost:8080`, sign in with the Keycloak bootstrap administrator account, and select the `medikiosk` realm. Create one account for each clinician, set a non-temporary password, and assign the `physician` realm role. Assign `clinic_admin` only to the clinic administrator. Do not share staff accounts.

## 5. External service credentials — add only after their agreements are active

| Capability | Credential | When it is needed |
| --- | --- | --- |
| Hindi/English ASR and TTS | Bhashini account/API credential | Voice transcription and spoken prompts |
| ABHA/ABDM | ABDM Sandbox credentials, then production onboarding approval | Verified ABHA lookup and FHIR exchange |
| SMS/IVR | Exotel or Twilio account | Patient follow-up messaging/calls |
| Object storage | MinIO access key and secret | Encrypted image/document storage |

AI4Bharat publishes models rather than a general hosted API key. Use Bhashini or an approved hosted provider if audio cannot be processed locally. Do not send patient audio, images, or identifiers to a provider until the patient has consented and the clinic's data-processing agreement permits it.

## Go-live blockers

Before recording real patient consultations, complete a clinician-approved red-flag protocol, retention/deletion policy, incident response procedure, backups and restore drill, device hardening, access review, and validation of the voice/CV signals with the responsible clinicians. This software must not autonomously diagnose, prescribe, or release clinical summaries.
