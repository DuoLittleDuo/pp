"""集中管理配置：只在这里读环境变量，其他模块直接 import。"""

import os
from pathlib import Path

from dotenv import load_dotenv

# 项目根目录下的 .env（不是 src/ 里）
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

_API_KEY = os.getenv("OPENAI_API_KEY", "")
# 留空则走 OpenAI 官方；接 DeepSeek/通义/Kimi/vLLM 时填对应 base_url
BASE_URL = os.getenv("OPENAI_BASE_URL") or None
MODEL = os.getenv("MODEL", "gpt-4o-mini")

MAX_STEPS = int(os.getenv("MAX_STEPS", "12"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.2"))

# 笔记存放目录
NOTES_DIR = ROOT / "agent_notes"


def require_api_key() -> str:
    """真正要调模型时才校验，方便离线测试。"""
    if not _API_KEY:
        raise RuntimeError(
            "未设置 OPENAI_API_KEY。请复制 .env.example 为 .env 并填入 Key。"
        )
    return _API_KEY
