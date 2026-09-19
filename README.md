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
# MediKiosk — Integrated AI Clinical History Platform

**Submission**: SIH25047 · All India Institute of Ayurveda (AIIA), Ministry of AYUSH  
**Ecosystem**: Ayushman Bharat Digital Mission (ABDM) Compliant

---

## 🏛️ Ecosystem Overview & Integrated Applications

MediKiosk integrates three specialized applications designed to streamline the complete OPD clinical history workflow:

```
                  ┌───────────────────────────────┐
                  │   Mobile Companion (Flutter)   │
                  │  • Digital ABHA Card with QR   │
                  │  • Live OPD Token & Queue      │
                  │  • Module F: Post-Visit Follow  │
                  └───────────────┬───────────────┘
                                  │ Scans QR at kiosk
                                  ▼
┌─────────────────────────────────┴─────────────────────────────────┐
│                     MediKiosk Terminal (React/Electron)            │
│  • Step 1: Optical ABHA identification                            │
│  • Step 2: Granular audio-explained DPDP consent                   │
│  • Step 3: Multilingual SOCRATES voice/touch adaptive history      │
│  • Step 4: Medical document OCR & timeline digitizer               │
│  • Step 5: Jihva (tongue) CV supporting signal capture            │
│  • Step 6: Grounded EHR summary generated & routed to doctor      │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │ Real-time intake sync
                                  ▼
                  ┌───────────────────────────────┐
                  │    Doctor Dashboard (Next.js) │
                  │  • Live patient queue & vitals│
                  │  • Jihva & Voice-Prakriti radar│
                  │  • Physician Write-Lock Gate  │
                  │  • FHIR R4 push to hospital   │
                  └───────────────────────────────┘
```

---

## 📦 Shared Architecture & Common Libraries (`packages/`)

All duplicate and overlapping assets, styles, and components across apps have been consolidated into clean, single-source packages:

- **`packages/theme/src/tokens.ts`**: Single source of truth for design tokens (warm cream `#FAF3E8`, gold `#B8863C`, terracotta `#A7685D`, sage `#8CA383`, typography).
- **`packages/ui/src/MandalaBackground.tsx`**: Single canonical component for the dual rotating corner mandalas (75s/90s clockwise & counter-clockwise) and watercolor ink splatter overlay.
- **`packages/ui/src/RoyalCard.tsx`**: Unified translucent warm-white card with golden borders and glowing states.
- **`packages/ui/src/SignalBadge.tsx`**: Single implementation enforcing clinical safety labeling (`"Supporting Signal — Not a Diagnosis"`).

---

## 🚀 Running All Three Applications

### 1. Kiosk Frontend (`apps/kiosk-frontend`)
```bash
cd apps/kiosk-frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### 2. Doctor Dashboard (`apps/doctor-dashboard`)
```bash
cd apps/doctor-dashboard
npm install
npm run dev
# Running on http://localhost:3000
```

### 3. Mobile Companion (`apps/mobile-companion`)
```bash
cd apps/mobile-companion
flutter run -d chrome  # or flutter run on Android device/emulator
# Running on http://localhost:8081
```

---

## 🔒 Safety & Architectural Guarantees
1. **Raw Audio/Image Stays on Device**: Only structured, de-identified JSON crosses the network.
2. **Physician Confirmation Gate**: Summaries are never auto-saved without explicit physician sign-off.
3. **Ayurvedic Signals as Decision Support**: Jihva & Voice-Prakriti are strictly presented as supporting signals, not diagnoses.
