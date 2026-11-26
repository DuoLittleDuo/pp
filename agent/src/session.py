import threading
import time
from dataclasses import dataclass, field


@dataclass
class Session:
    session_id: str
    messages: list[dict] = field(default_factory=list)
    created_at: float = field(default_factory=time.time)
    last_active: float = field(default_factory=time.time)
    mood: str = "neutral"

    def touch(self):
        self.last_active = time.time()

    @property
    def idle_seconds(self):
        return time.time() - self.last_active


class InMemoryStore:
    """内存版会话存储，重启即丢失。"""

    def __init__(self, ttl_seconds: int = 3600, max_history: int = 40):
        self._data: dict[str, Session] = {}
        self._lock = threading.Lock()
        self.ttl = ttl_seconds
        self.max_history = max_history

    def get_or_create(self, session_id: str) -> Session:
        with self._lock:
            self._evict_expired()
            s = self._data.get(session_id)
            if s is None:
                s = Session(session_id=session_id)
                self._data[session_id] = s
            s.touch()
            return s

    def get(self, session_id: str):
        with self._lock:
            s = self._data.get(session_id)
            if s:
                s.touch()
            return s

    def save(self, session: Session):
        with self._lock:
            if len(session.messages) > self.max_history:
                session.messages = session.messages[-self.max_history :]
            session.touch()
            self._data[session.session_id] = session

    def delete(self, session_id: str):
        with self._lock:
            self._data.pop(session_id, None)

    def _evict_expired(self):
        dead = [k for k, v in self._data.items() if v.idle_seconds > self.ttl]
        for k in dead:
            del self._data[k]
