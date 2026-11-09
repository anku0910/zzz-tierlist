# 貢獻指南（CONTRIBUTING）

零建置專案——改完即用，無需安裝依賴。本地預覽：`python -m http.server 8000`（或直接以 `file://` 開啟 `index.html`）。

## 新增角色（data.js）

1. 在 `AGENTS` 加入一筆記錄：`id / name / fullName / faction / role / attribute / specialAttribute? / rank / img / imgSquare / imgRound [/imgProfile] / available`
2. `AGENT_NAMES` 補上 en／ja／ko 顯示名（缺漏會 fallback 回中文名）
3. 圖檔放 `assets/zzz/`：立繪 `Agent_*_Icon.png`、Q版 `Avatar_*.png`、頭貼 `Message_*_Icon.png`；正式抓取用 `python tools/fetch_zzz_assets.py`
   - ⚠️ 勿用 `tools/build_data.py` 重建——其 regex 已過時，`data.js` 為手工維護，直接編輯
4. `node --check data.js` 驗證語法；角色出現於角色庫即成功

## i18n 慣例（i18n.js）

- 任何新 UI 文案須同時補齊**四語**（zh-TW／en／ja／ko）；缺鍵會退回英→中
- DICT 內**不可有重複鍵**（JS 物件後鍵覆蓋，曾因此踩坑）
- 動態字串一律走 `I18N.t(key, vars)`；靜態節點用 `data-i18n` 系列（變體：`-html`／`-placeholder`／`-title`／`-aria`，變數用 `data-i18n-vars`）
- ⚠️ 帶子元件（`<input>`／`<select>`）的元素**不要**掛 `data-i18n`——`textContent` 賦值會摧毀子節點；改用 `data-i18n-aria` 或把文字放進空的 `<span>`
- 角色名顯示一律經 `I18N.agentName(agent)`，勿直接讀 `agent.name`
- 改任何 JS／CSS 後**遞增** `index.html` 的 `?v=` 快取參數

## 驗證

```bash
node --check i18n.js
node --check app.js
node --check data.js
node --check chart.js
pip install playwright && playwright install msedge
python tools/verify_theweb.py   # 51 項自動檢查，截圖輸出至 _verify/
```

## Commit 風格

`fix:` ／ `feat:` ／ `docs:` 前綴＋英文摘要（例：`fix: i18n counters, aria labels, axis labels`）。
