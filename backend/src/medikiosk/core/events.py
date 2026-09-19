"""In-memory event hub for local clinic real-time events.

For multi-process or multi-kiosk deployments, this can be swapped with Redis pub/sub.
"""
import asyncio
from collections.abc import AsyncIterator


class EventHub:
    def __init__(self) -> None:
        self._subscribers: set[asyncio.Queue[dict]] = set()

    async def publish(self, event_type: str, data: dict) -> None:
        event = {"type": event_type, "data": data}
        for subscriber in tuple(self._subscribers):
            await subscriber.put(event)

    async def stream(self) -> AsyncIterator[dict]:
        queue: asyncio.Queue[dict] = asyncio.Queue()
        self._subscribers.add(queue)
        try:
            while True:
                yield await queue.get()
        finally:
            self._subscribers.discard(queue)


hub = EventHub()
