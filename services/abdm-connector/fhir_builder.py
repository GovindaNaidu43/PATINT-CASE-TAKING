from datetime import datetime, timezone
def consultation_bundle(patient_id: str, summary: str, confirmed: bool) -> dict:
    if not confirmed: raise ValueError("Only physician-confirmed summaries may enter an ABDM bundle")
    return {"resourceType": "Bundle", "type": "collection", "timestamp": datetime.now(timezone.utc).isoformat(), "entry": [{"resource": {"resourceType": "Patient", "id": patient_id}}, {"resource": {"resourceType": "Composition", "status": "final", "type": {"text": "OPConsultRecord"}, "title": "Physician-confirmed consultation", "section": [{"text": {"status": "generated", "div": summary}}]}}]}
