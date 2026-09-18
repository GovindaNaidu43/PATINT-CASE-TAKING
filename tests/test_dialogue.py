from state_machine import InterviewState
def test_red_flag_overrides_interview():
    result = InterviewState().process("I have severe chest pain")
    assert result["phase"] == "red_flag_triage" and result["red_flags"]
