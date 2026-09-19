from config import settings

class ASRTTSClient:
    def transcribe(self, audio: bytes, language="hi") -> dict: return {"text": "", "provider": "local-fallback", "language": language, "requires_review": True}
    def synthesize(self, text: str, language="hi") -> dict:
        if not text.strip(): raise ValueError("Text is required")
        if settings.mock_external_services or not settings.bhashini_api_key or not settings.bhashini_user_id:
            return {"audio": None, "provider": "browser-fallback", "text": text, "language": language, "requires_review": False}
        import httpx
        response = httpx.post(settings.bhashini_inference_url, headers={"Authorization": settings.bhashini_api_key, "userID": settings.bhashini_user_id, "Content-Type": "application/json"}, json={"pipelineTasks": [{"taskType": "tts", "config": {"language": {"sourceLanguage": language}, "gender": "female", "samplingRate": 8000}}], "inputData": {"input": [{"source": text}]}}, timeout=30)
        response.raise_for_status(); audio = response.json()["pipelineResponse"][0]["audio"][0]["audioContent"]
        return {"audio": f"data:audio/wav;base64,{audio}", "provider": "bhashini", "text": text, "language": language, "requires_review": False}
