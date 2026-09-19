import io
import re

class DocumentDigitizer:
    def extract_text_from_image(self, image_bytes: bytes, filename: str = "") -> str:
        if not image_bytes: raise ValueError("A document is required")
        try:
            from PIL import Image
            import pytesseract
            image = Image.open(io.BytesIO(image_bytes))
            return pytesseract.image_to_string(image, lang="eng+hin")
        except (ImportError, OSError):
            return image_bytes.decode("utf-8", errors="replace")

    def parse_clinical_entities(self, text: str) -> dict:
        drugs = [{"form": match[0], "name": match[1], "dosage": "As directed", "frequency": "OD"} for match in re.findall(r"\b(Tab|Cap|Syr|Inj)\.?\s+([A-Za-z0-9-]+)", text, re.I)]
        dosages = re.findall(r"\b(\d+\s*(?:mg|g|ml))\b", text, re.I)
        frequencies = re.findall(r"\b(1-0-1|1-1-1|0-0-1|BD|TDS|OD|QID)\b", text, re.I)
        for index, medication in enumerate(drugs):
            if index < len(dosages): medication["dosage"] = dosages[index]
            if index < len(frequencies): medication["frequency"] = frequencies[index]
        return {"raw_text": text, "extracted_medications": drugs, "document_type": "Prescription", "review_required": True}