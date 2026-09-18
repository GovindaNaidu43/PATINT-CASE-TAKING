from dataclasses import dataclass, field
from red_flags import detect_red_flags
from dashavidha_pariksha import next_question
@dataclass
class InterviewState:
    phase: str = "presenting_complaint"
    answers: dict = field(default_factory=dict)
    turns: list = field(default_factory=list)
    def process(self, text: str) -> dict:
        self.turns.append(text); flags = detect_red_flags(text)
        if flags: self.phase = "red_flag_triage"; return {"phase": self.phase, "red_flags": flags, "next_question": "A clinician should assess this urgently. Are you currently safe?"}
        socrates = [("site", "Where exactly is the symptom?"), ("onset", "When did it start?"), ("character", "How would you describe it?"), ("radiation", "Does it spread anywhere?"), ("associated", "Any associated symptoms?"), ("timing", "Is there a pattern?"), ("exacerbating", "What makes it better or worse?"), ("severity", "On a scale of 0–10, how severe is it?")]
        for key, question in socrates:
            if key not in self.answers: self.answers[key] = text; self.phase = "socrates"; return {"phase": self.phase, "next_question": question, "red_flags": []}
        question = next_question(set(self.answers)); self.phase = "dashavidha" if question else "complete"
        if question: self.answers[question["domain"]] = text
        return {"phase": self.phase, "next_question": question["question"] if question else None, "red_flags": []}
