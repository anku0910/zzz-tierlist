<div align="center">

# 絕區零 Tier List 製作器

**Zenless Zone Zero 階級表 × 二維圖 排行工具 — 純前端、零建置、完全離線**

[![Platform](https://img.shields.io/badge/Platform-Web_2026-0a0a0c?style=flat-square&labelColor=0a0a0c&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/anku0910/zzz-tierlist)
[![Build](https://img.shields.io/badge/Build-None_Needed-d4ff3f?style=flat-square&labelColor=0a0a0c)](https://github.com/anku0910/zzz-tierlist)
[![Runtime](https://img.shields.io/badge/Runtime-100%25_Offline-4c1?style=flat-square)](https://github.com/anku0910/zzz-tierlist)
[![i18n](https://img.shields.io/badge/i18n-zh--TW_·_en_·_ja_·_ko-4a90d9?style=flat-square)](#多語系)
[![License](https://img.shields.io/github/license/anku0910/zzz-tierlist?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/anku0910/zzz-tierlist?style=flat-square&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist/stargazers)
[![PRs](https://img.shields.io/badge/PRs-Welcome-ff4655?style=flat-square)](https://github.com/anku0910/zzz-tierlist/pulls)

[繁體中文](README.md) · [English](docs/README.en.md) · [日本語](docs/README.ja.md) · [한국어](docs/README.ko.md)

</div>

---

## 簡介

絕區零（Zenless Zone Zero）社群工具：製作**階級表（Tier List）**與**強度 × 易用度二維圖**。純 vanilla JavaScript，無需建置、無需後端，所有資產本地化——離線以 `file://` 直接開啟也能完整運作。

介面採「石墨黑 × 螢光黃綠」的 ZZZ 原生風格設計，支援四種語言（繁體中文／English／日本語／한국어），介面與角色名皆會即時切換。

## 玩家指南

**版本覆蓋**

- 收錄 **63 位代理人**（含未實裝，卡面灰階標示）、**14 官方陣營**、7 職業（強攻／擊破／異常／支援／防護／命破／鋒御）、7 屬性＋4 特殊屬性（流明／凜刃／烈霜／玄墨）
- 職業／屬性／稀有度逐筆校對（稀有度對照 Fandom 資料）；資料勘誤歡迎直接 PR `data.js`

**操作速查**

| 動作 | 階級表 | 二維圖 |
|---|---|---|
| 放置 | 拖曳入列 ／ 點擊快放 | 點選角色後點板面 ／ 直接拖入 |
| 移回 | 雙擊卡片 ／ 拖回角色庫 | 「從圖上移除」 |
| 位置微調 | — | 方向鍵 或 `W A S D`（`Shift` ＝ 5× 步幅） |
| 重疊選取 | — | 雙擊循環切換 |
| 層級調整 | — | 「移至最前」 |
| 圖片模式 | 右鍵卡片：立繪／Q版／頭貼 | — |

**榜單工作流（發 Discord／巴哈／Reddit）**

1. **鎖定池子** — 用 14 陣營 logo 篩選或「顯示職業」過濾，只看要評的對象
2. **快速掃榜** — 依稀有度／屬性排序，S 級先定位、A 級補位
3. **二維定位** — 切到二維圖，放上 強度 × 易用度 軸；軸名可自訂（如「深淵輸出／開荒友好」）
4. **匯出** — PNG 以 2× 縮放、深色底合成，直接貼文免後製
5. **流傳** — 分享連結攜帶完整榜面狀態，對方開啟即見；JSON 匯出留存版本快照

## 功能

- **階級表**：拖曳／點擊放置角色、雙擊移回角色庫、階級標籤與顏色自訂、「顯示職業」表面過濾（僅影響顯示、不動資料）
- **二維圖**：點選或拖曳放置、圓點拖曳、重疊雙擊循環選取、**方向鍵／WASD 微調**（Shift 加速）、Y／X 軸名編輯、「顯示職業」過濾、PNG 匯出（canvas 手繪）
- **放置狀態分離**：階級表與二維圖互不影響——放上階級表不會讓角色從二維圖消失，反之亦然
- **角色庫**（右側共用）：搜尋（**支援各語言角色名**）、14 陣營 logo 篩選、職業／屬性／排序、「特殊」屬性分類
- **三種圖片模式**：立繪／Q版／頭貼（Inter-Knot 訊息頭像）；右鍵卡片可個別切換
- **特殊屬性標記**：流明／凜刃／烈霜／玄墨 角色顯示專屬徽章與圓點
- **多語系**：繁體中文／English／日本語／한국어，介面與角色名即時切換（自動偵測瀏覽器語言）
- **匯出**：階級表 PNG（html2canvas ＋ canvas 後備）、二維圖 PNG、分享連結、JSON 匯入／匯出、預覽匯出
- **使用教學**：首次造訪自動顯示，可隨時重開
- **個人化**：首次使用詢問稱呼，自動產生「{名字}的絕區零排行」預設標題
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

## 多語系

- 語言切換：header 右側選單；`localStorage` 記住選擇，未選時依瀏覽器語言偵測
- 靜態文字：`index.html` 以 `data-i18n`（含 `-html`／`-placeholder`／`-title` 變體）標記，`applyStatic()` 掃描翻譯
- 動態內容：`setLocale()` 發出 `i18n:change` 事件，`app.js` 監聽後重繪角色庫／階級卡／圖表

## 資產管線（開發）

```bash
python tools/fetch_zzz_assets.py --dry-run   # 檢視抓取計畫（不寫檔）
python tools/fetch_zzz_assets.py             # 抓取＋部署到 assets/zzz/
```

來源為 Fandom `api.php`（非 `/wiki/*` HTML，該路徑會被 Cloudflare 403）；節流與重試內建。**執行期完全離線**——站點不依賴 Fandom。

## 開發與驗證

```bash
pip install playwright && playwright install msedge
python tools/verify_theweb.py   # 51 項自動檢查，截圖輸出至 _verify/
```

## 設計系統重點

- 石墨黑 `#0a0a0c`、面板三階 `#131316 / #1a1a1f / #222228`、唯一強調色螢光黃綠 `#d4ff3f`
- 除正圓元件（rank 徽章、圖表圓點、頭貼、狀態點）外一律 0 圓角；斜切（clip-path）僅用於匯出區外
- PNG 匯出區僅用 hex/rgba（html2canvas 相容）；主題色變更需同步 `app.js` 與 `chart.js` 的匯出繪製

## 授權

[MIT](LICENSE) © 2026 anku0910
