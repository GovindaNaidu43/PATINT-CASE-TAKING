"""Source grounding: every clinical summary claim must cite a verifiable source."""

ALLOWED_SOURCE_PREFIXES = ("turn:", "doc:", "signal:")


def verify_sources(sources: list[str]) -> list[str]:
    if not sources or any(not source.startswith(ALLOWED_SOURCE_PREFIXES) for source in sources):
        raise ValueError("Every summary claim needs at least one turn:, doc:, or signal: source")
    return list(dict.fromkeys(sources))


def summarize(facts: list[str], sources: list[str]) -> dict:
    verified = verify_sources(sources)
    content = "Clinical draft (physician review required): " + (
        " ".join(facts) if facts else "No source facts supplied."
    )
    return {"content": content, "sources": verified, "physician_confirmed": False, "status": "draft"}
