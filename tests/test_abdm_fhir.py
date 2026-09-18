import pytest
from fhir_builder import consultation_bundle
def test_fhir_requires_confirmation():
    with pytest.raises(ValueError): consultation_bundle("p1", "draft", False)
    assert consultation_bundle("p1", "final", True)["resourceType"] == "Bundle"
