"""Interview state machine governing SOCRATES symptom progression and red flag escalation."""
from dataclasses import dataclass, field
from medikiosk.modules.dialogue.red_flags import detect_red_flags, highest_priority
from medikiosk.modules.dialogue.dashavidha_pariksha import next_question


@dataclass
class InterviewState:
    phase: str = "presenting_complaint"
    answers: dict = field(default_factory=dict)
    turns: list = field(default_factory=list)
    presenting_complaint: str | None = None

    SOCRATES = [
        ("site", "Where exactly is the symptom?"),
        ("onset", "When did it start?"),
        ("character", "How would you describe it?"),
        ("radiation", "Does it spread anywhere?"),
        ("associated", "Do you have any other symptoms with it?"),
        ("timing", "Is there a pattern or a particular time when it happens?"),
        ("exacerbating", "What makes it better or worse?"),
        ("severity", "On a scale of 0 to 10, how severe is it?"),
    ]

    @classmethod
    def from_turns(cls, turns: list[dict]) -> "InterviewState":
        state = cls()
        for turn in turns:
            if turn.get("answer_key"):
                state.answers[turn["answer_key"]] = turn.get("text", "")
            if turn.get("answer_key") == "presenting_complaint":
                state.presenting_complaint = turn.get("text", "")
            state.turns.append(turn)
        return state

    def process(self, text: str, modality: str = "text", language: str = "en") -> dict:
        text = " ".join(text.split())
        if not text:
            return self._response(self.phase, self._retry_question(language), None, None, [], [])
        self.turns.append({"text": text, "modality": modality, "language": language})
        flags = detect_red_flags(text)
        if flags:
            self.phase = "red_flag_triage"
            return self._response(
                "red_flag_triage",
                self._red_flag_message(language, highest_priority(flags)),
                "red_flag_safety",
                None,
                flags,
                [],
            )

        if self.presenting_complaint is None:
            self.presenting_complaint = text
            self.answers["presenting_complaint"] = text
            self.phase = "socrates"
            return self._response(
                self.phase,
                "Where exactly is the symptom?",
                "site",
                "presenting_complaint",
                [],
                [],
            )

        for key, question in self.SOCRATES:
            if key not in self.answers:
                self.answers[key] = text
                self.phase = "socrates"
                next_key, next_question_text = self._next_socrates(key)
                return self._response(
                    self.phase,
                    next_question_text,
                    next_key,
                    key,
                    [],
                    self._options(next_key),
                )

        question = next_question(set(self.answers))
        self.phase = "dashavidha" if question else "complete"
        if question:
            self.answers[question["domain"]] = text
            next_question_data = next_question(set(self.answers))
            return self._response(
                self.phase,
                next_question_data["question"] if next_question_data else None,
                next_question_data["domain"] if next_question_data else None,
                question["domain"],
                [],
                [],
            )
        return self._response(self.phase, None, None, None, [], [])

    def _next_socrates(self, answered_key: str) -> tuple[str | None, str | None]:
        keys = [key for key, _ in self.SOCRATES]
        index = keys.index(answered_key) + 1
        return self.SOCRATES[index] if index < len(self.SOCRATES) else (None, None)

    @staticmethod
    def _options(question_key: str | None) -> list[str]:
        return [str(value) for value in range(0, 11)] if question_key == "severity" else []

    @staticmethod
    def _response(phase, next_question, question_key, answered_key, red_flags, options):
        return {
            "phase": phase,
            "next_question": next_question,
            "question_key": question_key,
            "answered_key": answered_key,
            "options": options,
            "red_flags": red_flags,
        }

    @staticmethod
    def _retry_question(language: str) -> str:
        return "कृपया अपना उत्तर फिर से बताएं।" if language == "hi" else "Please tell me that again."

    @staticmethod
    def _red_flag_message(language: str, priority: str | None) -> str:
        if language == "hi":
            return "आपकी बात पर तुरंत चिकित्सकीय जाँच आवश्यक है। कृपया पास के स्टाफ को अभी बुलाएँ।"
        return "Your response needs immediate clinical assessment. Please alert nearby clinic staff now."
