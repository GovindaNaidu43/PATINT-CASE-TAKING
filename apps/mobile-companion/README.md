# MediKiosk Mobile Companion

Flutter companion application for patients, optimized for Android-first rural and low-end mobile devices under the Ayushman Bharat Digital Mission (ABDM) and Ministry of AYUSH ecosystem.

---

## 📱 Features

1. **Digital ABHA Card & Fast Check-In QR**:
   - Displays patient ABHA number, ABHA address (`@abdm`), age, gender, and blood group.
   - Generates high-contrast dynamic QR code readable by the physical MediKiosk scanner.
   - Real-time OPD token tracking (token number, department, doctor, room number, queue status).

2. **Physician-Confirmed Clinical Summaries**:
   - Access encrypted, physician-approved EHR consultation notes grounded to SOCRATES conversational turns.
   - Preview HL7 FHIR R4 Bundles (`OPConsultRecord`).
   - Clearly labels Jihva (tongue) and Voice Prakriti outputs with `"Supporting Signal — Not a Diagnosis"` to prevent alert fatigue and honor clinical safety constraints.

3. **Module F: Closed-Loop Post-Visit Follow-Up**:
   - Interactive recovery & symptom surveys mirroring automated IVR/SMS check-ins.
   - Monitors medication adherence (herbal/classical formulations).
   - Instant priority red-flag escalation alerting hospital triage and attending doctors.

---

## 🎨 UI Aesthetic

Implements the authentic MediKiosk classical Ayurvedic aesthetic:
- **Warm Cream & Watercolor Background**: `#FAF3E8` with soft golden washes and ink-splatter accents.
- **Dual Rotating Corner Mandalas**: Smooth 75s clockwise top-right and counter-clockwise bottom-right lotus geometry.
- **Royal Ivory & Muted Gold Typography**: Google Fonts (*Cormorant Garamond* and *Nunito Sans*).
- **Light Golden Cards**: Translucent warm cards with subtle borders (`#E8D9BC`) and glowing accents.

---

## 🚀 Running & Verification

```bash
cd apps/mobile-companion

# Analyze codebase
flutter analyze

# Run unit and widget test suite
flutter test

# Run application (Android / iOS / Web)
flutter run
```
