from datetime import datetime, timezone
def consultation_bundle(patient_id: str, summary: str, confirmed: bool, *, abha_number: str | None = None, doctor_name: str | None = None, labs: list[dict] | None = None, documents: list[dict] | None = None) -> dict:
    if not confirmed: raise ValueError("Only physician-confirmed summaries may enter an ABDM bundle")
    timestamp = datetime.now(timezone.utc).isoformat()
    patient = {"resourceType": "Patient", "id": patient_id, "identifier": [{"system": "https://healthid.abdm.gov.in", "value": abha_number}] if abha_number else []}
    entries = [{"resource": patient}, {"resource": {"resourceType": "Encounter", "id": f"encounter-{patient_id}", "status": "finished", "class": {"code": "AMB", "display": "ambulatory"}}}, {"resource": {"resourceType": "Composition", "id": f"composition-{patient_id}", "status": "final", "type": {"text": "OPConsultRecord"}, "title": "Physician-confirmed consultation", "date": timestamp, "author": [{"display": doctor_name or "MediKiosk physician"}], "section": [{"text": {"status": "generated", "div": summary}}]}}]
    for lab in labs or []:
        entries.append({"resource": {"resourceType": "Observation", "id": f"observation-{lab.get('name', 'lab')}", "status": "final", "code": {"text": lab.get("name")}, "valueQuantity": {"value": lab.get("value")}, "interpretation": [{"text": "abnormal"}] if lab.get("abnormal") else []}})
    for document in documents or []:
        entries.append({"resource": {"resourceType": "DocumentReference", "id": document.get("id"), "status": "current", "description": document.get("filename", "Reviewed clinical document")}})
    return {"resourceType": "Bundle", "type": "document", "timestamp": timestamp, "entry": entries}
