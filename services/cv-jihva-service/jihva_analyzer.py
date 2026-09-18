def analyze_jihva(image: bytes) -> dict:
    if not image: raise ValueError("A tongue image is required")
    # Deliberately bounded, non-diagnostic fallback; model may replace feature extraction.
    return {"signal_id": f"jihva-{len(image)}", "coating": "indeterminate", "texture": "indeterminate", "moisture": "indeterminate", "label": "supporting signal — clinician review required", "diagnosis": None}
