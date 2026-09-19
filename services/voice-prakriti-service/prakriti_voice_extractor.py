def analyze_voice(audio: bytes) -> dict:
    if not audio: raise ValueError("Audio is required")
    try:
        import io
        import librosa
        import numpy as np
        signal, rate = librosa.load(io.BytesIO(audio), sr=16000)
        f0, _, _ = librosa.pyin(signal, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        valid = f0[~np.isnan(f0)]
        pitch = float(np.mean(valid)) if len(valid) else 0.0
        jitter = float(np.std(valid) / pitch) if pitch else 0.0
        rms = librosa.feature.rms(y=signal)[0]
        shimmer = float(np.std(rms) / np.mean(rms)) if np.mean(rms) else 0.0
        signal_label = "Vata (high pitch / variable)" if pitch > 210 or jitter > .15 else "Pitta (sharp / intense)" if pitch > 160 and shimmer > .2 else "Kapha (low / steady)"
        return {"signal_id": f"voice-{len(audio)}", "features": {"duration_seconds": len(signal) / rate, "mean_pitch_hz": pitch, "jitter": jitter, "shimmer": shimmer}, "prakriti_indicator": signal_label, "label": "supporting signal — not diagnostic", "diagnosis": None}
    except (ImportError, OSError, ValueError):
        pass
    return {"signal_id": f"voice-{len(audio)}", "features": {"duration_bytes": len(audio)}, "prakriti_indicator": "indeterminate", "label": "supporting signal — not diagnostic", "diagnosis": None}
