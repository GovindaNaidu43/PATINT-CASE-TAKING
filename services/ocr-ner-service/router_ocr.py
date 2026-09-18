from fastapi import APIRouter, UploadFile, File
from ocr_engine import extract_text
from ner_extractor import extract_entities
router = APIRouter(prefix="/documents", tags=["documents"]); review_queue = []
@router.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    result = extract_text(await file.read(), file.filename or "document"); result["entities"] = extract_entities(result["text"]); review_queue.append(result); return result
@router.get("/review-queue")
def review_items(): return {"items": review_queue}
