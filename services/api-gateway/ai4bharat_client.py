"""AI4Bharat/Bhashini adapter with deterministic local fallbacks."""
import base64
import json
import re
from config import settings
from repertory import match_rubrics

class AI4BharatClient:
    def __init__(self):
        self.endpoint = settings.bhashini_inference_url
        self.headers = {"Authorization": settings.bhashini_api_key, "userID": settings.bhashini_user_id, "Content-Type": "application/json"}

    def _request(self, task: dict, inputs: dict) -> dict:
        if settings.mock_external_services or not settings.bhashini_api_key or not settings.bhashini_user_id:
            return {"mode": "local-fallback"}
        import httpx
        response = httpx.post(self.endpoint, headers=self.headers, json={"pipelineTasks": [task], "inputData": inputs}, timeout=30)
        response.raise_for_status()
        return response.json()

    def speech_to_text(self, audio_base64: str, language: str = "hi") -> dict:
        try: base64.b64decode(audio_base64, validate=True)
        except (ValueError, TypeError): raise ValueError("audio_base64 must be valid base64")
        result = self._request({"taskType": "asr", "config": {"language": {"sourceLanguage": language}, "audioFormat": "wav", "samplingRate": 16000}}, {"audio": [{"audioContent": audio_base64}]})
        if result.get("mode") == "local-fallback": return {"transcript": "", "language": language, "provider": "browser-fallback", "requires_review": True}
        return {"transcript": result["pipelineResponse"][0]["output"][0]["source"], "language": language, "provider": "bhashini", "requires_review": True}

    def text_to_speech(self, text: str, language: str = "hi") -> dict:
        if not text.strip(): raise ValueError("text is required")
        result = self._request({"taskType": "tts", "config": {"language": {"sourceLanguage": language}, "gender": "female", "samplingRate": 8000}}, {"input": [{"source": text}]})
        if result.get("mode") == "local-fallback": return {"audio": None, "text": text, "language": language, "provider": "browser-fallback"}
        audio = result["pipelineResponse"][0]["audio"][0]["audioContent"]
        return {"audio": f"data:audio/wav;base64,{audio}", "text": text, "language": language, "provider": "bhashini"}

    def translate(self, text: str, source_lang: str, target_lang: str) -> dict:
        if not text.strip(): raise ValueError("text is required")
        if source_lang == target_lang: return {"translated_text": text, "provider": "identity"}
        result = self._request({"taskType": "translation", "config": {"language": {"sourceLanguage": source_lang, "targetLanguage": target_lang}}}, {"input": [{"source": text}]})
        if result.get("mode") == "local-fallback": return {"translated_text": text, "provider": "local-fallback", "requires_review": True}
        return {"translated_text": result["pipelineResponse"][0]["output"][0]["target"], "provider": "bhashini", "requires_review": True}

    def transliterate(self, text: str, target_lang: str = "hi") -> dict:
        if not text.strip(): return {"suggestions": [], "provider": "local-fallback"}
        result = self._request({"taskType": "transliteration", "config": {"language": {"sourceLanguage": "en", "targetLanguage": target_lang}}}, {"input": [{"source": text}]})
        if result.get("mode") == "local-fallback":
            common = {"bukhari": "बुखार", "bukhar": "बुखार", "pet me dard": "पेट में दर्द", "sar dard": "सिर दर्द"}
            return {"suggestions": [common[text.lower()]] if text.lower() in common else [], "provider": "local-fallback"}
        target = result["pipelineResponse"][0]["output"][0]["target"]
        return {"suggestions": target if isinstance(target, list) else [target], "provider": "bhashini"}

    def extract_lmmc(self, narrative: str, language: str = "hi") -> dict:
        if not narrative.strip(): raise ValueError("narrative is required")
        if settings.ai4bharat_llm_url and settings.ai4bharat_llm_api_key and not settings.mock_external_services:
            import httpx
            prompt = f"Extract LMMC clinical rubrics from this patient narrative in {language}. Return JSON with keys location, sensation, modalities_aggravation, modalities_amelioration, concomitants. Narrative: {narrative}"
            response = httpx.post(settings.ai4bharat_llm_url, headers={"Authorization": settings.ai4bharat_llm_api_key, "Content-Type": "application/json"}, json={"prompt": prompt, "temperature": 0, "response_format": "json"}, timeout=30)
            response.raise_for_status()
            data = response.json()
            content = data.get("content", data.get("output", data))
            if isinstance(content, str): content = json.loads(content)
            return {**content, "language": language, "provider": "ai4bharat-llm", "requires_review": True}
        rubrics = match_rubrics(narrative)
        lower = narrative.lower()
        return {"location": self._first(lower, ("head", "throat", "stomach", "chest")), "sensation": self._first(lower, ("pain", "cough", "nausea", "burning", "fatigue")), "modalities_aggravation": [term for term in ("sunlight", "bright light", "after eating", "cold") if term in lower], "modalities_amelioration": [], "concomitants": [], "rubrics": rubrics, "language": language, "provider": "local-structured-fallback", "requires_review": True}

    @staticmethod
    def _first(text: str, terms: tuple[str, ...]) -> str | None:
        return next((term for term in terms if re.search(rf"\b{re.escape(term)}\b", text)), None)