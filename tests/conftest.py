import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
for d in [ROOT / "services" / x for x in ["api-gateway", "dialogue-engine", "ocr-ner-service", "cv-jihva-service", "voice-prakriti-service", "summary-service", "abdm-connector", "followup-service"]]: sys.path.insert(0, str(d))
