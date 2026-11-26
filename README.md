# 垚 · 陶 —— 非遗陶器 × 数字伙伴

手作陶器品牌站：杂志式排版、35 件宠物陶器、六种工艺纹样库、可定做，右下角有 AI 伙伴「垚垚」。

---

## 一键启动

双击 **`启动.bat`**，会开两个窗口（后端 8000、前端 5173），然后自动打开浏览器。

> 两个黑窗口都别关。要停止就关掉它们。

手动启动见下面。

---

## 前端

```bash
cd ceramic-web/frontend
npm install          # 第一次
npm run dev          # http://127.0.0.1:5173
```

生产构建：`npm run build`

---

## 后端（垚垚）

```bash
cd ceramic-web/agent
python -m venv .venv
.venv\Scripts\python.exe -m pip install --no-cache-dir -i https://pypi.tuna.tsinghua.edu.cn/simple fastapi "uvicorn[standard]" openai python-dotenv
.venv\Scripts\python.exe -m uvicorn src.server:app --host 127.0.0.1 --port 8000
```

- 密钥在 `agent/.env`（`OPENAI_API_KEY` / `OPENAI_BASE_URL` / `MODEL`），已在 `.gitignore` 里，不会被提交
- 前端把 `/api` 代理到 `127.0.0.1:8000`
- 后端没起时，聊天面板会给明确提示，不会白屏

**改商品后要同步给后端：**

```bash
cd ceramic-web
node tools/export-products.mjs
```

（把 `frontend/src/data/products.js` 导出成 `agent/data/products.json`，垚垚靠它查货）

---

## 垚垚能做什么

人设和工具都在 `agent/src/`：

| 文件 | 作用 |
|---|---|
| `persona.py` | 垚垚的人设：懂陶、话少、不编价格 |
| `tools.py` | 四个工具：搜商品 / 查详情 / 列类目 / 讲工艺 |
| `chat.py` | 流式对话 + 情绪标记 |
| `server.py` | FastAPI，`/api/chat` 输出 SSE |

工具全部只读本地 JSON，不会改任何东西。

---

## 形象与动作

`frontend/public/assets/agent/actions/` 里是 7 段透明 webm（1280×720，10 秒）：

| 文件 | 什么时候播 |
|---|---|
| `greeting.webm` | 打开面板 / 打招呼 |
| `thinking.webm` | 等待回复 |
| `talking.webm` | 逐字输出中、首页「认识垚垚」 |
| `happy.webm` | 回答完是开心情绪 |
| `cheer.webm` | 支付成功 |
| `shipping.webm` | 发货相关 |
| `idle.webm` | 待机 |

对应关系在 `frontend/src/config/agent-media.js`，改那里就行。
视频加载失败会自动退回 CSS 画的圆头，不会白屏。

---

## 图片

- **商品图**：`frontend/public/assets/products/<SKU>.webp`（1200px），列表用 `thumbs/<SKU>.webp`（480px）
- **原图**在项目根的 `产品图库_SKU/`，没有被改动
- 重新压缩：`python tools/optimize-images.py`（用系统里带 Pillow 的 Python）

换图只要覆盖同名 webp 文件，代码不用动。

**想加多角度照片**：把图放进 `products/`，然后在 `src/data/products.js` 里把 `images` 数组加一项，详情页会自动出现缩略图条。

---

## 纹样库

六种工艺：绞胎 / 五色陶土 / 窑变 / 柘红素陶 / 刻花 / 素陶原色。

文字说明在 `frontend/src/data/patterns.js`，图案图还没放。放图方法：

1. 图片放进 `frontend/public/assets/patterns/`
2. 在 `patterns.js` 里给对应工艺填 `image: '/assets/patterns/xxx.webp'`

页面会自动从空框变成真图。

---

## 页面一览

| 路径 | 页面 |
|---|---|
| `/` | 首页（五章，覆盖式滚动） |
| `/shop` | 逛陶器（左筛选 + 35 件） |
| `/shop/:id` | 陶器详情 |
| `/patterns` `/patterns/:id` | 纹样库 / 工艺详情 |
| `/customize` | 自己定做（器型+工艺+颜色+位置，实时预览） |
| `/story` `/story/:slug` | 工艺故事 |
| `/cart` `/checkout` `/pay/result` | 购物袋 / 结算 / 支付结果 |
| `/account` 及子页 | 我的、订单、收藏、定做、地址 |
| `/styleguide` | 样式页（验收用，可删） |

---

## 进度

已完成：

- 设计系统、顶栏、抽屉、面包屑、页脚
- 欢迎层（圆头眼睛跟鼠标）
- 首页五章 + 覆盖式滚动
- 35 件商品真实数据 + 图片（webp 压缩，13MB → 3.3MB）
- 商品列表 / 详情 / 购物袋 / 结算 / 支付 / 订单全链路
- 定做工作台（SVG 实时预览）
- 纹样库六种工艺
- 我的（订单 / 收藏 / 定做 / 地址）
- 垚垚：视频形象 + 真后端 + 店铺人设 + 四个查询工具

待做：

1. 纹样库的图案图（等你提供）
2. 商品信息核实（价格、库存、尺寸目前是占位）
3. 品牌信息（名称、联系方式、退换货政策）
4. 多角度商品图
5. 移动端逐页实测
6. 字体（Playfair Display + Noto Serif SC 本地字体文件）

---

## 已知限制

- 支付是**模拟**的，不会真的扣款
- 没有真实账号系统，订单和收藏存在浏览器本地
- 商品价格、库存、尺寸、交期都是占位内容，上线前必须核对
- 工艺故事三篇是示例文本
- 7 段 webm 共 21MB，单段 2–5MB，手机上首次加载偏慢（可以后续压）
