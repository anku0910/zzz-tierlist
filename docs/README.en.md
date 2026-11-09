<div align="center">

# ZZZ Tier List Maker

**Zenless Zone Zero tier list × 2-axis chart tool — pure frontend, zero build, fully offline**

[![Platform](https://img.shields.io/badge/Platform-Web_2026-0a0a0c?style=flat-square&labelColor=0a0a0c&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://github.com/anku0910/zzz-tierlist)
[![Build](https://img.shields.io/badge/Build-None_Needed-d4ff3f?style=flat-square&labelColor=0a0a0c)](https://github.com/anku0910/zzz-tierlist)
[![Runtime](https://img.shields.io/badge/Runtime-100%25_Offline-4c1?style=flat-square)](https://github.com/anku0910/zzz-tierlist)
[![i18n](https://img.shields.io/badge/i18n-zh--TW_·_en_·_ja_·_ko-4a90d9?style=flat-square)](#internationalization)
[![License](https://img.shields.io/github/license/anku0910/zzz-tierlist?style=flat-square)](../LICENSE)
[![Stars](https://img.shields.io/github/stars/anku0910/zzz-tierlist?style=flat-square&color=d4ff3f)](https://github.com/anku0910/zzz-tierlist/stargazers)
[![PRs](https://img.shields.io/badge/PRs-Welcome-ff4655?style=flat-square)](https://github.com/anku0910/zzz-tierlist/pulls)

[繁體中文](../README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

</div>

---

## Introduction

A community tool for Zenless Zone Zero: build **tier lists** and **strength × ease-of-use 2-axis charts**. Pure vanilla JavaScript — no build step, no backend, all assets local. It works fully offline, even opened directly via `file://`.

The UI follows a "graphite black × neon lime" ZZZ-native design and supports four languages (Traditional Chinese / English / 日本語 / 한국어); both UI strings and agent names switch instantly.

## Player's Guide

**Roster coverage**

- **63 agents** at launch (unreleased ones shown grayscale), **14 official factions**, 7 roles (Attack / Stun / Anomaly / Support / Defense / Rupture / Vanguard), 7 attributes + 4 special attributes (Lumen / Rime / Frost / Ink)
- Roles, attributes, and rarity are hand-verified (rarity cross-checked against Fandom); data corrections are welcome via PRs to `data.js`

**Controls cheat sheet**

| Action | Tier list | 2-axis chart |
|---|---|---|
| Place | Drag into a tier / click to quick-place | Pick an agent, click the board / drag in |
| Return | Double-click card / drag back to library | "Remove from chart" |
| Fine-tune | — | Arrow keys or `W A S D` (`Shift` = 5× step) |
| Overlap pick | — | Double-click to cycle |
| Z-order | — | "Bring to front" |
| Image mode | Right-click card: Portrait / Chibi / Avatar | — |

**Publishing workflow (Discord / Reddit / forums)**

1. **Narrow the pool** — filter by faction logo or "show role" to focus on what you're ranking
2. **Sweep fast** — sort by rarity/attribute; place S-ranks first, fill in A-ranks
3. **2-axis positioning** — switch to the chart, plot Strength × Ease of Use; axis labels are customizable (e.g. "Shiyu DPS / Newbie-friendly")
4. **Export** — PNG at 2× scale with composited dark background, ready to paste with no post-editing
5. **Share** — the share link carries the full board state; JSON export keeps a version snapshot

## Features

- **Tier list**: drag/click to place agents, double-click to return to the library, editable tier labels and colors, "show role" display filter (display only — never touches data)
- **2-axis chart**: click or drag to place, drag dots, double-click overlapping dots to cycle, **arrow keys / WASD nudging** (Shift for speed), editable Y/X axis labels, "show role" filter, PNG export (hand-drawn canvas)
- **Independent placements**: tier list and chart don't affect each other's pools
- **Agent library** (shared sidebar): search (**localized names included**), 14 faction logo filters, role/attribute/sort, "special" attribute category
- **Three image modes**: portrait / chibi / avatar (Inter-Knot message icons); right-click a card to switch individually
- **Special attribute badges**: Lumen / Rime / Frost / Ink agents show dedicated badges and dots
- **i18n**: zh-TW / English / 日本語 / 한국어 with instant switching (browser language auto-detect)
- **Export**: tier list PNG (html2canvas + canvas fallback), chart PNG, share link, JSON import/export, preview export
- **Tutorial**: shown on first visit, reopenable anytime
- **Personalization**: asks your name once and builds the default title from it
- **Persistence**: localStorage `zzz-tierlist-v2` with automatic migration of older saves

## Project Layout

| File | Purpose |
|---|---|
| `index.html` | Shell: header + view tabs + main/sidebar |
| `styles.css` | Design system (graphite black × neon lime) |
| `i18n.js` | 4-locale dictionary + `data-i18n` binding + `i18n:change` event |
| `app.js` | State / filters / drag & drop / export / tutorial |
| `chart.js` | 2-axis chart module (DOM percentage dots) |
| `data.js` | 63 agents + `AGENT_NAMES` localized names + faction/attribute palettes |
| `assets/zzz/` | Portraits / chibi / avatars / sticker fallback / 14 faction logos (all local) |
| `tools/` | Asset scraping and automated verification scripts (dev only) |

## Data Model (data.js)

- `AGENTS` records: `id / name / fullName / faction / role / attribute / specialAttribute / rank / img / imgSquare / imgRound / imgProfile / available`
- `faction` may be a string or an **array** (dual faction: Soldier 0 Anby = Cunning Hares + Obol Squad)
- `AGENT_NAMES`: en/ja/ko display names (`I18N.agentName()` uses `name` directly for zh-TW)
- `FACTIONS` (14) plus `ROLE_COLORS` / `ATTRIBUTE_COLORS` / `FACTION_LOGOS` / `FACTION_COLORS` palettes

## Internationalization

- Switch via the header dropdown; `localStorage` remembers the choice, otherwise browser language is detected
- Static strings: `data-i18n` attributes (with `-html` / `-placeholder` / `-title` variants) translated by `applyStatic()`
- Dynamic content: `setLocale()` dispatches an `i18n:change` event; `app.js` re-renders the library, tier cards, and chart

## Asset Pipeline (dev)

```bash
python tools/fetch_zzz_assets.py --dry-run   # Preview the fetch plan (no writes)
python tools/fetch_zzz_assets.py             # Fetch + deploy into assets/zzz/
```

Sources use the Fandom `api.php` endpoint (not `/wiki/*` HTML, which Cloudflare blocks with 403); throttling and retries are built in. **The runtime is fully offline** — the site never depends on Fandom.

## Development & Verification

```bash
pip install playwright && playwright install msedge
python tools/verify_theweb.py   # 51 automated checks, screenshots in _verify/
```

## Design System Notes

- Graphite black `#0a0a0c`, three panel shades `#131316 / #1a1a1f / #222228`, single accent neon lime `#d4ff3f`
- Zero border radius everywhere except true circles (rank badges, chart dots, avatars, status dot); clip-path bevels only outside export areas
- Export areas use hex/rgba only (html2canvas compatible); theme color changes must be mirrored in `app.js` and `chart.js` export drawing

## License

[MIT](../LICENSE) © 2026 anku0910
