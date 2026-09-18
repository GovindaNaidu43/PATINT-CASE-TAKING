from ner_extractor import extract_entities
def test_labs_are_flagged_and_reviewed():
    result = extract_entities("Hemoglobin: 8.0; metformin")
    assert result["labs"][0]["abnormal"] and result["review_required"]
