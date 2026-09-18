import pytest
from llm_summarizer import summarize
def test_summary_is_grounded_and_unconfirmed():
    assert summarize(["Pain for two days"], ["turn:1"])["physician_confirmed"] is False
    with pytest.raises(ValueError): summarize(["claim"], ["untrusted:1"])
