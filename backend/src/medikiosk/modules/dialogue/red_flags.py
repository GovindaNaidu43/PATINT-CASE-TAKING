"""Deterministic, auditable red-flag screening for Hindi and English intake.

It detects potential emergencies; it never diagnoses or replaces the clinic's
emergency escalation policy.
"""
from __future__ import annotations
import re

# phrase, priority, clinic-facing escalation instruction, non-diagnostic code hint
_FLAG_REGISTRY = (
    ("chest pain", "emergency", "Activate the clinic cardiac triage protocol.", "R07.9"),
    ("chest tightness", "emergency", "Activate the clinic cardiac triage protocol.", "R07.9"),
    ("difficulty breathing", "emergency", "Assess airway and activate emergency response.", "R06.0"),
    ("shortness of breath", "urgent", "Prompt respiratory assessment is required.", "R06.0"),
    ("can't breathe", "emergency", "Assess airway and activate emergency response.", "R06.0"),
    ("cannot breathe", "emergency", "Assess airway and activate emergency response.", "R06.0"),
    ("face drooping", "emergency", "Activate the clinic stroke triage protocol.", "I64"),
    ("arm weakness", "emergency", "Activate the clinic stroke triage protocol.", "I64"),
    ("speech slurred", "emergency", "Activate the clinic stroke triage protocol.", "I64"),
    ("sudden severe headache", "emergency", "Immediate clinician assessment is required.", "R51.9"),
    ("worst headache", "emergency", "Immediate clinician assessment is required.", "R51.9"),
    ("unconscious", "emergency", "Activate emergency response immediately.", "R55"),
    ("loss of consciousness", "emergency", "Activate emergency response immediately.", "R55"),
    ("fainted", "urgent", "Prompt clinician assessment is required.", "R55"),
    ("severe bleeding", "emergency", "Apply local first aid and activate emergency response.", "R58"),
    ("coughing blood", "urgent", "Prompt clinician assessment is required.", "R04.2"),
    ("vomiting blood", "emergency", "Activate gastrointestinal bleed protocol.", "K92.0"),
    ("black stool", "urgent", "Prompt clinician assessment is required.", "K92.1"),
    ("seizure", "emergency", "Activate the clinic seizure protocol.", "G40.909"),
    ("fits", "emergency", "Activate the clinic seizure protocol.", "G40.909"),
    ("suicidal", "emergency", "Do not leave the patient alone; activate mental-health escalation.", "R45.851"),
    ("want to die", "emergency", "Do not leave the patient alone; activate mental-health escalation.", "R45.851"),
    ("kill myself", "emergency", "Do not leave the patient alone; activate mental-health escalation.", "R45.851"),
    ("end my life", "emergency", "Do not leave the patient alone; activate mental-health escalation.", "R45.851"),
    ("severe abdominal pain", "urgent", "Prompt clinician assessment is required.", "R10.0"),
    ("not moving", "urgent", "If pregnant, perform fetal-movement assessment promptly.", "O36.8"),
    ("सीने में दर्द", "emergency", "Activate the clinic cardiac triage protocol.", "R07.9"),
    ("सांस नहीं आ रही", "emergency", "Assess airway and activate emergency response.", "R06.0"),
    ("बेहोश", "emergency", "Activate emergency response immediately.", "R55"),
    ("खून आ रहा", "urgent", "Prompt clinician assessment is required.", "R58"),
    ("seene mein dard", "emergency", "Activate the clinic cardiac triage protocol.", "R07.9"),
    ("sans nahi aa rahi", "emergency", "Assess airway and activate emergency response.", "R06.0"),
    ("behosh", "emergency", "Activate emergency response immediately.", "R55"),
    ("khoon aa raha", "urgent", "Prompt clinician assessment is required.", "R58"),
)
_COMPILED = tuple(
    (re.compile(rf"(?<!\w){re.escape(phrase)}(?!\w)", re.IGNORECASE), priority, action, hint)
    for phrase, priority, action, hint in _FLAG_REGISTRY
)
_PRIORITY_ORDER = {"emergency": 0, "urgent": 1, "warning": 2}


def detect_red_flags(text: str) -> list[dict]:
    """Return unique, priority-sorted, clinician-reviewable screening hits."""
    normalized = " ".join(text.casefold().split())
    hits: dict[str, dict] = {}
    for pattern, priority, action, icd10_hint in _COMPILED:
        match = pattern.search(normalized)
        if match:
            phrase = match.group(0).casefold()
            hits[phrase] = {
                "phrase": phrase,
                "priority": priority,
                "action": action,
                "icd10_hint": icd10_hint,
            }
    return sorted(hits.values(), key=lambda hit: _PRIORITY_ORDER[hit["priority"]])


def highest_priority(flags: list[dict]) -> str | None:
    return flags[0]["priority"] if flags else None
