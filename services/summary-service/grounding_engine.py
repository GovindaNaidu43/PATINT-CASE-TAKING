ALLOWED_SOURCE_PREFIXES = ("turn:", "doc:", "signal:")
def verify_sources(sources: list[str]) -> list[str]:
    if not sources or any(not source.startswith(ALLOWED_SOURCE_PREFIXES) for source in sources):
        raise ValueError("Every summary claim needs at least one turn:, doc:, or signal: source")
    return list(dict.fromkeys(sources))
