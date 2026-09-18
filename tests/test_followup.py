from tasks import assess_response
def test_followup_escalates_red_flags():
    assert assess_response("new difficulty breathing")["escalate"] is True
