from repertory import match_rubrics

def test_sun_aggravated_headache_maps_to_rubric():
    matches = match_rubrics("My headache gets worse in bright sunlight")
    assert matches[0]["rubric"] == "Head - Pain - Sun - agg."
    assert matches[0]["score"] >= 4

def test_unrelated_text_has_no_rubric():
    assert match_rubrics("I feel okay today") == []