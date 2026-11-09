<div align="center">

# 絕區零 Tier List 製作器

**Zenless Zone Zero 階級表 × 二維圖 排行工具 — 純前端、零建置、完全離線**

[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/anku0910/zzz-tierlist)
[![Runtime](https://img.shields.io/badge/Runtime-100%25_Offline-4c1?style=flat-square)](https://github.com/anku0910/zzz-tierlist)
[![i18n](https://img.shields.io/badge/i18n-zh--TW_·_en_·_ja_·_ko-4a90d9?style=flat-square)](#多語系)

[繁體中文](README.md) · [English](docs/README.en.md) · [日本語](docs/README.ja.md) · [한국어](docs/README.ko.md)

</div>

---

## 簡介

絕區零（Zenless Zone Zero）社群工具：製作**階級表（Tier List）**與**強度 × 易用度二維圖**。純 vanilla JavaScript，無需建置、無需後端，所有資產本地化——離線以 `file://` 直接開啟也能完整運作。

支援四種語言（繁體中文／English／日本語／한국어），介面與角色名皆會即時切換。

## 玩家指南

**版本覆蓋**

- 收錄 **63 位代理人** 職業（強攻／擊破／異常／支援／防護／命破／鋒御）
- 職業／屬性／稀有度逐筆校對（稀有度對照 Fandom 資料）；資料勘誤歡迎直接 PR `data.js`

**操作速查**

| 動作 | 階級表 | 二維圖 |
|---|---|---|
| 放置 | 拖曳入列 ／ 點擊快放 | 點選角色後點板面 ／ 直接拖入 |
| 移回 | 雙擊卡片 ／ 拖回角色庫 | 「從圖上移除」 |
| 位置微調 |  | 方向鍵 或 `W A S D`（`Shift` ＝ 5× 步幅） |
| 重疊選取 |  | 雙擊循環切換 |
| 層級調整 |  | 「移至最前」 |
| 圖片模式 | 右鍵卡片：立繪／Q版／頭貼 |  |

**榜單工作流（發 Discord／巴哈／Reddit）**

1. **鎖定池子** — 用 14 陣營 logo 篩選或「顯示職業」過濾，只看要評的對象
2. **快速掃榜** — 依稀有度／屬性排序，S 級先定位、A 級補位
3. **二維定位** — 切到二維圖，放上 強度 × 易用度 軸；軸名可自訂（如「深淵輸出／開荒友好」）
4. **匯出** — PNG 以 2× 縮放、深色底合成，直接貼文免後製

## 功能

- **階級表**：拖曳／點擊放置角色、雙擊移回角色庫、階級標籤與顏色自訂、「顯示職業」表面過濾（僅影響顯示、不動資料）
- **二維圖**：點選或拖曳放置、圓點拖曳、重疊雙擊循環選取、**方向鍵／WASD 微調**（Shift 加速）、Y／X 軸名編輯、「顯示職業」過濾、PNG 匯出（canvas 手繪）
- **角色庫**（右側共用）：搜尋（**支援各語言角色名**）、14 陣營 logo 篩選、職業／屬性／排序、「特殊」屬性分類
- **三種圖片模式**：立繪／Q版／頭貼（Inter-Knot 訊息頭像）；右鍵卡片可個別切換
- **持久化**：localStorage `zzz-tierlist-v2`，舊存檔自動遷移

## 專案結構

| 檔案 | 說明 |
|---|---|
| `index.html` | 外殼：header ＋ 檢視分頁 ＋ main／sidebar |
| `styles.css` | 設計系統（石墨黑 × 螢光黃綠） |
| `i18n.js` | 四語字典 ＋ `data-i18n` 綁定 ＋ `i18n:change` 事件 |
| `app.js` | 狀態／篩選／拖曳／匯出／教學 |
| `chart.js` | 二維圖模組（DOM 百分比圓點） |
| `data.js` | 63 名角色資料 ＋ `AGENT_NAMES` 多語名稱表 ＋ 陣營／屬性色票 |
| `assets/zzz/` | 立繪／Q版／頭貼／貼紙備援／14 陣營 logo（全本地，無外部依賴） |
| `tools/` | 資產抓取與自動化驗證腳本（開發用） |

## 資料模型（data.js）

- `AGENTS` 記錄：`id / name / fullName / faction / role / attribute / specialAttribute / rank / img / imgSquare / imgRound / imgProfile / available`
- `faction` 可為字串或**陣列**（雙陣營：零號·安比＝狡兔屋＋奧波勒斯小隊）
- `AGENT_NAMES`：en／ja／ko 顯示名對照表（`I18N.agentName()` 於 zh-TW 直接使用 `name`）
- `FACTIONS`（14）與 `ROLE_COLORS`／`ATTRIBUTE_COLORS`／`FACTION_LOGOS`／`FACTION_COLORS` 色票
