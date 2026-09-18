from state_machine import InterviewState
from red_flags import detect_red_flags, highest_priority


def test_red_flag_overrides_interview():
    result = InterviewState().process("I have severe chest pain")
    assert result["phase"] == "red_flag_triage" and result["red_flags"]


def test_first_turn_captures_presenting_complaint():
    result = InterviewState().process("I have a headache", modality="touch", language="en")
    assert result["answered_key"] == "presenting_complaint"
    assert result["question_key"] == "site"
    assert result["options"] == []


def test_state_resumes_from_persisted_turns():
    state = InterviewState.from_turns([
        {
            "text": "I have a headache",
            "modality": "voice",
            "language": "hi",
            "answer_key": "presenting_complaint",
        },
    ])
    result = state.process("Front of my head", modality="touch", language="hi")
    assert result["answered_key"] == "site"
    assert result["question_key"] == "onset"

def test_extended_red_flags_are_priority_sorted_and_include_metadata():
    flags = detect_red_flags("I fainted and now have chest pain")
    assert highest_priority(flags) == "emergency"
    assert flags[0]["phrase"] == "chest pain"
    assert flags[0]["icd10_hint"] == "R07.9"
    assert "diagnos" not in flags[0]["action"].lower()

def test_hindi_red_flag_stops_interview():
    result = InterviewState().process("मुझे सीने में दर्द है", language="hi")
    assert result["phase"] == "red_flag_triage"
    assert result["red_flags"][0]["priority"] == "emergency"
    assert "चिकित्सकीय" in result["next_question"]

def test_no_substring_false_positive():
    assert detect_red_flags("I read a booklet about strokes") == []
