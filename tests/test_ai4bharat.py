import base64
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "services" / "api-gateway"))
sys.path.insert(0, str(ROOT / "services" / "dialogue-engine"))

from ai4bharat_client import AI4BharatClient


def test_local_transliteration_fallback():
    result = AI4BharatClient().transliterate("bukhari")
    assert result["suggestions"] == ["बुखार"]


def test_lmmc_fallback_uses_repertory_matcher():
    result = AI4BharatClient().extract_lmmc("My headache gets worse in bright sunlight", "en")
    assert result["requires_review"] is True
    assert result["rubrics"][0]["rubric"] == "Head - Pain - Sun - agg."


def test_asr_fallback_requires_review():
    result = AI4BharatClient().speech_to_text(base64.b64encode(b"audio").decode())
    assert result["transcript"] == ""
    assert result["requires_review"] is True