def analyze_voice(audio: bytes) -> dict:
    if not audio: raise ValueError("Audio is required")
    return {"signal_id": f"voice-{len(audio)}", "features": {"duration_bytes": len(audio)}, "prakriti_indicator": "indeterminate", "label": "supporting signal — not diagnostic", "diagnosis": None}
