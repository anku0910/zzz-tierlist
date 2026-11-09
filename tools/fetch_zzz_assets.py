"""Assemble TheWeb ZZZ assets: Fandom agent art, local stickers and faction logos.

Usage:
    python tools/fetch_zzz_assets.py --dry-run
    python tools/fetch_zzz_assets.py
    python tools/fetch_zzz_assets.py --force
"""

from __future__ import annotations

import argparse
import json
import random
import re
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT
OUT = ROOT / "zzz_assets"
SQUARE_DIR = OUT / "square"
ROUND_DIR = OUT / "round"
STICKER_DIR = OUT / "sticker"
LOGO_DIR = OUT / "faction-logos"
PROFILES_DIR = OUT / "profiles"
DATA_JS = WEB / "data.js"
MANIFEST = OUT / "manifest.json"
DEPLOY = (
    (SQUARE_DIR, WEB / "assets" / "zzz" / "agents-square"),
    (ROUND_DIR, WEB / "assets" / "zzz" / "agents-round"),
    (STICKER_DIR, WEB / "assets" / "zzz" / "named-characters"),
    (LOGO_DIR, WEB / "assets" / "zzz" / "named-faction-logos"),
    (PROFILES_DIR, WEB / "assets" / "zzz" / "profiles"),
)

API = "https://zenless-zone-zero.fandom.com/api.php"
ROSTER_URL = "https://skowt.cc/games/zenless-zone-zero/roster"
STICKER_SRC = ROOT.parent / "zzz-tier-list-maker_files"
REFERER = "https://zenless-zone-zero.fandom.com/"

NON_PC = frozenset({"belle", "wise"})
NAME_OVERRIDES = {"orphie-magus": "Orphie Magnusson & Magus", "sunbringer": "Sunbringer"}
STICKER_ALIASES = {"orphie-magus": "orphie-and-magus"}

UA_POOL = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
)


def headers(referer: str = REFERER) -> dict:
    return {
        "User-Agent": random.choice(UA_POOL),
        "Accept": "application/json,text/html,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": referer,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Connection": "keep-alive",
    }


def jitter(low: float = 0.4, high: float = 1.2) -> None:
    time.sleep(random.uniform(low, high))


def api(params: dict, tries: int = 3) -> dict | None:
    for attempt in range(tries):
        try:
            resp = requests.get(API, params={**params, "format": "json"}, headers=headers(), timeout=45)
            if resp.status_code == 200:
                return resp.json()
        except requests.RequestException as exc:
            print(f"      ! api error {type(exc).__name__}")
        if attempt < tries - 1:
            time.sleep(1.5 * (attempt + 1) + random.random())
    return None


def all_images(prefix: str) -> dict:
    files: dict[str, dict] = {}
    cont = None
    while True:
        params = {
            "action": "query",
            "list": "allimages",
            "aiprefix": prefix,
            "ailimit": "500",
            "aiprop": "url|size",
        }
        if cont:
            params["aicontinue"] = cont
        payload = api(params)
        if not payload:
            break
        for item in payload.get("query", {}).get("allimages", []):
            files[item["name"]] = item
        cont = payload.get("continue", {}).get("aicontinue")
        if not cont:
            break
    return files


def build_index() -> tuple[dict, dict, dict]:
    square: dict[str, dict] = {}
    circle: dict[str, dict] = {}
    avatar: dict[str, dict] = {}
    for name, item in all_images("Agent_").items():
        match = re.match(r"^Agent_(.+?)(_Circle)?_Icon\.png$", name)
        if not match:
            continue
        key = match.group(1).replace("_", " ")
        (circle if match.group(2) else square)[key] = item
    for name, item in all_images("Avatar_").items():
        if name.endswith(".png"):
            avatar[name[len("Avatar_") : -4].replace("_", " ")] = item
    return square, circle, avatar


def roster_names() -> dict:
    for _ in range(3):
        try:
            resp = requests.get(ROSTER_URL, headers=headers("https://skowt.cc/"), timeout=45)
            names: dict[str, str] = {}
            soup = BeautifulSoup(resp.text, "html.parser")
            for link in soup.select('a[href*="/zenless-zone-zero/roster/"]'):
                slug = link["href"].rstrip("/").split("/")[-1]
                text = " ".join(link.get_text(" ", strip=True).split())
                if text and slug != "roster":
                    names[slug] = text
            if names:
                return names
        except requests.RequestException:
            pass
        time.sleep(2)
    return {}


def short_to_full() -> dict:
    payload = api({"action": "parse", "page": "Avatar", "prop": "wikitext"})
    if not payload:
        return {}
    wikitext = payload["parse"]["wikitext"]["*"]
    mapping: dict[str, str] = {}
    for full, short in re.findall(r"\{\{Avatar\|([^|}]+)\|text=([^|}]+)\|link=1\}\}", wikitext):
        mapping[re.sub(r"<[^>]+>", "", short).strip().lower()] = full.strip()
    for full in re.findall(r"\{\{Avatar\|([^|}]+)\|link=1\}\}", wikitext):
        mapping.setdefault(full.strip().lower(), full.strip())
    return mapping


def resolve(agent_id: str, short: str | None, aliases: dict, pools: tuple) -> str | None:
    if agent_id in NAME_OVERRIDES:
        return NAME_OVERRIDES[agent_id]
    if not short:
        return None
    key = short.lower()
    if key in aliases:
        return aliases[key]
    for pool in pools:
        starts = sorted((n for n in pool if n.lower().startswith(key)), key=len)
        if starts:
            return starts[0]
        inside = sorted((n for n in pool if key.startswith(n.lower())), key=len)
        if inside:
            return inside[0]
    return None


def agent_ids() -> list[str]:
    text = DATA_JS.read_text(encoding="utf-8")
    block = text.split("const AGENTS", 1)[-1].split("];", 1)[0]
    return re.findall(r'id: "([^"]+)"', block)


def faction_slugs() -> list[str]:
    text = DATA_JS.read_text(encoding="utf-8")
    block = text.split("FACTION_LOGOS", 1)[-1].split("};", 1)[0]
    return re.findall(r"assets/zzz/named-faction-logos/([^\"]+)\.webp", block)


FACTION_LOGO_FILES = {
    "roscalifa": "Faction_Roscaelifer_Icon.png",
}


def _faction_slug(name: str) -> str:
    stem = re.sub(r"^Faction_|(_Icon)?\.png$|\.gif$", "", name)
    return stem.lower().replace("_", "-")


def fetch_faction_logos(slugs: list[str], force: bool) -> tuple[int, list[str]]:
    """Download missing faction logos from the Fandom Faction_ icon index."""
    index = all_images("Faction_")
    fetched, failed = 0, []
    for slug in slugs:
        if (LOGO_DIR / f"{slug}.webp").exists() and not force:
            continue
        item = FACTION_LOGO_FILES.get(slug)
        if item is None:
            item = next((n for n in index if _faction_slug(n) == slug), None)
        if item is None or item not in index:
            failed.append(slug)
            jitter()
            continue
        state, dest, _ = download(index[item]["url"], LOGO_DIR, slug, force)
        if state == "fail" or dest is None:
            failed.append(slug)
        else:
            if dest.suffix != ".webp":
                dest.replace(dest.with_suffix(".webp"))
            fetched += 1
        jitter()
    return fetched, failed


PROFILE_FILES = {
    "alice": "Alice_Thymefield",
    "anby": "Anby_Demara",
    "anton": "Anton_Ivanov",
    "aria": "Aria",
    "astra-yao": "Astra_Yao",
    "ben": "Ben_Bigger",
    "billy": "Billy_Kid",
    "burnice": "Burnice_White",
    "caesar": "Caesar_King",
    "cissia": "Cissia",
    "claretta": "Claret_Flint",
    "corin": "Corin_Wickes",
    "dialyn": "Dialyn",
    "ellen": "Ellen_Joe",
    "evelyn": "Evelyn_Chevalier",
    "grace": "Grace_Howard",
    "harumasa": "Asaba_Harumasa",
    "hugo": "Hugo_Vlad",
    "jane": "Jane_Doe",
    "ju-fufu": "Ju_Fufu",
    "koleda": "Koleda_Belobog",
    "lighter": "Lighter",
    "lucia": "Lucia_Elowen",
    "lycaon": "Von_Lycaon",
    "manato": "Komano_Manato",
    "miyabi": "Hoshimi_Miyabi",
    "nangong-yu": "Nangong_Yu",
    "nekomata": "Nekomiya_Mana",
    "nicole": "Nicole_Demara",
    "norma": "Norma_Hollowell",
    "orphie-magus": "Orphie_Magnusson_&_Magus",
    "pan-yinhu": "Pan_Yinhu",
    "piper": "Piper_Wheel",
    "promeia": "Promeia",
    "pulchra": "Pulchra_Fellini",
    "qingyi": "Qingyi",
    "remielle": "Remielle_Dan",
    "rina": "Alexandrina_Sebastiane",
    "roxy": "Roxy_Ifrita_Pryce",
    "seed": "Seed",
    "seth": "Seth_Lowell",
    "sigrid": "Sigrid_de_L'Azur",
    "soldier-11": "Soldier_11",
    "soukaku": "Soukaku",
    "sunna": "Sunna",
    "trigger": "Trigger",
    "verina": "Velina_Airgid",
    "vivian": "Vivian_Banshee",
    "yanagi": "Tsukishiro_Yanagi",
    "ye-shunguang": "Ye_Shunguang",
    "yidhari": "Yidhari_Murphy",
    "yixuan": "Yixuan",
    "yuzuha": "Ukinami_Yuzuha",
    "zhao": "Zhao",
    "zhu-yuan": "Zhu_Yuan",
}


def fetch_profiles(force: bool) -> tuple[int, list[str]]:
    """Download Inter-Knot message avatars (Knock Knock/Media page) for mapped agents."""
    index = all_images("Message_")
    fetched, failed = 0, []
    for agent_id, stem in PROFILE_FILES.items():
        item = index.get(f"Message_{stem}_Icon.png")
        if item is None:
            failed.append(agent_id)
            continue
        state, dest, _ = download(item["url"], PROFILES_DIR, agent_id, force)
        if state == "fail" or dest is None:
            failed.append(agent_id)
        else:
            fetched += 1
        jitter()
    return fetched, failed


SIGNATURES = (
    (b"\x89PNG\r\n\x1a\n", ".png"),
    (b"RIFF", ".webp"),
    (b"\xff\xd8\xff", ".jpg"),
    (b"GIF8", ".gif"),
)


def sniff(data: bytes) -> str | None:
    for signature, extension in SIGNATURES:
        if data.startswith(signature):
            return extension
    return None


def download(url: str, dest_dir: Path, stem: str, force: bool) -> tuple[str, Path | None, int]:
    if dest_dir.exists() and not force:
        for existing in dest_dir.glob(f"{stem}.*"):
            if existing.stat().st_size > 0:
                return "skip", existing, existing.stat().st_size
    for attempt in range(3):
        try:
            jitter()
            resp = requests.get(url, headers=headers(), timeout=30)
            if resp.status_code == 200:
                extension = sniff(resp.content)
                if extension:
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / f"{stem}{extension}"
                    dest.write_bytes(resp.content)
                    return "ok", dest, len(resp.content)
        except requests.RequestException:
            pass
        time.sleep(1.5 * (attempt + 1) + random.random())
    return "fail", None, 0


def agent_slugs() -> dict:
    text = DATA_JS.read_text(encoding="utf-8")
    block = text.split("const AGENTS", 1)[-1].split("];", 1)[0]
    rows = re.findall(r'id: "([^"]+)", name: "[^"]+", faction: "[^"]+", img: "([^"]+)"', block)
    return {agent_id: img.rsplit("/", 1)[-1] for agent_id, img in rows}


def assemble_local(ids: list[str]) -> dict:
    sticker_dir = STICKER_DIR
    logo_dir = LOGO_DIR
    slugs = agent_slugs()
    stickers = 0
    logos = 0
    for agent_id in ids:
        if agent_id in NON_PC:
            continue
        slug = slugs.get(agent_id, f"{agent_id}.webp")
        src = STICKER_SRC / slug
        if src.exists():
            sticker_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, sticker_dir / slug)
            stickers += 1
    for slug in faction_slugs():
        src = STICKER_SRC / f"{slug}.webp"
        if src.exists():
            logo_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, logo_dir / f"{slug}.webp")
            logos += 1
    return {"stickers": stickers, "logos": logos}


def deploy_assets() -> int:
    deployed = 0
    for source, target in DEPLOY:
        if not source.exists():
            continue
        target.mkdir(parents=True, exist_ok=True)
        for item in source.glob("*"):
            shutil.copy2(item, target / item.name)
            deployed += 1
    return deployed


PREVIEW_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0b0d12;color:#e8ecf3;font-family:system-ui,"Segoe UI","Microsoft JhengHei",sans-serif;padding:32px}
header{margin-bottom:28px;border-bottom:1px solid #1e2430;padding-bottom:20px}
h1{font-size:26px;letter-spacing:.02em}
.sub{color:#7e8899;font-size:13px;margin-top:8px}
.stats{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
.stat{background:#141922;border:1px solid #1e2430;border-radius:8px;padding:8px 14px;font-size:12px;color:#9aa6b8}
.stat b{color:#f0d000;font-size:16px;margin-right:6px}
.grp{margin-bottom:40px}
h2{font-size:15px;font-weight:600;margin-bottom:14px;color:#cfd6e2;display:flex;align-items:center;gap:10px}
.cnt{background:#1e2430;color:#7e8899;font-size:11px;padding:2px 8px;border-radius:10px;font-weight:400}
.grid{display:grid;gap:12px}
.sq{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}
.rd{grid-template-columns:repeat(auto-fill,minmax(84px,1fr))}
.st{grid-template-columns:repeat(auto-fill,minmax(72px,1fr))}
.lg{grid-template-columns:repeat(auto-fill,minmax(76px,1fr))}
figure{background:#141922;border:1px solid #1e2430;border-radius:10px;padding:8px;text-align:center;transition:.15s}
figure:hover{border-color:#f0d000;transform:translateY(-2px)}
img{width:100%;aspect-ratio:1;object-fit:contain;background:#0b0d12;border-radius:6px}
.rd img{border-radius:50%}
.st img{border-radius:8px}
.lg img{padding:6px}
figcaption{font-size:10px;color:#7e8899;margin-top:6px;line-height:1.4;word-break:break-all}
figcaption small{color:#4c5666;font-size:9px}
"""


def write_preview(manifest: dict) -> Path:
    agents = manifest["agents"]
    groups = (
        ("方形立繪 (Agent_Icon, 283x307)", "square", "sq"),
        ("官方圓形頭貼 (Avatar, 200x200)", "round", "rd"),
        ("訊息頭貼 (Message_Icon, 128x128)", "profiles", "rd"),
        ("官方貼紙 (本地備援)", "sticker", "st"),
        ("陣營 Logo", "faction-logos", "lg"),
    )
    sections = []
    for title, folder, css in groups:
        files = sorted((OUT / folder).glob("*")) if (OUT / folder).exists() else []
        figures = []
        for item in files:
            label = agents.get(item.stem, {}).get("full_name", item.stem)
            figures.append(
                f'<figure><img src="{folder}/{item.name}" loading="lazy" alt="{label}">'
                f"<figcaption>{item.stem}<br><small>{label}</small></figcaption></figure>"
            )
        sections.append(
            f'<section class="grp"><h2>{title} <span class="cnt">{len(files)}</span></h2>'
            f'<div class="grid {css}">{"".join(figures)}</div></section>'
        )
    counts = {folder: len(list((OUT / folder).glob("*"))) if (OUT / folder).exists() else 0 for _, folder, _ in groups}
    html = (
        '<!DOCTYPE html>\n<html lang="zh-Hant">\n<head>\n<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f"<title>ZZZ Assets 預覽</title>\n<style>{PREVIEW_CSS}</style>\n</head>\n<body>\n<header>\n"
        "<h1>ZZZ Assets 預覽</h1>\n"
        f'<div class="sub">來源：Zenless Zone Zero Fandom wiki (api.php) ＋ 本地 zzz-tier-list-maker　·　{manifest["generated"]}</div>\n'
        '<div class="stats">\n'
        f'<div class="stat"><b>{manifest["count"]}</b>角色</div>\n'
        f'<div class="stat"><b>{counts["square"]}</b>方形立繪</div>\n'
        f'<div class="stat"><b>{counts["round"]}</b>官方頭貼</div>\n'
        f'<div class="stat"><b>{counts["profiles"]}</b>訊息頭貼</div>\n'
        f'<div class="stat"><b>{counts["sticker"]}</b>貼紙</div>\n'
        f'<div class="stat"><b>{counts["faction-logos"]}</b>陣營 Logo</div>\n'
        f'<div class="stat"><b>{len(manifest["errors"])}</b>錯誤</div>\n'
        "</div>\n</header>\n" + "\n".join(sections) + "\n</body>\n</html>\n"
    )
    path = OUT / "preview.html"
    path.write_text(html, encoding="utf-8")
    return path


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch ZZZ agent art and assemble TheWeb assets")
    parser.add_argument("--dry-run", action="store_true", help="print the plan without writing files")
    parser.add_argument("--force", action="store_true", help="re-download files that already exist")
    parser.add_argument("--skip-fandom", action="store_true", help="only assemble local stickers and logos")
    args = parser.parse_args()

    ids = agent_ids()
    targets = [i for i in ids if i not in NON_PC]
    print(f"[1/5] agent ids: {len(ids)} total, {len(targets)} fetchable, excluded={sorted(NON_PC)}")

    if args.skip_fandom:
        result = assemble_local(ids)
        deployed = deploy_assets()
        print(f"[2/2] local copy: stickers={result['stickers']} logos={result['logos']} deployed={deployed}")
        return 0

    print("[2/5] indexing Fandom files ...")
    square, circle, avatar = build_index()
    print(f"      square={len(square)} circle={len(circle)} avatar={len(avatar)}")

    print("[3/5] resolving full names ...")
    names = roster_names()
    aliases = short_to_full()
    print(f"      roster={len(names)} alias_pairs={len(aliases)}")
    if not names:
        print("[BLOCKER] roster name source unavailable; aborting")
        return 2

    plan = []
    missing = []
    for agent_id in targets:
        full = resolve(agent_id, names.get(agent_id), aliases, (square, circle, avatar))
        sq = square.get(full)
        rd = avatar.get(full)
        rd_source = "avatar"
        if rd is None:
            rd = circle.get(full)
            rd_source = "circle-icon"
        if rd is None:
            rd_source = "none"
        if sq is None:
            missing.append({"id": agent_id, "full_name": full, "square": sq is not None, "round": rd is not None})
            continue
        plan.append(
            {
                "id": agent_id,
                "full_name": full,
                "square": sq,
                "round": rd,
                "round_source": rd_source,
            }
        )

    total = sum(p["square"].get("size", 0) + (p["round"] or {}).get("size", 0) for p in plan)
    print(f"      resolved={len(plan)}/{len(targets)} missing={len(missing)} payload={total / 1048576:.2f} MB")

    if args.dry_run:
        for p in plan:
            rd = p["round"]
            rd_txt = f"{rd.get('width')}x{rd.get('height')} ({p['round_source']})" if rd else "none"
            print(
                f"      {p['id']:<16} {p['full_name']:<32} "
                f"sq={p['square'].get('width')}x{p['square'].get('height')} rd={rd_txt}"
            )
        for m in missing:
            print(f"      MISSING {m}")
        print("      dry-run only, nothing written")
        return 0

    print("[4/5] downloading ...")
    errors = []
    agents_manifest = {}
    downloaded = skipped = failed = 0
    for index, p in enumerate(plan, 1):
        sq_state, sq_dest, sq_size = download(p["square"]["url"], SQUARE_DIR, p["id"], args.force)
        if p["round"]:
            rd_state, rd_dest, rd_size = download(p["round"]["url"], ROUND_DIR, p["id"], args.force)
        else:
            rd_state, rd_dest, rd_size = "none", None, 0
        downloaded += (sq_state == "ok") + (rd_state == "ok")
        skipped += (sq_state == "skip") + (rd_state == "skip")
        if "fail" in (sq_state, rd_state):
            failed += 1
            errors.append({"id": p["id"], "square": sq_state, "round": rd_state})
        agents_manifest[p["id"]] = {
            "full_name": p["full_name"],
            "square": {
                "source": p["square"]["name"],
                "path": str(sq_dest.relative_to(ROOT)).replace("\\", "/") if sq_dest else None,
                "bytes": sq_size,
            },
            "round": {
                "source": (p["round"] or {}).get("name"),
                "variant": p["round_source"],
                "path": str(rd_dest.relative_to(ROOT)).replace("\\", "/") if rd_dest else None,
                "bytes": rd_size,
            },
            "sticker": f"zzz_assets/sticker/{STICKER_ALIASES.get(p['id'], p['id'])}.webp",
        }
        if index % 5 == 0 or index == len(plan):
            print(f"      {index}/{len(plan)} ok={downloaded} skip={skipped} fail={failed}", flush=True)

    print("[5/7] fetching missing faction logos ...")
    fetched_logos, failed_logos = fetch_faction_logos(faction_slugs(), args.force)
    print(f"      fetched={fetched_logos} failed={failed_logos}")

    print("[6/7] fetching agent message avatars ...")
    fetched_profiles, failed_profiles = fetch_profiles(args.force)
    print(f"      fetched={fetched_profiles} failed={len(failed_profiles)} {failed_profiles[:8]}")

    print("[7/7] assembling local stickers and logos ...")
    local = assemble_local(ids)
    print(f"      stickers={local['stickers']} logos={local['logos']}")

    print("[6/6] deploying to TheWeb ...")
    deployed = deploy_assets()
    print(f"      deployed={deployed} files")

    manifest = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "api": API,
        "excluded_non_pc": sorted(NON_PC),
        "count": len(agents_manifest),
        "missing": missing,
        "errors": errors,
        "faction_logos": {"fetched": fetched_logos, "failed": failed_logos},
        "profiles": {"fetched": fetched_profiles, "failed": failed_profiles},
        "agents": agents_manifest,
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    preview = write_preview(manifest)
    print(f"      manifest -> {MANIFEST}")
    print(f"      preview  -> {preview}")
    print(f"[done] downloaded={downloaded} skipped={skipped} failed={failed} agents={len(agents_manifest)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
