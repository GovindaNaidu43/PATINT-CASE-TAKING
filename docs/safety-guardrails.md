# Clinical safety and privacy guardrails

1. MediKiosk is clinical decision support, not an autonomous diagnostic system.
2. Red-flag phrases interrupt the normal interview and request immediate clinical assessment.
3. Jihva and voice analysis are labeled supporting signals and never return a diagnosis.
4. OCR and extracted clinical entities always enter a human-in-the-loop review queue.
5. Every generated summary must cite one or more `turn:`, `doc:`, or `signal:` sources.
6. Summary output is a draft by default and cannot be released before physician confirmation.
7. Only a physician-confirmed summary can be serialized into an ABDM FHIR bundle.
8. External integrations run in explicit mock mode by default and require environment configuration to use live credentials.
9. Consent webhook inputs require a consent identifier; data sharing must be governed by recorded consent.
10. Object storage uses local deployment storage by default; production deployments must configure access-controlled MinIO/PostgreSQL and retention policy.
