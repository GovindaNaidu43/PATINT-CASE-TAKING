"""Local object storage service for documents and image artifacts."""
from pathlib import Path
import uuid


class LocalObjectStorage:
    def __init__(self, root="data/objects"):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def put(self, content: bytes, suffix="bin") -> str:
        key = f"{uuid.uuid4()}.{suffix.lstrip('.')}"
        (self.root / key).write_bytes(content)
        return key
