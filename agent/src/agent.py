"""智能体核心：ReAct 循环。"""

from __future__ import annotations

import json
import sys
import time
from dataclasses import dataclass, field
from typing import Any, Protocol

from .tools import TOOL_SCHEMAS, run_tool

SYSTEM_PROMPT = """你是一个严谨的助手。

工作原则：
1. 需要外部信息或计算时，调用工具，不要凭记忆猜。
2. 一次可以调用多个工具；拿到结果后再决定下一步。
3. 工具报错时，阅读错误信息并调整参数重试，不要重复同样的错误调用。
4. 目标完成后，用简洁中文给出最终答案，不要复述工具的原始返回。"""


class ChatClient(Protocol):
    """只要能提供 chat.completions.create 即可，方便测试注入假模型。"""

    chat: Any


@dataclass
class Trace:
    steps: list[dict[str, Any]] = field(default_factory=list)
    prompt_tokens: int = 0
    completion_tokens: int = 0

    def add(self, **kw: Any) -> None:
        self.steps.append({"ts": time.strftime("%H:%M:%S"), **kw})

    def summary(self) -> str:
        total = self.prompt_tokens + self.completion_tokens
        return (
            f"\n--- trace ---\n步数: {len(self.steps)}  "
            f"输入 token: {self.prompt_tokens}  输出 token: {self.completion_tokens}  "
            f"合计: {total}"
        )


def compact(messages: list[dict], keep_recent: int = 6) -> list[dict]:
    """粗粒度上下文压缩：system + 初始目标 + 最近若干条。"""
    if len(messages) <= keep_recent + 2:
        return messages
    head = messages[:2]
    tail = messages[-keep_recent:]
    return head + [{"role": "system", "content": "（中间过程已省略）"}] + tail


def run_agent(
    task: str,
    model: str,
    client: ChatClient,
    max_steps: int = 12,
    temperature: float = 0.2,
    verbose: bool = True,
) -> str:
    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": task},
    ]
    trace = Trace()

    for step in range(1, max_steps + 1):
        resp = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=TOOL_SCHEMAS,
            temperature=temperature,
        )

        usage = getattr(resp, "usage", None)
        if usage:
            trace.prompt_tokens += getattr(usage, "prompt_tokens", 0) or 0
            trace.completion_tokens += getattr(usage, "completion_tokens", 0) or 0

        msg = resp.choices[0].message
        messages.append(msg.model_dump(exclude_none=True))

        if not getattr(msg, "tool_calls", None):
            trace.add(step=step, action="final", content=msg.content)
            if verbose:
                print(trace.summary(), file=sys.stderr)
            return msg.content or ""

        for call in msg.tool_calls:
            name = call.function.name
            raw = call.function.arguments or "{}"
            try:
                args = json.loads(raw)
            except json.JSONDecodeError:
                result = f"[参数解析失败] 收到非法 JSON：{raw[:200]}"
                args = {}
            else:
                result = run_tool(name, args)

            if verbose:
                print(f"[step {step}] {name}({raw}) -> {result[:120]}", file=sys.stderr)
            trace.add(step=step, action=name, args=args, result=result[:300])

            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

        messages = compact(messages)

    if verbose:
        print(trace.summary(), file=sys.stderr)
    return f"[已达最大步数 {max_steps}] 任务未完成，请拆分后重试。"
