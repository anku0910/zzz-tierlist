# Changelog

本檔記錄 TheWeb 與周邊工具的重大變更。格式：日期 — 標題，分節列出系統/元件/檔案/驗證。

## 2026-11-09 — TheWeb UI 現代化重設計（ZZZ 原生風）

### 視覺系統（styles.css 全面重寫）
- 全新「石墨黑 × 螢光黃綠」設計系統取代「深藍 × 暖金」：`--bg #0a0a0c`、三階面板 `#131316 / #1a1a1f / #222228`、強調色 `--acc #d4ff3f`。
- 全面銳角化：所有非圓形元件 0 圓角；僅正圓元件保留圓形（rank 徽章、圖表圓點、頭貼模式、儲存狀態點）。
- 斜切（clip-path）簽名元素：品牌標、active 檢視分頁、主按鈕、提示編號 chip；僅出現於匯出區外。
- emoji 圖示（⚡🏛📊▾）全面替換為 inline SVG（方形線帽、稜角風格）；新增 SVG favicon 與 `theme-color`。

### 元件
- Header：可編輯標題 hover 底線、儲存狀態點、分段式檢視切換、去漸層實色螢光主按鈕。
- 階級表：標籤列 92→72px（flat 色塊 + 黑字）、空列高 96→84px、拖曳狀態螢光內框。
- 角色卡：role/attr 徽章收進卡片左上角（不再外凸）、rank 圓徽章保留、hover 螢光描邊 + 抬升。
- 側欄：寬 521→460px、selects 自繪箭頭（appearance:none）、陣營 chip 未選降飽和 / 選中螢光圈、pool 網格呼吸加大。
- 二維圖：板面 `#101014` + 中心十字線、圓點螢光環 + 光暈、名稱膠囊標籤、工具欄 260px 且匯出鈕置底、板面可用高度提高（`min(680px, 100vh-250px)`）。
- Modal / Toast / 滾動條現代化；Toast 加語意色方點。
- 響應式退化：≤1320px 側欄 400px；≤1140px 上下堆疊（僅防破版）。

### 匯出同步（html2canvas@1.4.1 相容）
- 階級表 PNG：html2canvas 底色 + canvas fallback（`drawBoardToCanvas`/`drawTierRow`）配色全面換新。
- 二維圖 PNG：`chart.js exportPNG` 手繪配色（底/板/格線/十字/文字/圓點/螢光環）全面換新。
- 預覽匯出視窗（`previewExport`）內嵌樣式對齊新系統。
- 匯出區僅使用 hex/rgba；clip-path 僅在匯出區外。

### 資料
- `TIER_DEFAULTS`/`TIER_COLORS` 更新（S–D 紅橙黃綠藍、黑字可讀、15 色調色盤統一飽和度）；既有 localStorage 存檔不受影響（用戶自選色保留）。

### 文案
- 排行榜計數 `N ranked` → `已排行 N`。

### 工具與驗證
- `tools/verify_theweb.py`：側欄斷言 521→460px、徽章斷言改「收於卡內角落」、新增 1150px 窄視窗截圖。
- 驗證結果：25/25 檢查通過（拖曳、放置、滑桿、鍵盤微調、匯出、持久化、0 破圖）。
- 目視複核 10 個 UI 表面：階級表、二維圖、窄視窗、2 張匯出 PNG、分享選單、階級模態、頭貼模式、貼紙模式+隱藏名稱、Toast（截圖存於 `_verify/`）。

### 檔案
- `TheWeb/styles.css`（重寫）· `TheWeb/index.html` · `TheWeb/app.js` · `TheWeb/chart.js` · `TheWeb/data.js` · `tools/verify_theweb.py`
- 回滾點：AFT checkpoint `theweb-ui-redesign-pre`

## 2026-11-09 — 功能批次 #2：放置分離、陣營重整、特殊屬性、教學介面

### 放置狀態分離
- 角色庫改為**檢視感知**：階級表檢視排除「已排行」、二維圖檢視排除「已配置」——放上階級表不再讓角色從二維圖消失（反之亦然）。
- 側欄標籤動態切換：「未排行角色／未配置角色」、計數「N 未排行／N 未配置」。
- chart.js 新增 `onMembership` hook（僅在 place/remove 觸發，避免拖曳高頻重繪角色庫）。

### 陣營重整（21 → 14，官方正名）
- 正名：貝洛伯格重工→白祇重工、奧玻爾小隊→奧波勒斯小隊、虛獵特勤六課→對空六課、琉拉之星→天琴座、紅喉鵐→反舌鳥、雲魁峰→雲巋山、驚嚇小屋→怪啖屋、坎普斯合規局→坎卜斯黑枝、羅斯卡利法→羅斯凱利法。
- 成員異動：希希芙／賽維裡安→刑偵特勤組；克拉蕾／維琳娜／諾姆／希格莉德→羅斯凱利法；零號·安比→**雙陣營**（狡兔屋＋奧波勒斯小隊，`faction` 支援陣列）。
- 移除 7 個空/合併陣營之篩選與 logo 檔（含法厄同、達雅特聖約；其角色紀錄保留、僅字串顯示，法厄同不再作為篩選）。
- 新增角色 **挽晝（Sunbringer）**：鋒御／火／S，方形立繪自 Fandom 抓取（無 Q版/頭貼資產→ fallback 顯示立繪）。

### 三種圖片模式重定義（貼紙→頭貼）
- 立繪（不變）／**Q版**（原名「頭貼」，官方 Avatar 公仔圖重新命名）／**頭貼**（全新：Inter-Knot 訊息頭像 `Message_*_Icon.png`，取自 Knock Knock/Media 頁，共 55 名）。
- localStorage `sticker` 模式值遷移為 `profile`（`imgMode`/`imgOverride` 自動轉換）；貼紙資產降為 fallback 鏈一員。
- `fetch_zzz_assets.py`：新增 `PROFILE_FILES` 對照表與頭貼抓取步驟、round 圖可選化（僅方形圖的角色可入列）。

### 特殊屬性系統
- `SPECIAL_ATTRIBUTES = [流明, 凜刃, 烈霜, 玄墨]`；雅＝冰＋烈霜、儀玄＝以太＋玄墨、葉瞬光＝物理＋凜刃、蕾米埃爾＝流明。
- 屬性篩選新增「**特殊**」分類置頂；角色卡一般屬性下追加特殊屬性徽章（文字底線）＋右下角圓點標記。
- 特殊色票：流明 #f8b5b9、凜刃 #f0d98c、烈霜 #a8dcf5、玄墨 #b8a9e0。

### 角色資料修正
- 洛克茜：異常→擊破；千夏：屬性冰→物理（職業確認為支援）。
- 職業色票：強攻→灰 #9aa0a6、支援→綠 #4ade80、命破→白底＋黑框 #ffffff、鋒御→鮮紅 #ff3b3b。

### 二維圖與過濾
- 左側面板新增「操作說明」（編號清單，常駐）；移除板面下方舊註記。
- 兩個排名介面各自新增「顯示職業」過濾：階級表板下 `.board-foot`、二維圖面板 `#chart-role-view`（僅影響顯示、獨立持久化）。

### 使用教學介面
- Header「使用教學」按鈕＋首次造訪自動彈出（`zzz-tierlist-tutorial-done` 獨立旗標）；三區塊：階級表／二維圖／標記與匯出。

### 檔案
- `TheWeb/data.js`、`TheWeb/app.js`、`TheWeb/chart.js`、`TheWeb/index.html`、`TheWeb/styles.css`、`tools/fetch_zzz_assets.py`、`tools/verify_theweb.py`、`TheWeb/assets/zzz/`（+1 立繪、+55 頭貼、−7 logo、faction-logos 14）、`zzz_assets/`（同步）、`README.md`（新增）
- 驗證：`verify_theweb.py` 48/48 通過（新增放置分離、職業過濾、教學、雙陣營、特殊標記、資產檢查）
- 回滾點：AFT checkpoint `theweb-features-batch-pre`

## 2026-11-09 — UI 微調：都市龐克質感（mono／眉標／背景漂流字）

### 新增
- **背景漂流字**：`.bg-drift` 全域層——「ZENLESS ZONE ZERO／ZENLESS／ZONE ZERO／ZZZ」六組不同大小深灰字（#212127–#2a2a31）、`skew(-7deg)`、以 95–170s 週期緩慢向左漂移（負延遲錯位），仿 ZZZ 遊戲選單背景。
- **面板半透明**：`.tier-board-wrap`／`.chart-frame`（rgba 0.86）、`.side-block`（rgba 0.9）、header（0.88）——漂字自面板下層隱約透出；皆為 rgba，PNG 匯出照常合成（底色 #0a0a0c）。
- **mono 字型層**：`--mono`（Roboto Mono，Google Fonts 漸進載入＋系統回退）——計數（已排行／未配置／顯示 X/Y）、階級字母、rank 徽章、滑桿數值、儲存時間、提示編號 chip。
- **眉標（eyebrow）**：lime mono 大寫寬字距小標——`CHARACTER LIBRARY`（角色庫）、`TIER BOARD`（板面）、`2-AXIS CHART`（二維圖）、`HOW TO USE`（教學）、`TIER EDITOR`（階級編輯器）。
- 網頁頂邊 2px 螢光實線；卡片圖片預設 `saturate(.94)`、hover 提亮；面板內距微增。
- Google Fonts（Noto Sans TC＋Roboto Mono）preconnect＋`display=swap`；離線自動回退系統字型堆疊。

### 相容性
- 動畫與質感僅存在於 body 層（`.bg-drift` z-index -1）與匯出區外；`prefers-reduced-motion` 時漂字停用。
- 48/48 驗證通過；匯出 PNG 目視複核（無質感滲入、透明底合成正確）。

## 2026-11-09 — 微調：漂字加粗斜向、個人化預設標題

- **背景漂流字加粗＋微斜**：字重 700→800（改載 JetBrains Mono 800；Google Fonts URL 更新）；軌跡由右上逐漸向左下（總落差 8vh），維持近水平、與原本差異小。
- **預設標題去「我」**：首次開啟於教學關閉後詢問「怎麼稱呼你？」（可略過）——
  - 填名 → 預設標題「{名字}的絕區零排行」（localStorage `zzz-user-name`）
  - 略過 → 中性預設「絕區零排行」
  - 舊存檔的「我的絕區零排行」自動遷移
  - 備註：網頁 JS 基於隱私限制無法讀取 OS 帳號或瀏覽器設定檔名，故採一次性詢問；名稱不進分享狀態。
- `verify_theweb.py`：+3 檢查（名稱提示出現、略過後中性標題、reload 不再彈）→ **51/51 通過**。

## 2026-11-09 — 背景漂流字 v2（對標 ZZZ 代理人選單）

- 漂字由 6 組擴充至 **22 組**、分佈 1%–96% 全頁（上方 80% 高密度）；尺寸 16px–360px（clamp 隨視窗縮放）、週期 85–210s、負延遲全面錯位。
- 新增**空心描邊字**（`-webkit-text-stroke: 2px`）與實心深灰字混搭（6 空心 / 16 實心）。
- 每字獨立斜角 `--sk`（-4°～-10°），keyframes 以 CSS 變數套用；文字輪替 ZENLESS ZONE ZERO / ZENLESS / ZONE ZERO / ZZZ / ZERO。
- 參考：ZZZ 代理人選單背景（FNF×ZZZ 動畫範例）；51/51 驗證通過。

## 2026-11-09 — 背景漂流字 v3：車道制（消除重疊、連續字串）

- 重構為 **12 條橫向車道**（間距 8.5vh，0–93.5vh 全頁覆蓋）：每道上是一整條**重複字串**（如「ZENLESS ZONE ZERO ZENLESS ZONE ZERO…」）向左連續流動。
- 每道 2 份同內容並排＋`translateX(-50%)` 無縫循環；車道內字級一律 ≤6.6vh（`--size`）→ **車道間零垂直重疊**。
- 每道獨立參數：尺寸 3.2–6.6vh、灰階 #1d1d22–#28282f、斜角 -4°~-9°、速度 75–170s；4 條為空心描邊字（l3/l6/l9/l12）。
- 字串輪替：ZENLESS ZONE ZERO／ZENLESS／ZONE ZERO／ZZZ／ZERO。51/51 驗證通過。

## 2026-11-09 — 背景漂流字 v4：車道整體傾斜 15°

- `.bg-drift` 容器整體 `rotate(-15deg)`（左低右高的斜向）；外擴 `inset: -22vh -10vw` 補償旋轉四角，維持全屏覆蓋。
- 車道由 12 條延伸至 **18 條**（l13–l18、至 144.5vh）填滿旋轉後的加高容器，零垂直重疊不變。
- 移除每車道殘留的字形 `skew` — 總傾角恰好 ≈15°（字形與車道方向一致）。
- 51/51 驗證通過。
