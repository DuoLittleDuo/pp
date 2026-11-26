"""
商品图与形象图压缩
- 原图保留在 产品图库_SKU/（不动）
- 输出 webp：大图 1200px、缩略图 480px
"""

import os
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(r"D:\zhuomian\新web")
SRC = ROOT / "产品图库_SKU"
OUT = ROOT / "ceramic-web" / "frontend" / "public" / "assets" / "products"
THUMB = OUT / "thumbs"

OUT.mkdir(parents=True, exist_ok=True)
THUMB.mkdir(parents=True, exist_ok=True)


def save_webp(img, path, max_w, quality):
    w, h = img.size
    if w > max_w:
        img = img.resize((max_w, round(h * max_w / w)), Image.LANCZOS)
    img.save(path, "WEBP", quality=quality, method=6)
    return os.path.getsize(path)


total_full = 0
total_thumb = 0
count = 0

for jpg in sorted(SRC.rglob("*.jpg")):
    sku = jpg.stem
    with Image.open(jpg) as im:
        im = im.convert("RGB")
        total_full += save_webp(im.copy(), OUT / f"{sku}.webp", 1200, 82)
        total_thumb += save_webp(im.copy(), THUMB / f"{sku}.webp", 480, 78)
    count += 1

print(f"商品图 {count} 张")
print(f"大图合计 {total_full/1024/1024:.2f} MB")
print(f"缩略图合计 {total_thumb/1024/1024:.2f} MB")

# 形象图：1281x2844 的 png，压成 webp
avatar_src = ROOT / "ceramic-web" / "frontend" / "public" / "assets" / "agent" / "avatar.png"
if avatar_src.exists():
    with Image.open(avatar_src) as im:
        im = im.convert("RGBA")
        w, h = im.size
        if h > 1100:
            im = im.resize((round(w * 1100 / h), 1100), Image.LANCZOS)
        dst = avatar_src.with_suffix(".webp")
        im.save(dst, "WEBP", quality=86, method=6)
    print(f"形象图 -> {dst.name}  {os.path.getsize(dst)/1024/1024:.2f} MB")
