import json
import re
import sys
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any

from .persona import CHAT_SUFFIX, EMOTION_RULE, PERSONA
from .tools import TOOL_SCHEMAS, run_tool

EMOTIONS = ("happy", "sad", "angry", "surprised", "shy", "neutral", "thinking")
_EMO_RE = re.compile(r"<emo:\s*(\w+)\s*>")


@dataclass
class ChatEvent:
    type: str  # token / tool / emotion / done / error
    data: Any = None


def build_system_prompt(persona: bool = True, tools_enabled: bool = True) -> str:
    base = PERSONA if persona else "你是一个乐于助人的助手。"
    if tools_enabled:
        base += CHAT_SUFFIX + EMOTION_RULE
    return base


def extract_emotion(text: str):
    found = _EMO_RE.findall(text)
    cleaned = _EMO_RE.sub("", text).strip()
    mood = found[-1].lower() if found else "neutral"
    if mood not in EMOTIONS:
        mood = "neutral"
    return cleaned, mood


def stream_chat(
    user_text,
    history,
    model,
    client,
    temperature=0.7,
    max_steps=6,
    tools_enabled=True,
    persona=True,
) -> Iterator[ChatEvent]:
    messages = [{"role": "system", "content": build_system_prompt(persona, tools_enabled)}]
    messages.extend(history)
    messages.append({"role": "user", "content": user_text})

    tools = TOOL_SCHEMAS if tools_enabled else None

    for _ in range(max_steps):
        try:
            stream = client.chat.completions.create(
                model=model,
                messages=messages,
                tools=tools,
                temperature=temperature,
                stream=True,
            )
        except Exception as exc:
            yield ChatEvent("error", f"{type(exc).__name__}: {exc}")
            return

        parts, tool_calls = [], {}

        try:
            for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta

                piece = getattr(delta, "content", None)
                if piece:
                    parts.append(piece)
                    yield ChatEvent("token", piece)

                for tc in getattr(delta, "tool_calls", None) or []:
                    idx = tc.index or 0
                    slot = tool_calls.setdefault(idx, {"id": "", "name": "", "arguments": ""})
                    if tc.id:
                        slot["id"] = tc.id
                    if tc.function:
                        if tc.function.name:
                            slot["name"] += tc.function.name
                        if tc.function.arguments:
                            slot["arguments"] += tc.function.arguments
        except Exception as exc:
            yield ChatEvent("error", f"流式读取中断：{type(exc).__name__}: {exc}")
            return

        full = "".join(parts)
        cleaned, mood = extract_emotion(full)

        if not tool_calls:
            if mood != "neutral":
                yield ChatEvent("emotion", mood)
            yield ChatEvent("done", cleaned)
            return

        messages.append(
            {
                "role": "assistant",
                "content": full or None,
                "tool_calls": [
                    {
                        "id": s["id"] or f"call_{i}",
                        "type": "function",
                        "function": {"name": s["name"], "arguments": s["arguments"] or "{}"},
                    }
                    for i, s in sorted(tool_calls.items())
                ],
            }
        )

        for i, s in sorted(tool_calls.items()):
            name, raw = s["name"], s["arguments"] or "{}"
            try:
                args = json.loads(raw)
            except json.JSONDecodeError:
                result = f"[参数解析失败] {raw[:120]}"
            else:
                yield ChatEvent("tool", {"name": name, "args": args})
                result = run_tool(name, args)
                print(f"[tool] {name}({raw}) -> {result[:100]}", file=sys.stderr)

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": s["id"] or f"call_{i}",
                    "content": str(result)[:2000],
                }
            )

    yield ChatEvent("emotion", "thinking")
    yield ChatEvent("done", "这个问题我绕了几圈没解决，换个问法试试？")
