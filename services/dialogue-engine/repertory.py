"""Small, explainable rubric matcher used as a safe baseline before semantic search."""
import re

RUBRICS = (
    ("Head - Pain - Sun - agg.", ("headache", "head pain"), ("sun", "sunlight", "bright"), ("worse", "aggravated")),
    ("Stomach - Nausea - after eating - agg.", ("nausea", "sick"), ("after eating", "after meals", "meal"), ("worse", "aggravated")),
    ("Throat - Cough - dry", ("cough",), ("dry", "dryness"), ()),
    ("Sleep - Sleeplessness - from thoughts", ("sleep", "insomnia", "sleepless"), ("thought", "worry", "mind"), ()),
    ("Generalities - Fatigue", ("fatigue", "tired", "exhausted", "weakness"), (), ()),
)

def match_rubrics(text: str, limit: int = 5) -> list[dict]:
    normalized = re.sub(r"\s+", " ", text.lower()).strip()
    matches = []
    for rubric, symptom_terms, modality_terms, aggravation_terms in RUBRICS:
        symptom_hits = [term for term in symptom_terms if term in normalized]
        modality_hits = [term for term in modality_terms if term in normalized]
        aggravation_hits = [term for term in aggravation_terms if term in normalized]
        score = (len(symptom_hits) * 2) + len(modality_hits) + len(aggravation_hits)
        if symptom_hits:
            matches.append({"rubric": rubric, "score": score, "matched_terms": symptom_hits + modality_hits + aggravation_hits})
    return sorted(matches, key=lambda item: item["score"], reverse=True)[:limit]