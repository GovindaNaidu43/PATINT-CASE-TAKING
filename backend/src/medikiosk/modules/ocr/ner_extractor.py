"""Named entity recognition for clinical text: medications and lab values."""
import re

LAB_RANGES = {"hemoglobin": (12.0, 17.5), "glucose": (70.0, 140.0)}


def extract_entities(text: str) -> dict:
    meds = re.findall(r"\b(?:metformin|paracetamol|aspirin|amoxicillin)\b", text, re.I)
    labs = []
    for test, (low, high) in LAB_RANGES.items():
        m = re.search(rf"{test}\s*[:=]?\s*(\d+(?:\.\d+)?)", text, re.I)
        if m:
            value = float(m.group(1))
            labs.append({
                "name": test,
                "value": value,
                "abnormal": value < low or value > high,
                "loinc": "718-7" if test == "hemoglobin" else "2345-7",
            })
    return {"medications": meds, "labs": labs, "review_required": True}
