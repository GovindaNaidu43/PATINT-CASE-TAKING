from jihva_analyzer import analyze_jihva
from prakriti_voice_extractor import analyze_voice
def test_signals_are_not_diagnoses():
    assert analyze_jihva(b"image")["diagnosis"] is None
    assert analyze_voice(b"audio")["diagnosis"] is None
