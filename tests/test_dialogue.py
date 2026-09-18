from state_machine import InterviewState


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
