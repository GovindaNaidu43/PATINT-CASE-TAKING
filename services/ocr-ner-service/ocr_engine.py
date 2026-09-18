def extract_text(content: bytes, filename="") -> dict:
    """Deterministic fallback. Configure a trusted OCR engine in deployment."""
    return {"text": content.decode("utf-8", errors="replace"), "engine": "text-fallback", "requires_hitl_review": True, "filename": filename}
