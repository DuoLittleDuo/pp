"""命令行入口，用法：python -m src.main <任务描述>"""

from __future__ import annotations

import sys

from openai import OpenAI

from .agent import run_agent
from .config import BASE_URL, MAX_STEPS, MODEL, TEMPERATURE, require_api_key

DEFAULT_TASK = (
    "计算 (1234*56+789)/7，把结果保存成标题为「运算结果」的笔记，然后列出所有笔记确认。"
)


def main() -> None:
    task = " ".join(sys.argv[1:]).strip() or DEFAULT_TASK

    client = OpenAI(api_key=require_api_key(), base_url=BASE_URL)

    answer = run_agent(
        task,
        model=MODEL,
        client=client,
        max_steps=MAX_STEPS,
        temperature=TEMPERATURE,
    )

    print("\n=== 最终答案 ===")
    print(answer)


if __name__ == "__main__":
    main()
