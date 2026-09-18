RED_FLAGS = {"chest pain": "emergency", "difficulty breathing": "emergency", "shortness of breath": "urgent", "stroke": "emergency", "suicidal": "emergency", "unconscious": "emergency", "severe bleeding": "emergency"}
def detect_red_flags(text: str) -> list[dict]:
    normalized = text.lower()
    return [{"phrase": phrase, "priority": priority, "action": "Seek immediate clinical assessment"} for phrase, priority in RED_FLAGS.items() if phrase in normalized]
