from grounding_engine import verify_sources
def summarize(facts: list[str], sources: list[str]) -> dict:
    sources = verify_sources(sources)
    content = "Clinical draft (physician review required): " + (" ".join(facts) if facts else "No source facts supplied.")
    return {"content": content, "sources": sources, "physician_confirmed": False, "status": "draft"}
