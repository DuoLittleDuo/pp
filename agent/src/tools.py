"""工具层：实现函数 + 供模型使用的 schema，成对放一起便于维护。

这一版的工具是给陶器店导购用的，全部只读本地商品数据，不会改任何东西。
"""

from __future__ import annotations

import json
import re
from collections.abc import Callable
from functools import lru_cache
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "products.json"


@lru_cache(maxsize=1)
def load_data() -> dict[str, Any]:
    if not DATA_FILE.exists():
        return {"categories": [], "products": []}
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def all_products() -> list[dict[str, Any]]:
    return load_data().get("products", [])


def all_categories() -> list[dict[str, Any]]:
    return load_data().get("categories", [])


def _brief(p: dict[str, Any]) -> str:
    stock = f"库存{p['stock']}" if p["stock"] > 0 else "已售罄"
    custom = "可定制" if p["customizable"] else "不定制"
    return (
        f"{p['sku']}｜{p['name']}｜¥{p['price']}｜{p['category']}｜"
        f"{p['craft']}｜{p['size']}｜{p['glaze']}｜{stock}｜{custom}"
    )


# --------------------------------------------------------------------------
# 工具 1：按条件搜商品
# --------------------------------------------------------------------------


class SearchArgs(BaseModel):
    keyword: str = Field(
        default="",
        description="关键词，可以是器型（食盆/水碗/挂牌/摆件/纪念罐）、工艺（绞胎/窑变/刻花/五色/柘红/素陶）、"
        "用途（猫/犬/幼宠/双宠/人宠同系）或釉色。留空表示不限。",
    )
    max_price: int = Field(default=0, description="最高价，单位元。0 表示不限。")
    only_customizable: bool = Field(default=False, description="只看可以定做的。")


def search_products(
    keyword: str = "", max_price: int = 0, only_customizable: bool = False
) -> str:
    items = all_products()
    kw = (keyword or "").strip()
    if kw:
        terms = [t for t in re.split(r"[\s,，、]+", kw) if t]
        def hit(p):
            blob = " ".join(
                str(p.get(k, ""))
                for k in ("name", "category", "categoryShort", "craft", "glaze", "usage", "intro")
            ) + " " + " ".join(p.get("tags", []))
            return any(t in blob for t in terms)
        items = [p for p in items if hit(p)]

    if max_price and max_price > 0:
        items = [p for p in items if p["price"] <= max_price]
    if only_customizable:
        items = [p for p in items if p["customizable"]]

    if not items:
        return "没有找到符合条件的器物。可以放宽条件，或者看看五个类目：宠物食盆、宠物水碗、宠物挂牌、宠物摆件、宠物纪念罐。"

    items.sort(key=lambda p: p["price"])
    lines = [f"找到 {len(items)} 件："]
    lines += [_brief(p) for p in items[:8]]
    if len(items) > 8:
        lines.append(f"（还有 {len(items) - 8} 件，可以加条件缩小范围）")
    return "\n".join(lines)


# --------------------------------------------------------------------------
# 工具 2：看单件详情
# --------------------------------------------------------------------------


class DetailArgs(BaseModel):
    sku: str = Field(description="商品编号，例如 ZG-SB-01")


def get_product(sku: str) -> str:
    code = (sku or "").strip().upper()
    for p in all_products():
        if p["sku"].upper() == code:
            return (
                f"{p['name']}（{p['sku']}）\n"
                f"类目：{p['category']}｜工艺：{p['craft']}｜釉色：{p['glaze']}\n"
                f"价格：¥{p['price']}｜尺寸：{p['size']}｜容量：{p['capacity']}\n"
                f"材质：{p['material']}｜烧成：{p['process']}\n"
                f"库存：{p['stock']}｜交期：{p['leadTime']}\n"
                f"介绍：{p['intro']}"
            )
    return f"没有编号为 {sku} 的器物。"


# --------------------------------------------------------------------------
# 工具 3：类目概览
# --------------------------------------------------------------------------


class EmptyArgs(BaseModel):
    pass


def list_categories() -> str:
    cats = all_categories()
    prods = all_products()
    lines = ["五个类目："]
    for c in cats:
        n = sum(1 for p in prods if p["category"] == c["name"])
        lines.append(f"- {c['name']}（{c['en']}）：{n} 件。{c['note']}")
    return "\n".join(lines)


# --------------------------------------------------------------------------
# 工具 4：工艺说明
# --------------------------------------------------------------------------


class CraftArgs(BaseModel):
    name: str = Field(
        description="工艺名，六选一：绞胎、五色陶土、窑变、柘红素陶、刻花、素陶原色"
    )


CRAFT_NOTES = {
    "绞胎": "两种泥叠在一起拉，纹路是泥自己的走向，不是画上去的。每件纹路都不同。",
    "五色陶土": "五种颜色的土分段拼在一只器物上，色块排布随机，两件不会完全一样。",
    "窑变": "靠窑里的气氛和温度让釉自己发色，同窑不同位置颜色都不同，实物和照片一定有差异。",
    "柘红素陶": "含铁量高的红陶土，不施釉，靠泥本色和温度定色。表面有颗粒感，会吸水。",
    "刻花": "坯体半干时走刀刻出花纹，泥太湿会塌、太干会崩。刻掉的地方不再回来。",
    "素陶原色": "完全不施釉，保留泥的原始手感，用久了会慢慢变深，不适合长期盛水。",
}


def craft_info(name: str) -> str:
    key = (name or "").strip()
    for k, v in CRAFT_NOTES.items():
        if k in key or key in k:
            return f"{k}：{v}"
    return "目前有六种工艺：绞胎、五色陶土、窑变、柘红素陶、刻花、素陶原色。想问哪一种？"


# --------------------------------------------------------------------------
# 注册表
# --------------------------------------------------------------------------


def _schema(name: str, desc: str, model: type[BaseModel]) -> dict[str, Any]:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": desc,
            "parameters": model.model_json_schema(),
        },
    }


TOOLS: dict[str, dict[str, Any]] = {
    "search_products": {
        "fn": search_products,
        "schema": _schema(
            "search_products",
            "在店里按器型、工艺、用途或釉色搜索器物。用户问“有没有猫用的碗”“一千以内有什么”这类问题时用。",
            SearchArgs,
        ),
    },
    "get_product": {
        "fn": get_product,
        "schema": _schema(
            "get_product",
            "查一件器物的详细信息：价格、尺寸、容量、材质、库存、交期、介绍。知道 SKU 时用。",
            DetailArgs,
        ),
    },
    "list_categories": {
        "fn": list_categories,
        "schema": _schema(
            "list_categories",
            "列出五个类目和各类目的件数、说明。用户问“你们都卖什么”时用。",
            EmptyArgs,
        ),
    },
    "craft_info": {
        "fn": craft_info,
        "schema": _schema(
            "craft_info",
            "解释一种工艺是怎么做的。用户问“绞胎是什么”“窑变为什么颜色不一样”时用。",
            CraftArgs,
        ),
    },
}

TOOL_SCHEMAS: list[dict[str, Any]] = [t["schema"] for t in TOOLS.values()]
TOOL_FUNCS: dict[str, Callable[..., str]] = {k: t["fn"] for k, t in TOOLS.items()}


def run_tool(name: str, args: dict[str, Any]) -> str:
    """执行工具。异常转成文本返回给模型，让模型能自我修正。"""
    fn = TOOL_FUNCS.get(name)
    if fn is None:
        return f"[错误] 不存在工具 {name}，可用工具：{list(TOOL_FUNCS)}"
    try:
        return str(fn(**args))
    except Exception as exc:  # noqa: BLE001
        return f"[工具执行失败] {type(exc).__name__}: {exc}"
