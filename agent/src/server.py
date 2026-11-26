import json
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel, Field

from .chat import stream_chat
from .config import BASE_URL, MODEL, require_api_key
from .session import InMemoryStore

ROOT = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT / "web"

app = FastAPI(title="AI 形象智能体")
store = InMemoryStore(ttl_seconds=3600)


def get_client():
    return OpenAI(api_key=require_api_key(), base_url=BASE_URL)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str | None = None
    tools: bool = True
    persona: bool = True


def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.get("/api/health")
def health():
    return {"ok": True, "model": MODEL}


@app.post("/api/reset")
def reset(session_id: str):
    store.delete(session_id)
    return {"ok": True}


@app.post("/api/chat")
def chat(req: ChatRequest):
    client = get_client()
    sid = req.session_id or uuid.uuid4().hex
    session = store.get_or_create(sid)

    history = [
        {"role": m["role"], "content": m["content"]}
        for m in session.messages
        if m.get("role") in ("user", "assistant") and m.get("content")
    ][-20:]

    def gen():
        collected, mood = [], "neutral"
        yield sse("session", {"session_id": sid})
        try:
            for ev in stream_chat(
                req.message,
                history,
                model=MODEL,
                client=client,
                tools_enabled=req.tools,
                persona=req.persona,
            ):
                if ev.type == "token":
                    collected.append(ev.data)
                    yield sse("token", {"text": ev.data})
                elif ev.type == "emotion":
                    mood = ev.data
                    yield sse("emotion", {"mood": ev.data})
                elif ev.type == "tool":
                    yield sse("tool", {"name": ev.data["name"]})
                elif ev.type == "error":
                    yield sse("error", {"message": ev.data})
                elif ev.type == "done":
                    final = ev.data or "".join(collected)
                    session.messages.append({"role": "user", "content": req.message})
                    session.messages.append({"role": "assistant", "content": final})
                    session.mood = mood
                    store.save(session)
                    yield sse("done", {"text": final, "mood": mood, "session_id": sid})
        except Exception as exc:
            yield sse("error", {"message": f"{type(exc).__name__}: {exc}"})

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


if WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

    @app.get("/")
    def index():
        f = WEB_DIR / "index.html"
        if not f.exists():
            raise HTTPException(404, "web/index.html 不存在")
        return FileResponse(f)
