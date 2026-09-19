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
