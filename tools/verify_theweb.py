"""Headless verification for the redesigned TheWeb UI."""
from pathlib import Path

from playwright.sync_api import sync_playwright

WEB = Path(__file__).resolve().parents[1]
OUT = WEB / "_verify"
OUT.mkdir(exist_ok=True)

problems = []


def check(name, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + name + (" :: " + str(detail) if detail and not cond else ""))
    if not cond:
        problems.append(name)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", args=["--allow-file-access-from-files"])
    ctx = browser.new_context(viewport={"width": 1500, "height": 950}, accept_downloads=True)
    page = ctx.new_page()
    page.on("pageerror", lambda e: problems.append("pageerror: " + str(e)))
    page.on("console", lambda m: problems.append("console: " + m.text) if m.type == "error" else None)
    page.goto((WEB / "index.html").as_uri(), wait_until="domcontentloaded")
    page.wait_for_timeout(1800)

    # 0. tutorial auto-opens on first visit (fresh context)
    check("tutorial auto-opens", page.locator(".tutorial-modal").count() == 1)
    page.screenshot(path=OUT / "tutorial-view.png")
    page.wait_for_selector("#tutorial-close", state="visible", timeout=5000)
    page.click("#tutorial-close")
    page.wait_for_timeout(350)

    # 0b. name prompt follows tutorial on first visit
    check("name prompt after tutorial", page.locator(".name-prompt-modal").count() == 1)
    page.screenshot(path=OUT / "name-prompt.png")
    page.click("#name-skip")
    page.wait_for_timeout(350)
    title_val = page.evaluate("document.getElementById('agent-title').value")
    check("neutral default title", title_val == "絕區零排行", title_val)

    # 1. pool excludes belle/wise and is populated
    ids = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("pool excludes belle/wise", "belle" not in ids and "wise" not in ids)
    check("pool populated", len(ids) > 50, len(ids))
    check("sunbringer in pool", "sunbringer" in ids)
    check("sunbringer asset on disk", (WEB / "assets" / "zzz" / "agents-square" / "sunbringer.webp").exists())
    check("14 faction chips", page.locator(".zzz-faction-button").count() == 14)
    check("55 profile assets", len(list((WEB / "assets" / "zzz" / "profiles").glob("*.webp"))) == 55)

    # 1a. dual-faction agent appears under both factions
    page.click(".zzz-faction-button[data-faction='狡兔屋']")
    page.wait_for_timeout(150)
    ids1 = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("soldier-0-anby under 狡兔屋", "soldier-0-anby" in ids1)
    page.click(".zzz-faction-button[data-faction='狡兔屋']")
    page.click(".zzz-faction-button[data-faction='奧波勒斯小隊']")
    page.wait_for_timeout(150)
    ids2 = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("soldier-0-anby under 奧波勒斯小隊", "soldier-0-anby" in ids2)
    page.click(".zzz-faction-button[data-faction='奧波勒斯小隊']")
    page.wait_for_timeout(150)

    # 1b. image modes: profile (頭貼) uses message avatars; special attribute markers
    page.click("button[data-img-mode='profile']")
    page.wait_for_timeout(300)
    prof_src = page.evaluate("document.querySelector('#agent-pool .agent-card[data-id=\"anby\"] img').src")
    check("profile mode uses message avatar", "profiles" in prof_src, prof_src)
    page.click("button[data-img-mode='square']")
    page.wait_for_timeout(200)
    check("special dot on yixuan card", page.evaluate("!!document.querySelector('#agent-pool .agent-card[data-id=\"yixuan\"] .card-special-dot')"))
    deco = page.evaluate("getComputedStyle(document.querySelector('#agent-pool .agent-card[data-id=\"yixuan\"] .card-special')).textDecorationLine")
    check("special chip underlined", deco == "underline", deco)
    page.select_option("#zzz-attribute-select", "特殊")
    page.wait_for_timeout(200)
    sp_ids = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("特殊 attribute filter works", set(sp_ids) == {"miyabi", "yixuan", "ye-shunguang", "remielle"}, sp_ids)
    page.select_option("#zzz-attribute-select", "all")
    page.wait_for_timeout(150)

    # 2. default tier rows
    check("5 default tiers", page.locator(".agent-tier").count() == 5)

    # 3. broken images among loaded ones
    broken = page.evaluate(
        "Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0 && !i.src.startsWith('data:')).map(i => i.src)"
    )
    check("no broken images", len(broken) == 0, broken[:5])

    # 4. pool click adds to first tier
    page.click("#agent-pool .agent-card")
    page.wait_for_timeout(200)
    first_count = page.evaluate("document.querySelector('.agent-dropzone').children.length")
    check("pool click adds to first tier", first_count == 1, first_count)

    # 4a. badge geometry
    rank_radius = page.evaluate("getComputedStyle(document.querySelector('.card-rank')).borderRadius")
    check("rank badge circular", rank_radius == "50%", rank_radius)
    tag_radius = page.evaluate("getComputedStyle(document.querySelector('.card-badge')).borderRadius")
    check("role tag square", tag_radius == "0px", tag_radius)
    inside = page.evaluate("""() => {
      const card = document.querySelector('.agent-dropzone .agent-card');
      const badge = card.querySelector('.card-badge');
      const b = badge.getBoundingClientRect(), c = card.getBoundingClientRect();
      return b.left >= c.left - 1 && b.left <= c.left + 12 && b.top >= c.top - 1 && b.top <= c.top + 14;
    }""")
    check("role tag inside card corner", inside)
    side_w = page.evaluate("document.querySelector('.side-pane').getBoundingClientRect().width")
    check("sidebar width 460px", abs(side_w - 460) < 3, side_w)

    # 4b. dblclick tier card returns it to pool
    pool_before = page.locator("#agent-pool .agent-card").count()
    page.locator(".agent-dropzone .agent-card").first.dblclick()
    page.wait_for_timeout(250)
    check("dblclick returns card to pool",
          page.evaluate("document.querySelector('.agent-dropzone').children.length") == 0
          and page.locator("#agent-pool .agent-card").count() == pool_before + 1)

    # 4c. dragging a tier card onto the pool returns it
    page.click("#agent-pool .agent-card")
    page.wait_for_timeout(200)
    check("card re-added for drag test", page.evaluate("document.querySelector('.agent-dropzone').children.length") == 1)
    page.drag_and_drop(".agent-dropzone .agent-card", "#agent-pool")
    page.wait_for_timeout(250)
    check("drag to pool returns card",
          page.evaluate("document.querySelector('.agent-dropzone').children.length") == 0
          and page.locator("#agent-pool .agent-card").count() == pool_before + 1)

    # 5. switch to chart view
    page.click("button[data-view='chart']")
    page.wait_for_timeout(300)
    check("chart view active", page.evaluate("document.body.dataset.view") == "chart")
    check("chart tools visible", page.locator("#chart-tools").is_visible())

    # 6. pool click arms pending, board click places
    page.click("#agent-pool .agent-card")
    page.wait_for_timeout(150)
    box = page.locator("#chart-board").bounding_box()
    page.mouse.click(box["x"] + box["width"] * 0.3, box["y"] + box["height"] * 0.7)
    page.wait_for_timeout(200)
    check("dot placed on board", page.locator(".chart-dot").count() == 1)
    check("slider enabled after select", not page.locator("#chart-y").is_disabled())
    tools_box = page.locator("#chart-tools").bounding_box()
    board_box = page.locator("#chart-board").bounding_box()
    check("chart tools left of board", tools_box["x"] + tools_box["width"] <= board_box["x"] + 1,
          (tools_box, board_box))

    # 7. drag the dot
    dot = page.locator(".chart-dot").first
    db = dot.bounding_box()
    cx, cy = db["x"] + db["width"] / 2, db["y"] + db["height"] / 2
    page.mouse.move(cx, cy)
    page.mouse.down()
    page.mouse.move(box["x"] + box["width"] * 0.75, box["y"] + box["height"] * 0.25, steps=10)
    page.mouse.up()
    page.wait_for_timeout(200)
    style = page.evaluate("({l: document.querySelector('.chart-dot').style.left, t: document.querySelector('.chart-dot').style.top})")
    check("dot dragged", abs(float(style["l"].rstrip("%")) - 30) > 5, style)

    # 8. slider moves dot: y=80 (strong) => top 20% (near top)
    page.locator("#chart-y").fill("80")
    page.dispatch_event("#chart-y", "input")
    page.wait_for_timeout(150)
    top = page.evaluate("document.querySelector('.chart-dot').style.top")
    check("slider moves dot to top area", float(top.rstrip("%")) < 40, top)

    # 8b. arrow-key nudging
    page.locator(".chart-dot").first.click()
    page.wait_for_timeout(150)

    def point_y():
        return page.evaluate("Object.values(JSON.parse(localStorage.getItem('zzz-tierlist-v2')).chart.points)[0].y")

    y0 = point_y()
    page.keyboard.press("ArrowUp")
    page.wait_for_timeout(150)
    y1 = point_y()
    check("ArrowUp moves dot +1", y1 == min(y0 + 1, 100), (y0, y1))
    page.keyboard.press("Shift+ArrowUp")
    page.wait_for_timeout(150)
    y2 = point_y()
    check("Shift+ArrowUp moves dot +5", y2 == min(y1 + 5, 100), (y1, y2))

    # 8c. chart role view filter
    placed_id = page.evaluate("Object.keys(JSON.parse(localStorage.getItem('zzz-tierlist-v2')).chart.points)[0]")
    dot_role = page.evaluate("id => AGENTS.find(a => a.id === id).role", placed_id)
    other_role = "擊破" if dot_role != "擊破" else "強攻"
    page.select_option("#chart-role-view", dot_role)
    page.wait_for_timeout(200)
    vis = page.evaluate("Array.from(document.querySelectorAll('.chart-dot')).filter(d => d.offsetParent !== null).length")
    check("chart role view keeps matching dot", vis == 1, vis)
    page.select_option("#chart-role-view", other_role)
    page.wait_for_timeout(200)
    vis2 = page.evaluate("Array.from(document.querySelectorAll('.chart-dot')).filter(d => d.offsetParent !== null).length")
    check("chart role view hides non-matching dot", vis2 == 0, vis2)
    page.select_option("#chart-role-view", "all")
    page.wait_for_timeout(150)

    # 8d. view-separated pools
    chart_pool = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("chart-placed agent absent from chart pool", placed_id not in chart_pool)
    page.click("button[data-view='tier']")
    page.wait_for_timeout(250)
    tier_pool = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("chart-placed agent present in tier pool", placed_id in tier_pool)
    page.evaluate("pid => { const card = Array.from(document.querySelectorAll('#agent-pool .agent-card')).find(c => c.dataset.id !== pid); card.click(); }", placed_id)
    page.wait_for_timeout(250)
    tier_placed = page.evaluate("document.querySelector('.agent-dropzone .agent-card').dataset.id")
    check("tier pick differs from chart-placed agent", tier_placed != placed_id)
    tpool2 = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("tier pool shrinks after tier placement", tier_placed not in tpool2)
    t_role = page.evaluate("id => AGENTS.find(a => a.id === id).role", tier_placed)
    t_other = "擊破" if t_role != "擊破" else "強攻"
    page.select_option("#tier-role-view", t_role)
    page.wait_for_timeout(200)
    tv = page.evaluate("Array.from(document.querySelectorAll('#agent-board .agent-card')).filter(c => c.offsetParent !== null).length")
    check("tier role view keeps placed card", tv == 1, tv)
    page.select_option("#tier-role-view", t_other)
    page.wait_for_timeout(200)
    tv2 = page.evaluate("Array.from(document.querySelectorAll('#agent-board .agent-card')).filter(c => c.offsetParent !== null).length")
    check("tier role view hides non-matching", tv2 == 0, tv2)
    page.select_option("#tier-role-view", "all")
    page.wait_for_timeout(150)
    page.click("button[data-view='chart']")
    page.wait_for_timeout(250)
    cpool3 = page.evaluate("Array.from(document.querySelectorAll('#agent-pool .agent-card')).map(c => c.dataset.id)")
    check("tier-placed agent available in chart pool", tier_placed in cpool3)
    page.click("button[data-view='tier']")
    page.wait_for_timeout(200)
    page.locator(".agent-dropzone .agent-card").first.dblclick()
    page.wait_for_timeout(250)
    check("tier board cleared for later checks", page.evaluate("document.querySelectorAll('.agent-dropzone .agent-card').length") == 0)
    page.click("button[data-view='chart']")
    page.wait_for_timeout(250)

    # 9. chart PNG export
    with page.expect_download(timeout=30000) as dl:
        page.click("#chart-export-png-btn")
    dl.value.save_as(OUT / "chart-export.png")
    check("chart PNG downloaded", (OUT / "chart-export.png").stat().st_size > 20000)

    # 10. back to tier view, tier PNG export
    page.click("button[data-view='tier']")
    page.wait_for_timeout(200)
    with page.expect_download(timeout=30000) as dl2:
        page.click("#agent-download")
    dl2.value.save_as(OUT / "tier-export.png")
    check("tier PNG downloaded", (OUT / "tier-export.png").stat().st_size > 20000)

    # 11. persistence after reload (re-add a card so tier state is non-empty)
    page.click("#agent-pool .agent-card")
    page.wait_for_timeout(200)
    page.reload(wait_until="domcontentloaded")
    page.wait_for_timeout(1200)
    check("chart point persisted", page.evaluate("Object.keys(JSON.parse(localStorage.getItem('zzz-tierlist-v2')).chart.points).length") >= 1)
    check("tier placement persisted", page.evaluate("document.querySelector('.agent-dropzone').children.length") == 1)
    check("tutorial not reopened after reload", page.locator(".tutorial-modal").count() == 0)
    check("name prompt not reopened after reload", page.locator(".name-prompt-modal").count() == 0)

    # 12. screenshots
    page.screenshot(path=OUT / "tier-view.png")
    page.click("button[data-view='chart']")
    page.wait_for_timeout(300)
    page.screenshot(path=OUT / "chart-view.png")

    # 13. narrow viewport smoke shot (fresh state)
    ctx2 = browser.new_context(viewport={"width": 1150, "height": 900})
    page2 = ctx2.new_page()
    page2.goto((WEB / "index.html").as_uri(), wait_until="domcontentloaded")
    page2.wait_for_timeout(1200)
    if page2.locator("#tutorial-close").count():
        page2.click("#tutorial-close")
        page2.wait_for_timeout(350)
    page2.screenshot(path=OUT / "narrow-view.png")
    ctx2.close()

    browser.close()

print("---")
if problems:
    print("PROBLEMS:")
    for pr in problems:
        print("  -", pr)
    raise SystemExit(1)
print("ALL CHECKS PASSED")
