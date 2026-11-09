<div align="center">

# ゼンゼロ Tier List メーカー

**Zenless Zone Zero ティアリスト × 2軸チャート作成ツール — 純フロントエンド・ビルド不要・完全オフライン**

[![Platform](https://img.shields.io/badge/Platform-Web_2026-0a0a0c?style=flat-square&labelColor=0a0a0c&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/anku0910/zzz-tierlist)
[![Build](https://img.shields.io/badge/Build-None_Needed-d4ff3f?style=flat-square&labelColor=0a0a0c)](https://github.com/anku0910/zzz-tierlist)
[![Runtime](https://img.shields.io/badge/Runtime-100%25_Offline-4c1?style=flat-square)](https://github.com/anku0910/zzz-tierlist)
[![i18n](https://img.shields.io/badge/i18n-zh--TW_·_en_·_ja_·_ko-4a90d9?style=flat-square)](#多言語対応)
[![License](https://img.shields.io/github/license/anku0910/zzz-tierlist?style=flat-square)](../LICENSE)
[![Stars](https://img.shields.io/github/stars/anku0910/zzz-tierlist?style=flat-square&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist/stargazers)
[![PRs](https://img.shields.io/badge/PRs-Welcome-ff4655?style=flat-square)](https://github.com/anku0910/zzz-tierlist/pulls)

[繁體中文](../README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

</div>

---

## 概要

Zenless Zone Zero（ゼンレスゾーンゼロ）向けのコミュニティツール：**ティアリスト**と**強度 × 使いやすさの2軸チャート**を作成できます。純粋な vanilla JavaScript で、ビルドもバックエンドも不要。全アセットがローカルのため、`file://` で直接開いても完全に動作します。

UIは「グラファイトブラック × ネオンライム」の ZZZ ネイティブデザインで、4言語（繁體中文／English／日本語／한국어）に対応。UI文字もキャラ名も即座に切り替わります。

## はじめに

**オンライン（GitHub Pages）**

1. `Settings → Pages` を開く
2. Source を `Deploy from a branch`、Branch を `main` / `(root)` に設定
3. `https://anku0910.github.io/zzz-tierlist/` にアクセス

**ローカル**

```bash
git clone https://github.com/anku0910/zzz-tierlist.git
cd zzz-tierlist
python -m http.server 8000
# http://127.0.0.1:8000/ を開く
```

`index.html` を直接開いても動作します（`file://` 対応）。

## 機能

- **ティアリスト**：ドラッグ／クリックで配置、ダブルクリックでプールへ戻す、ティア名と色の編集、「職業表示」フィルター（表示のみでデータに影響なし）
- **2軸チャート**：クリック／ドラッグで配置、ドットのドラッグ、重なったドットはダブルクリックで循環選択、**矢印キー／WASD での微調整**（Shift で高速）、Y/X 軸名編集、「職業表示」フィルター、PNG エクスポート（canvas 手描き）
- **配置状態の分離**：ティアリストとチャートの配置は互いに影響しません
- **キャラライブラリ**（右サイドバー共通）：検索（**各言語のキャラ名に対応**）、14陣営ロゴフィルター、職業／属性／並べ替え、「特殊」属性カテゴリ
- **3つの画像モード**：立ち絵／ちびキャラ／アバター（Inter-Knot アイコン）。カード右クリックで個別切替
- **特殊属性バッジ**：流明／凜刃／烈霜／玄墨 のキャラに専用バッジとドットを表示
- **多言語**：繁體中文／English／日本語／한국어、言語の自動検出と即時切替
- **エクスポート**：ティアリスト PNG（html2canvas ＋ canvas フォールバック）、チャート PNG、共有リンク、JSON 入出力、プレビュー
- **チュートリアル**：初回訪問時に自動表示、いつでも再表示可能
- **パーソナライズ**：初回に名前を尋ね、デフォルトタイトルを自動生成
- **永続化**：localStorage `zzz-tierlist-v2`、旧データは自動移行

## プロジェクト構成

| ファイル | 説明 |
|---|---|
| `index.html` | シェル：ヘッダー ＋ ビュー切替 ＋ main／sidebar |
| `styles.css` | デザインシステム（グラファイトブラック × ネオンライム） |
| `i18n.js` | 4言語辞書 ＋ `data-i18n` バインド ＋ `i18n:change` イベント |
| `app.js` | 状態／フィルター／ドラッグ＆ドロップ／エクスポート／チュートリアル |
| `chart.js` | 2軸チャートモジュール（DOM パーセントドット） |
| `data.js` | 63キャラデータ ＋ `AGENT_NAMES` 多言語名 ＋ 陣営／属性カラーパレット |
| `assets/zzz/` | 立ち絵／ちびキャラ／アバター／ステッカー予備／14陣営ロゴ（全ローカル） |
| `tools/` | アセット取得・自動検証スクリプト（開発用） |

## データモデル（data.js）

- `AGENTS` レコード：`id / name / fullName / faction / role / attribute / specialAttribute / rank / img / imgSquare / imgRound / imgProfile / available`
- `faction` は文字列または**配列**（複数陣営：零号アンビ＝狡兎屋＋オボルス小隊）
- `AGENT_NAMES`：en／ja／ko 表示名マップ（`I18N.agentName()` は zh-TW では `name` を直接使用）
- `FACTIONS`（14）と `ROLE_COLORS`／`ATTRIBUTE_COLORS`／`FACTION_LOGOS`／`FACTION_COLORS` パレット

## 多言語対応

- ヘッダーのセレクトで切替。選択は `localStorage` に保存され、未選択時はブラウザ言語を自動検出
- 静的文字列：`data-i18n` 属性（`-html`／`-placeholder`／`-title` バリエーション対応）を `applyStatic()` が翻訳
- 動的コンテンツ：`setLocale()` が `i18n:change` イベントを発火し、`app.js` がライブラリ・ティアカード・チャートを再描画

## アセットパイプライン（開発）

```bash
python tools/fetch_zzz_assets.py --dry-run   # 取得計画の確認（書き込みなし）
python tools/fetch_zzz_assets.py             # 取得＋ assets/zzz/ へ配置
```

ソースは Fandom の `api.php` エンドポイント（Cloudflare に 403 される `/wiki/*` HTML は不使用）。スロットリングとリトライは内蔵。**実行時は完全オフライン** — サイトは Fandom に依存しません。

## 開発と検証

```bash
pip install playwright && playwright install msedge
python tools/verify_theweb.py   # 51項目の自動チェック、スクリーンショットは _verify/ へ
```

## デザインシステム

- グラファイトブラック `#0a0a0c`、パネル3階調 `#131316 / #1a1a1f / #222228`、アクセントはネオンライム `#d4ff3f` のみ
- 真円要素（ランクバッジ・チャートドット・アバター・ステータスドット）以外は角丸ゼロ。clip-path の斜めカットはエクスポート領域の外のみ
- PNG エクスポート領域は hex/rgba のみ（html2canvas 互換）。テーマ色変更時は `app.js` と `chart.js` の描画も同期が必要

## ライセンス

[MIT](../LICENSE) © 2026 anku0910
