class ASRTTSClient:
    def transcribe(self, audio: bytes, language="hi") -> dict: return {"text": "", "provider": "local-fallback", "language": language, "requires_review": True}
    def synthesize(self, text: str, language="hi") -> dict: return {"audio": None, "provider": "local-fallback", "text": text, "language": language}
