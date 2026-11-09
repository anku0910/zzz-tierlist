(function() {
  'use strict';

  const STORAGE_KEY = 'zzz-tierlist-v2';
  const LEGACY_KEY = 'zzz-tierlist';
  const USER_NAME_KEY = 'zzz-user-name';
const I18N = window.I18N;

  const state = {
    title: "",
    tiers: [],
    pool: [],
    searchQuery: "",
    selectedFactions: new Set(),
    roleFilter: "all",
    attributeFilter: "all",
    poolSort: "default",
    femaleStatCat: "height",
    showNames: true,
    imgMode: "square",
    imgOverride: {},
    tierRoleView: "all",
    chartRoleView: "all",
    nextTierColorIndex: 0,
    view: "tier",
    chart: {
      axisX: "易用度",
      axisY: "強度",
      selected: null,
      nextZ: 1,
      points: {}
    },
  };

  const IMG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect fill=%22%23222228%22 width=%2264%22 height=%2264%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%236e6e78%22 font-size=%2210%22%3E%3F%3C/text%3E%3C/svg%3E";

  const elements = {};

  function cacheElements() {
    elements.titleInput = document.getElementById('agent-title');
    elements.saveStatus = document.getElementById('agent-save-status');
    elements.rankedCount = document.getElementById('agent-ranked');
    elements.board = document.getElementById('agent-board');
    elements.pool = document.getElementById('agent-pool');
    elements.libraryCount = document.getElementById('agent-library-count');
    elements.visibleCount = document.getElementById('agent-visible-count');
    elements.searchInput = document.getElementById('agent-search');
    elements.factionFilters = document.getElementById('zzz-faction-filters');
    elements.roleSelect = document.getElementById('zzz-role-select');
    elements.attributeSelect = document.getElementById('zzz-attribute-select');

    elements.toggleNames = document.getElementById('agent-toggle-names');
    elements.imageModeSwitch = document.getElementById('image-mode-switch');
    elements.exportBtn = document.getElementById('rankly-export');
    elements.importBtn = document.getElementById('rankly-import');
    elements.importFile = document.getElementById('rankly-import-file');
    elements.maker = document.getElementById('agent-maker');
    elements.addTierBtn = document.getElementById('agent-add-tier');
    elements.resetFiltersBtn = document.getElementById('agent-reset-filters');
    elements.resetBtn = document.getElementById('agent-reset');
    elements.downloadBtn = document.getElementById('agent-download');
    elements.communityShareBtn = document.getElementById('rankly-community-share');
    elements.shareBtn = document.getElementById('rankly-share');
    elements.previewBtn = document.getElementById('rankly-preview');
    elements.shareMenuBtn = document.getElementById('share-menu-btn');
    elements.shareMenu = document.getElementById('share-menu');
    elements.toast = document.getElementById('toast');
    elements.chartBoard = document.getElementById('chart-board');
    elements.chartTools = document.getElementById('chart-tools');
    elements.chartSelectedName = document.getElementById('chart-selected-name');
    elements.chartY = document.getElementById('chart-y');
    elements.chartX = document.getElementById('chart-x');
    elements.chartYv = document.getElementById('chart-yv');
    elements.chartXv = document.getElementById('chart-xv');
    elements.chartFront = document.getElementById('chart-front');
    elements.chartRemove = document.getElementById('chart-remove');
    elements.chartAxisY = document.getElementById('chart-axis-y');
    elements.chartAxisX = document.getElementById('chart-axis-x');
    elements.chartAxisYLabel = document.getElementById('chart-axis-y-label');
    elements.chartAxisXLabel = document.getElementById('chart-axis-x-label');
    elements.chartRoster = document.getElementById('chart-roster');
    elements.chartCount = document.getElementById('chart-count');
    elements.chartExportPngBtn = document.getElementById('chart-export-png-btn');
    elements.tierRoleView = document.getElementById('tier-role-view');
    elements.chartRoleView = document.getElementById('chart-role-view');
    elements.tutorialBtn = document.getElementById('agent-tutorial');
  }

  function init() {
    cacheElements();
    I18N.detectAndSetLocale();
    loadState();
    renderFactionFilters();
    renderRoleSelect();
    renderAttributeSelect();
    renderRoleViewSelects();
    renderSortSelect();
    applyImageMode();
    applyNameVisibility();
    renderTiers();
    renderPool();
    updateCounts();
    attachEvents();
    initChart();
    // Re-render all dynamic content when locale changes (i18n.js is a separate IIFE)
    document.addEventListener('i18n:change', () => {
      renderFactionFilters();
      renderRoleSelect();
      renderAttributeSelect();
      renderRoleViewSelects();
      renderSortSelect();
      renderTierCards();
      renderPool();
      updateCounts();
      syncChartTools();
      if (typeof ZZZChart !== 'undefined' && ZZZChart && typeof ZZZChart.render === 'function') ZZZChart.render();
      updateSaveStatus();
    });
    setView(state.view === 'chart' ? 'chart' : 'tier', true);
    updateSaveStatus();
    maybeShowTutorial();
  }

  /* ---------- state persistence ---------- */

  function defaultChart() {
    return { axisX: I18N.t("chart.axis.x.default"), axisY: I18N.t("chart.axis.y.default"), selected: null, nextZ: 1, points: {} };
  }

  function userName() {
    try { return localStorage.getItem(USER_NAME_KEY) || ""; } catch (e) { return ""; }
  }

  function defaultTitle() {
    const name = userName();
    return name ? I18N.t("app.defaultTitle", {name: name}) : I18N.t("app.defaultTitle.default");
  }

  function readSharedState() {
    const encoded = new URLSearchParams(location.search).get('data');
    if (!encoded) return null;
    try {
      return decodeURIComponent(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) {
      console.warn('Unreadable share link', e);
      return null;
    }
  }

  function loadState() {
    const shared = readSharedState();
    try {
      const saved = shared || localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!saved) {
        state.tiers = [...TIER_DEFAULTS];
        state.pool = playableAgents().map(a => a.id);
        state.title = defaultTitle();
        return;
      }
      const data = JSON.parse(saved);
      const knownIds = new Set(AGENTS.map(a => a.id));
      state.title = typeof data.title === 'string' && data.title ? data.title : defaultTitle();
      // Migrate legacy/poisoned default titles (raw i18n keys or old defaults)
      if (state.title === "我的絕區零排行" || state.title === "app.defaultTitle.default" || state.title === "app.defaultTitle") state.title = defaultTitle();
      state.tiers = Array.isArray(data.tiers) && data.tiers.length
        ? data.tiers.map(t => ({
            label: String(t.label || 'T').slice(0, 2),
            color: t.color || '#888888',
            agents: Array.isArray(t.agents) ? t.agents.filter(id => knownIds.has(id)) : [],
          }))
        : [...TIER_DEFAULTS];
      state.pool = Array.isArray(data.pool)
        ? data.pool.filter(id => knownIds.has(id) && !NON_PC_IDS.includes(id))
        : playableAgents().map(a => a.id);
      state.searchQuery = typeof data.searchQuery === 'string' ? data.searchQuery : "";
      state.selectedFactions = new Set(Array.isArray(data.selectedFactions) ? data.selectedFactions : []);
      state.roleFilter = typeof data.roleFilter === 'string' ? data.roleFilter : "all";
      state.attributeFilter = typeof data.attributeFilter === 'string' ? data.attributeFilter : "all";
      const LEGACY_SORT = { name: "name:asc", role: "role:asc", attribute: "attribute:asc", rank: "rank:desc" };
      let legacySort = typeof data.poolSort === 'string' ? data.poolSort : "default";
      if (LEGACY_SORT[legacySort]) legacySort = LEGACY_SORT[legacySort];
      state.poolSort = legacySort;
      state.femaleStatCat = MEASURE_CATS.includes(data.femaleStatCat) ? data.femaleStatCat : "height";
      state.showNames = data.showNames !== false;
      state.imgMode = typeof data.imgMode === 'string' ? data.imgMode : "square";
      state.imgOverride = data.imgOverride && typeof data.imgOverride === 'object' ? data.imgOverride : {};
      state.tierRoleView = typeof data.tierRoleView === 'string' ? data.tierRoleView : "all";
      state.chartRoleView = typeof data.chartRoleView === 'string' ? data.chartRoleView : "all";
      // legacy "sticker" mode was replaced by "profile" (頭貼)
      if (state.imgMode === "sticker") state.imgMode = "profile";
      Object.keys(state.imgOverride).forEach(k => {
        if (state.imgOverride[k] === "sticker") state.imgOverride[k] = "profile";
      });
      state.nextTierColorIndex = Number.isInteger(data.nextTierColorIndex) ? data.nextTierColorIndex : TIER_DEFAULTS.length;
      // v2 chart shape only (legacy grid-chart state is intentionally dropped)
      if (data.chart && typeof data.chart.axisX === 'string' && data.chart.points && typeof data.chart.points === 'object') {
        state.chart = {
          axisX: data.chart.axisX,
          axisY: typeof data.chart.axisY === 'string' ? data.chart.axisY : I18N.t("chart.axis.y.default"),
          selected: null,
          nextZ: Number.isInteger(data.chart.nextZ) ? data.chart.nextZ : 1,
          points: data.chart.points,
        };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
      state.tiers = [...TIER_DEFAULTS];
      state.pool = playableAgents().map(a => a.id);
      state.title = defaultTitle();
    }
    syncControls();
  }

  function playableAgents() {
    return AGENTS.filter(a => !NON_PC_IDS.includes(a.id));
  }

  function syncControls() {
    elements.titleInput.value = state.title;
    elements.searchInput.value = state.searchQuery;
    elements.roleSelect.value = state.roleFilter;
    elements.attributeSelect.value = state.attributeFilter;

    elements.tierRoleView.value = state.tierRoleView;
    elements.chartRoleView.value = state.chartRoleView;
    elements.toggleNames.checked = state.showNames;
    elements.chartAxisX.value = state.chart.axisX;
    elements.chartAxisY.value = state.chart.axisY;
    elements.chartAxisXLabel.textContent = state.chart.axisX;
    elements.chartAxisYLabel.textContent = state.chart.axisY;
    elements.imageModeSwitch.querySelectorAll('[data-img-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.imgMode === state.imgMode);
    });
    document.querySelectorAll('.zzz-faction-button').forEach(btn => {
      btn.classList.toggle('active', state.selectedFactions.has(btn.dataset.faction));
    });
  }

  function saveState() {
    const data = {
      title: state.title,
      tiers: state.tiers,
      pool: state.pool,
      searchQuery: state.searchQuery,
      selectedFactions: Array.from(state.selectedFactions),
      roleFilter: state.roleFilter,
      attributeFilter: state.attributeFilter,
      poolSort: state.poolSort,
      femaleStatCat: state.femaleStatCat,
      showNames: state.showNames,
      imgMode: state.imgMode,
      imgOverride: state.imgOverride,
      tierRoleView: state.tierRoleView,
      chartRoleView: state.chartRoleView,
      nextTierColorIndex: state.nextTierColorIndex,
      view: state.view,
      chart: state.chart,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Save failed', e);
    }
    updateSaveStatus();
  }

  function updateSaveStatus() {
    const now = new Date();
    const loc = (typeof I18N !== 'undefined' && I18N.getLocale()) || 'zh-TW';
    const timeStr = now.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
    elements.saveStatus.textContent = `${I18N.t('app.saved')} · ${timeStr}`;
  }

  /* ---------- filters & library ---------- */

  function renderFactionFilters() {
    elements.factionFilters.innerHTML = FACTIONS.map(faction => `
      <button class="zzz-faction-button" type="button" data-faction="${escapeHtml(faction)}" title="${escapeHtml(faction)}" aria-label="${I18N.t("filter.faction", {faction: escapeHtml(faction)})}">
        <img src="${escapeHtml(FACTION_LOGOS[faction] || '')}" alt="" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <span style="display:none;">${escapeHtml(faction.charAt(0))}</span>
      </button>
    `).join('');
  }

  function renderRoleSelect() {
    const options = '<option value="all" data-i18n="filter.all_roles">全部職業</option>' +
      ROLES.filter(role => AGENTS.some(a => a.role === role))
        .map(role => `<option value="${escapeHtml(role)}" data-i18n="role.${escapeHtml(role)}">${I18N.term("role", escapeHtml(role))}</option>`).join('');
    elements.roleSelect.innerHTML = options;
    elements.roleSelect.value = state.roleFilter;
  }

  function renderAttributeSelect() {
    const options = '<option value="all" data-i18n="filter.all_attrs">全部屬性</option>' +
      ATTRIBUTES.filter(attr => attr === "特殊"
        ? AGENTS.some(a => I18N.term("attr", "特殊").length > 0)
        : AGENTS.some(a => a.attribute === attr))
        .map(attr => `<option value="${escapeHtml(attr)}" data-i18n="attr.${escapeHtml(attr)}">${I18N.term("attr", escapeHtml(attr))}</option>`).join('');
    elements.attributeSelect.innerHTML = options;
    elements.attributeSelect.value = state.attributeFilter;
  }

  function renderRoleViewSelects() {
    const options = '<option value="all" data-i18n="filter.all_roles">全部職業</option>' +
      ROLES.filter(role => AGENTS.some(a => a.role === role))
        .map(role => `<option value="${escapeHtml(role)}" data-i18n="role.${escapeHtml(role)}">${I18N.term("role", escapeHtml(role))}</option>`).join('');
    elements.tierRoleView.innerHTML = options;
    elements.chartRoleView.innerHTML = options;
    elements.tierRoleView.value = state.tierRoleView;
    elements.chartRoleView.value = state.chartRoleView;
  }

  function imgModeFor(agentId) {
    return state.imgOverride[agentId] || state.imgMode;
  }

  function resolveImg(agent) {
    const mode = imgModeFor(agent.id);
    if (mode === "round") return agent.imgRound || agent.img || agent.imgSquare;
    if (mode === "profile") return agent.imgProfile || agent.img || agent.imgSquare || agent.imgRound;
    return agent.imgSquare || agent.img || agent.imgRound;
  }

  function applyImageMode() {
    elements.imageModeSwitch.querySelectorAll('[data-img-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.imgMode === state.imgMode);
    });
  }

  function applyNameVisibility() {
    document.body.classList.toggle('names-hidden', !state.showNames);
  }

  function badgeHtml(color, text, className) {
    if (!text) return '';
    return `<b class="card-badge ${className}" style="--badge:${color || '#6b7280'}">${escapeHtml(text)}</b>`;
  }

  /* ---------- sort options & measurement mode ---------- */

  const EROTIC_KEY = "zzz-erotic-on";
  const MEASURE_CATS = ["height", "bust", "hip", "thigh", "cup"];
  const CUP_ORDER = ["", "A", "B", "C", "D", "DD", "E", "F", "FF", "G", "GG", "H", "HH", "J", "JJ", "K"];

  function eroticOn() {
    try { return localStorage.getItem(EROTIC_KEY) === "1"; } catch (e) { return false; }
  }

  function setEroticOn(on) {
    try {
      if (on) localStorage.setItem(EROTIC_KEY, "1");
      else localStorage.removeItem(EROTIC_KEY);
    } catch (e) { /* noop */ }
  }

  function statsMode() {
    return typeof state.poolSort === "string" && state.poolSort.startsWith("female_stats");
  }

  function cupRank(cup) {
    const idx = CUP_ORDER.indexOf(String(cup || "").replace(/^\d+/, ""));
    return idx === -1 ? CUP_ORDER.length : idx;
  }

  function sortBaseDir() {
    const [base, dir] = String(state.poolSort || "default").split(":");
    return { base: base || "default", dir: dir === "desc" ? "desc" : "asc" };
  }

  function setSort(base, dir) {
    state.poolSort = base === "default" ? "default" : base + ":" + dir;
  }

  function sortItems() {
    const items = [{ value: "default", label: I18N.t("sort.default") }];
    ["name", "role", "attribute", "rank"].forEach(k => items.push({ value: k, label: I18N.t("sort." + k) }));
    if (eroticOn()) items.push({ value: "female_stats", label: I18N.t("sort.female_stats") });
    return items;
  }

  // Single-entry menu: picking the active entry again flips the ↑/↓ direction.
  function cycleHtml(items, current, dir, showArrow) {
    const arrow = dir === "desc" ? "↓" : "↑";
    const cur = items.find(i => i.value === current);
    return `
      <button type="button" class="cycle-trigger" aria-haspopup="listbox" aria-expanded="false">
        <span>${escapeHtml(cur ? cur.label : "")}</span>
        ${showArrow ? `<i class="cycle-arrow">${arrow}</i>` : ""}
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="cycle-menu" role="listbox" hidden>
        ${items.map(i => `<button type="button" role="option" data-value="${i.value}" aria-selected="${i.value === current}">${escapeHtml(i.label)}${i.value === current && showArrow ? ` <i class="cycle-arrow">${arrow}</i>` : ""}</button>`).join("")}
      </div>`;
  }

  function closeCycles() {
    document.querySelectorAll(".cycle-menu").forEach(m => { m.hidden = true; });
    document.querySelectorAll(".cycle-trigger").forEach(t => t.setAttribute("aria-expanded", "false"));
  }

  function bindCycle(host, onPick) {
    if (host.dataset.cycleBound) return;
    host.dataset.cycleBound = "1";
    host.addEventListener("click", e => {
      const opt = e.target.closest(".cycle-menu [data-value]");
      if (opt) { onPick(opt.dataset.value); return; }
      const trigger = e.target.closest(".cycle-trigger");
      if (!trigger) return;
      const menu = host.querySelector(".cycle-menu");
      const wasOpen = !!menu && !menu.hidden;
      closeCycles();
      if (menu && !wasOpen) { menu.hidden = false; trigger.setAttribute("aria-expanded", "true"); }
    });
  }

  function pickSortBase(value) {
    const { base, dir } = sortBaseDir();
    const again = base === value && value !== "default";
    setSort(value, again ? (dir === "asc" ? "desc" : "asc") : "asc");
    closeCycles();
    renderSortSelect();
    renderPool();
    updateCounts();
    saveState();
  }

  function pickCat(value) {
    const { dir } = sortBaseDir();
    if (state.femaleStatCat === value) setSort("female_stats", dir === "asc" ? "desc" : "asc");
    else { state.femaleStatCat = value; setSort("female_stats", "asc"); }
    closeCycles();
    renderSortSelect();
    renderPool();
    updateCounts();
    saveState();
  }

  function renderSortSelect() {
    const host = document.getElementById("sort-cycle");
    if (host) {
      const items = sortItems();
      if (!items.some(i => i.value === sortBaseDir().base)) setSort("default", "asc");
      const { base, dir } = sortBaseDir();
      host.innerHTML = cycleHtml(items, base, dir, base !== "default");
      bindCycle(host, pickSortBase);
    }
    renderSortCat();
    applyStatsMode();
  }

  function renderSortCat() {
    let host = document.getElementById("sort-cat");
    if (!statsMode()) { if (host) host.remove(); return; }
    if (!host) {
      host = document.createElement("div");
      host.id = "sort-cat";
      host.className = "cycle-select";
      const row = document.querySelector(".filter-row");
      (row || document.body).insertAdjacentElement("afterend", host);
      bindCycle(host, pickCat);
    }
    const { dir } = sortBaseDir();
    const items = MEASURE_CATS.map(k => ({ value: k, label: I18N.t("stats.cat." + k) }));
    host.innerHTML = cycleHtml(items, state.femaleStatCat, dir, true);
  }

  function applyStatsMode() {
    document.body.dataset.statsMode = statsMode() ? "on" : "off";
  }

  function statsTipRows(agent) {
    return [
      [I18N.t("stats.cat.height"), agent.height + " cm"],
      [I18N.t("stats.cat.bust"), agent.bust + " cm"],
      [I18N.t("stats.cat.hip"), agent.hip + " cm"],
      [I18N.t("stats.cat.thigh"), agent.thigh != null ? agent.thigh + " cm" : "—"],
      [I18N.t("stats.cat.cup"), agent.cup || "—"],
    ];
  }

  // The tooltip lives on <body>: the pool is a scroll container, so a nested tip gets clipped.
  function ensureStatsTip() {
    let el = document.getElementById("stats-tip");
    if (!el) {
      el = document.createElement("div");
      el.id = "stats-tip";
      el.setAttribute("aria-hidden", "true");
      el.hidden = true;
      document.body.appendChild(el);
    }
    return el;
  }

  function showStatsTip(card) {
    if (!statsMode()) return;
    const agent = AGENTS.find(a => a.id === card.dataset.id);
    if (!agent || typeof agent.height !== "number") return;
    const el = ensureStatsTip();
    el.innerHTML = statsTipRows(agent).map(([k, v]) => `<span><i>${escapeHtml(k)}</i><b>${escapeHtml(String(v))}</b></span>`).join("");
    el.hidden = false;
    const r = card.getBoundingClientRect();
    const tw = el.offsetWidth;
    const th = el.offsetHeight;
    const left = Math.max(8, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 8));
    let top = r.top - th - 10;
    if (top < 8) top = Math.min(r.bottom + 10, window.innerHeight - th - 8);
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function hideStatsTip() {
    const el = document.getElementById("stats-tip");
    if (el) el.hidden = true;
  }

  function cardBadges(agent) {
    const primary = agent.attribute && SPECIAL_ATTRIBUTES.includes(agent.attribute) ? null : agent.attribute;
    const specials = specialAttrsOf(agent);
    return `
          ${badgeHtml(ROLE_COLORS[agent.role], agent.role, 'card-role' + (agent.role === '命破' ? ' card-ink' : ''))}
          ${badgeHtml(primary ? ATTRIBUTE_COLORS[primary] : null, primary, 'card-attr')}
          ${specials.map(s => badgeHtml(ATTRIBUTE_COLORS[s], s, 'card-attr card-special')).join('\n          ')}
    `;
  }

  function cardHtml(agent, extraAttrs) {
    const img = statsMode() && agent.id === "belle" ? "assets/zzz/belle-animated.gif" : (resolveImg(agent) || IMG_FALLBACK);
    return `
      <div class="agent-card" draggable="true" tabindex="0" role="button" data-id="${agent.id}" data-role="${escapeHtml(agent.role || '')}" data-img-mode="${escapeHtml(imgModeFor(agent.id))}"${extraAttrs || ''} title="${escapeHtml(I18N.agentName(agent))} · ${escapeHtml(factionList(agent).join(' / '))}" aria-label="${escapeHtml(I18N.agentName(agent))}">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(I18N.agentName(agent))}" width="128" height="128" loading="lazy" onerror="this.onerror=null; this.src='${IMG_FALLBACK}'">
        <div class="card-badges">${cardBadges(agent)}
        </div>
        ${agent.rank ? `<b class="card-rank" style="--badge:${(RANK_META[agent.rank] || {}).color || '#6b7280'}">${escapeHtml(agent.rank)}</b>` : ''}
        ${specialAttrsOf(agent).length > 0 ? `<i class="card-special-dot" style="--dot:${ATTRIBUTE_COLORS[specialAttrsOf(agent)[0]] || '#f8b5b9'}"></i>` : ''}
        <span><small>${escapeHtml(factionList(agent).join('・'))}</small>${escapeHtml(I18N.agentName(agent))}</span>
      </div>
    `;
  }

  /* ---------- tier board ---------- */

  function renderTiers() {
    elements.board.innerHTML = state.tiers.map((tier, index) => `
      <div class="agent-tier" data-tier-index="${index}" style="--tier:${tier.color}">
        <button class="agent-tier-label" type="button" data-tier-index="${index}" aria-label="編輯 ${escapeHtml(tier.label)} 階級">${escapeHtml(tier.label)}</button>
        <div class="agent-dropzone" data-tier-index="${index}"></div>
        <button class="agent-row-menu" type="button" data-tier-index="${index}" aria-label="編輯階級">…</button>
      </div>
    `).join('');
    attachTierEvents();
    renderTierCards();
    applyTierRoleView();
  }

  function renderTierCards() {
    document.querySelectorAll('.agent-dropzone').forEach(dropzone => {
      const tier = state.tiers[parseInt(dropzone.dataset.tierIndex, 10)];
      if (!tier) return;
      dropzone.innerHTML = (tier.agents || []).map((agentId, agentIndex) => {
        const agent = AGENTS.find(a => a.id === agentId);
        if (!agent) return '';
        return cardHtml(agent, ` data-tier-index="${dropzone.dataset.tierIndex}" data-agent-index="${agentIndex}"`);
      }).join('');
    });
    attachCardEvents();
    applyTierRoleView();
  }

  function getFilteredAgents() {
    return AGENTS.filter(agent => {
      if (statsMode()) {
        if (typeof agent.height !== "number") return false;
      } else if (NON_PC_IDS.includes(agent.id)) return false;
      if (state.selectedFactions.size > 0 && !factionList(agent).some(f => state.selectedFactions.has(f))) return false;
      if (state.roleFilter !== "all" && agent.role !== state.roleFilter) return false;
      if (state.attributeFilter !== "all") {
        if (state.attributeFilter === "特殊") {
          if (specialAttrsOf(agent).length === 0) return false;
        } else if (agent.attribute !== state.attributeFilter && !specialAttrsOf(agent).includes(state.attributeFilter)) {
          return false;
        }
      }
      const query = state.searchQuery.toLowerCase();
      if (query) {
        const haystack = [agent.name, I18N.agentName(agent), agent.fullName, factionList(agent).join(' '), agent.specialAttribute, agent.role, agent.attribute]
          .filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }

  function sortAgents(list) {
    const byName = (a, b) => I18N.agentName(a).localeCompare(I18N.agentName(b));
    const indexOf = (values, value) => {
      const i = values.indexOf(value);
      return i === -1 ? values.length : i;
    };
    const rankOrder = { S: 0, A: 1 };
    const [base, dir] = String(state.poolSort || "default").split(":");
    const asc = dir !== "desc";
    const flip = arr => (asc ? arr : arr.reverse());
    switch (base) {
      case "name":
        return flip(list.slice().sort(byName));
      case "role":
        return flip(list.slice().sort((a, b) => indexOf(ROLES, a.role) - indexOf(ROLES, b.role) || byName(a, b)));
      case "attribute":
        return flip(list.slice().sort((a, b) => indexOf(ATTRIBUTES, a.attribute) - indexOf(ATTRIBUTES, b.attribute) || byName(a, b)));
      case "rank":
        return flip(list.slice().sort((a, b) => (rankOrder[a.rank] ?? 9) - (rankOrder[b.rank] ?? 9) || byName(a, b)));
      case "female_stats": {
        const cat = MEASURE_CATS.includes(state.femaleStatCat) ? state.femaleStatCat : "height";
        const val = a => (cat === "cup" ? cupRank(a.cup) : (typeof a[cat] === "number" ? a[cat] : -1));
        return flip(list.slice().sort((a, b) => (val(a) - val(b)) || byName(a, b)));
      }
      default:
        return list;
    }
  }

  function factionList(agent) {
    if (!agent || !agent.faction) return [];
    return Array.isArray(agent.faction) ? agent.faction : [agent.faction];
  }

  function specialAttrsOf(agent) {
    const list = [];
    if (agent && agent.specialAttribute) list.push(agent.specialAttribute);
    if (agent && SPECIAL_ATTRIBUTES.includes(agent.attribute)) list.push(agent.attribute);
    return list;
  }

  function getPoolAgents() {
    const filtered = getFilteredAgents();
    if (state.view === 'chart') {
      const placed = state.chart.points || {};
      return filtered.filter(a => !placed[a.id]);
    }
    const rankedIds = new Set(state.tiers.flatMap(t => t.agents || []));
    return filtered.filter(a => !rankedIds.has(a.id));
  }

  function applyTierRoleView() {
    const view = state.tierRoleView;
    document.querySelectorAll('#agent-board .agent-card').forEach(card => {
      card.classList.toggle('role-hidden', view !== 'all' && card.dataset.role !== view);
    });
  }

  function renderPool() {
    elements.pool.innerHTML = sortAgents(getPoolAgents()).map(agent => cardHtml(agent, '')).join('');
    attachCardEvents();
    applyTierRoleView();
  }

  function updateCounts() {
    const rankedTotal = state.tiers.reduce((sum, t) => sum + (t.agents?.length || 0), 0);
    const poolAgents = getPoolAgents();
    const filteredTotal = getFilteredAgents().length;
    const chartView = state.view === 'chart';
    elements.rankedCount.textContent = I18N.t('board.ranked', { n: rankedTotal });
    elements.libraryCount.textContent = I18N.t(chartView ? 'sidebar.count.chart' : 'sidebar.count', { n: poolAgents.length });
    elements.visibleCount.textContent = I18N.t('pool.visible', { x: poolAgents.length, y: filteredTotal });
    const poolHead = document.querySelector('.pool-head strong');
    if (poolHead) poolHead.textContent = I18N.t(chartView ? 'pool.head.chart' : 'pool.head.tier');
  }

  /* ---------- events ---------- */

  function attachEvents() {
    elements.titleInput.addEventListener('input', e => {
      state.title = e.target.value.slice(0, 80);
      saveState();
    });

    elements.searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      renderPool();
      updateCounts();
    });

    elements.factionFilters.addEventListener('click', e => {
      const btn = e.target.closest('.zzz-faction-button');
      if (!btn) return;
      const faction = btn.dataset.faction;
      if (state.selectedFactions.has(faction)) state.selectedFactions.delete(faction);
      else state.selectedFactions.add(faction);
      btn.classList.toggle('active', state.selectedFactions.has(faction));
      renderPool();
      updateCounts();
      saveState();
    });

    elements.roleSelect.addEventListener('change', e => {
      state.roleFilter = e.target.value;
      renderPool();
      updateCounts();
      saveState();
    });

    elements.attributeSelect.addEventListener('change', e => {
      state.attributeFilter = e.target.value;
      renderPool();
      updateCounts();
      saveState();
    });

    elements.pool.addEventListener('mouseover', e => {
      const card = e.target.closest ? e.target.closest('.agent-card') : null;
      if (card) showStatsTip(card);
    });
    elements.pool.addEventListener('mouseout', e => {
      const to = e.relatedTarget;
      if (!to || !(to.closest && to.closest('.agent-card'))) hideStatsTip();
    });
    elements.pool.addEventListener('focusin', e => {
      const card = e.target.closest ? e.target.closest('.agent-card') : null;
      if (card) showStatsTip(card);
    });
    elements.pool.addEventListener('focusout', hideStatsTip);
    elements.pool.addEventListener('scroll', hideStatsTip, { passive: true });
    window.addEventListener('scroll', hideStatsTip, true);
    window.addEventListener('resize', hideStatsTip);
    document.addEventListener('click', e => { if (!e.target.closest || !e.target.closest('.cycle-select')) closeCycles(); });

    elements.tierRoleView.addEventListener('change', e => {
      state.tierRoleView = e.target.value;
      applyTierRoleView();
      saveState();
    });

    elements.chartRoleView.addEventListener('change', e => {
      state.chartRoleView = e.target.value;
      ZZZChart.applyRoleView();
      saveState();
    });

    elements.tutorialBtn.addEventListener('click', () => openTutorial());
    const localeSel = document.getElementById('locale-select');
    if (localeSel) {
      localeSel.addEventListener('change', e => { I18N.setLocale(e.target.value); });
    }
    elements.toggleNames.addEventListener('change', e => {
      state.showNames = e.target.checked;
      applyNameVisibility();
      if (state.view === 'chart') ZZZChart.render();
      saveState();
    });

    elements.imageModeSwitch.addEventListener('click', e => {
      const btn = e.target.closest('[data-img-mode]');
      if (!btn) return;
      state.imgMode = btn.dataset.imgMode;
      applyImageMode();
      renderTierCards();
      renderPool();
      saveState();
    });

    elements.tierRoleView.addEventListener('change', e => {
      state.tierRoleView = e.target.value;
      applyTierRoleView();
      saveState();
    });

    elements.chartRoleView.addEventListener('change', e => {
      state.chartRoleView = e.target.value;
      ZZZChart.applyRoleView();
      saveState();
    });

    elements.exportBtn.addEventListener('click', exportJSON);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (file) importJSON(file);
      e.target.value = "";
    });

    elements.shareMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = elements.shareMenu.hidden;
      elements.shareMenu.hidden = !open;
      elements.shareMenuBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!elements.shareMenu.hidden && !e.target.closest('.menu-wrap')) {
        elements.shareMenu.hidden = true;
        elements.shareMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    elements.addTierBtn.addEventListener('click', () => openTierEditor());

    elements.resetFiltersBtn.addEventListener('click', () => {
      state.searchQuery = "";
      state.selectedFactions.clear();
      state.roleFilter = "all";
      state.attributeFilter = "all";
      state.poolSort = "default";
      elements.searchInput.value = "";
      elements.roleSelect.value = "all";
      elements.attributeSelect.value = "all";
      renderSortSelect();
      document.querySelectorAll('.zzz-faction-button').forEach(b => b.classList.remove('active'));
      renderPool();
      updateCounts();
      saveState();
      showToast('已清除所有篩選', 'success');
    });

    elements.resetBtn.addEventListener('click', () => {
      if (!confirm('確定要重新開始嗎？這將清除所有排名與圖表資料。')) return;
      state.tiers = [...TIER_DEFAULTS];
      state.pool = playableAgents().map(a => a.id);
      state.nextTierColorIndex = TIER_DEFAULTS.length;
      state.chart = defaultChart();
      renderTiers();
      renderPool();
      updateCounts();
      ZZZChart.render();
      syncChartTools();
      saveState();
      showToast('已重新開始', 'success');
    });

    elements.downloadBtn.addEventListener('click', () => {
      if (state.view === 'chart') ZZZChart.exportPNG();
      else downloadAsPNG();
    });

    elements.pool.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      elements.pool.classList.add('drag-active');
    });
    elements.pool.addEventListener('dragleave', e => {
      if (!elements.pool.contains(e.relatedTarget)) elements.pool.classList.remove('drag-active');
    });
    elements.pool.addEventListener('drop', e => {
      e.preventDefault();
      elements.pool.classList.remove('drag-active');
      const agentId = e.dataTransfer.getData('text/plain');
      if (!agentId || dragSourceTier === null) return;
      returnToPool(agentId, dragSourceTier, dragSourceIndex);
      dragSourceTier = null;
      dragSourceIndex = null;
    });

    document.addEventListener('keydown', e => {
      if (state.view !== 'chart') return;
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) return;
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return;
      const sel = state.chart.selected;
      if (!sel || !state.chart.points[sel]) return;
      e.preventDefault();
      const step = e.shiftKey ? 5 : 1;
      const code = e.code;
      const dx = code === 'ArrowRight' || code === 'KeyD' ? step : code === 'ArrowLeft' || code === 'KeyA' ? -step : 0;
      const dy = code === 'ArrowUp' || code === 'KeyW' ? step : code === 'ArrowDown' || code === 'KeyS' ? -step : 0;
      ZZZChart.nudge(sel, dx, dy);
    });

    elements.communityShareBtn.addEventListener('click', shareToCommunity);
    elements.shareBtn.addEventListener('click', saveAndShare);
    elements.previewBtn.addEventListener('click', previewExport);

    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.addEventListener('click', () => setView(tab.dataset.view));
    });

    attachChartToolEvents();
  }

  function setView(view, silent) {
    state.view = view;
    document.body.dataset.view = view;
    document.querySelectorAll('.view-tab').forEach(t => {
      const on = t.dataset.view === view;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
    if (view === 'chart') {
      ZZZChart.render();
      syncChartTools();
    }
    renderPool();
    updateCounts();
    if (!silent) saveState();
  }

  /* ---------- chart integration ---------- */

  function initChart() {
    ZZZChart.init({
      state,
      board: elements.chartBoard,
      hooks: {
        onChange: () => { saveState(); syncChartTools(); },
        onMembership: () => { renderPool(); updateCounts(); },
        onSelect: () => syncChartTools(),
        onPos: () => {
          const sel = state.chart.selected;
          const p = sel ? state.chart.points[sel] : null;
          if (p) {
            elements.chartY.value = p.y;
            elements.chartX.value = p.x;
            elements.chartYv.textContent = p.y;
            elements.chartXv.textContent = p.x;
          }
        },
        onPending: id => {
          if (!id) return;
          const picked = AGENTS.find(a => a.id === id);
          showToast(I18N.t('app.toast.tier_picked', { name: I18N.agentName(picked) }), 'info');
        },
        onExport: () => showToast(I18N.t('app.toast.chart_exported'), 'success'),
      },
    });
  }

  function syncChartTools() {
    elements.chartAxisY.value = state.chart.axisY;
    elements.chartAxisX.value = state.chart.axisX;
    elements.chartAxisYLabel.textContent = state.chart.axisY;
    elements.chartAxisXLabel.textContent = state.chart.axisX;
    const sel = state.chart.selected;
    const agent = sel ? AGENTS.find(a => a.id === sel) : null;
    const p = sel ? state.chart.points[sel] : null;
    elements.chartSelectedName.textContent = agent ? `${I18N.agentName(agent)}（${agent.rank || '?'}）` : I18N.t('chart.none_selected');
    const has = !!p;
    elements.chartY.disabled = elements.chartX.disabled = !has;
    elements.chartFront.disabled = elements.chartRemove.disabled = !has;
    if (has) {
      elements.chartY.value = p.y;
      elements.chartX.value = p.x;
      elements.chartYv.textContent = p.y;
      elements.chartXv.textContent = p.x;
    } else {
      elements.chartYv.textContent = '—';
      elements.chartXv.textContent = '—';
    }
    elements.chartCount.textContent = String(Object.keys(state.chart.points).length);
    const query = state.searchQuery.toLowerCase();
    elements.chartRoster.innerHTML = Object.keys(state.chart.points)
      .map(id => ({ id, agent: AGENTS.find(a => a.id === id) }))
      .filter(o => o.agent && (!query || [o.agent.name, I18N.agentName(o.agent)].some(n => n.toLowerCase().includes(query)) || factionList(o.agent).join(' ').toLowerCase().includes(query)))
      .map(o => `<button type="button" data-id="${o.id}" class="${o.id === sel ? 'active' : ''}">${escapeHtml(I18N.agentName(o.agent))}</button>`)
      .join('');
  }

  function attachChartToolEvents() {
    elements.chartY.addEventListener('input', e => {
      const sel = state.chart.selected;
      const p = sel ? state.chart.points[sel] : null;
      if (!p) return;
      ZZZChart.setPos(sel, p.x, Number(e.target.value));
    });
    elements.chartX.addEventListener('input', e => {
      const sel = state.chart.selected;
      const p = sel ? state.chart.points[sel] : null;
      if (!p) return;
      ZZZChart.setPos(sel, Number(e.target.value), p.y);
    });
    elements.chartFront.addEventListener('click', () => {
      if (state.chart.selected) ZZZChart.bringFront(state.chart.selected);
    });
    elements.chartRemove.addEventListener('click', () => {
      if (state.chart.selected) ZZZChart.remove(state.chart.selected);
    });
    elements.chartAxisY.addEventListener('input', e => {
      state.chart.axisY = e.target.value.slice(0, 6) || '強度';
      elements.chartAxisYLabel.textContent = state.chart.axisY;
      saveState();
    });
    elements.chartAxisX.addEventListener('input', e => {
      state.chart.axisX = e.target.value.slice(0, 6) || '易用度';
      elements.chartAxisXLabel.textContent = state.chart.axisX;
      saveState();
    });
    elements.chartExportPngBtn.addEventListener('click', () => ZZZChart.exportPNG());
    elements.chartRoster.addEventListener('click', e => {
      const btn = e.target.closest('button[data-id]');
      if (btn) ZZZChart.select(btn.dataset.id);
    });
  }

  /* ---------- card & tier interactions ---------- */

  function attachTierEvents() {
    document.querySelectorAll('.agent-tier-label, .agent-row-menu').forEach(btn => {
      btn.addEventListener('click', () => openTierEditor(parseInt(btn.dataset.tierIndex, 10)));
    });
    document.querySelectorAll('.agent-dropzone').forEach(dropzone => {
      dropzone.addEventListener('dragover', handleDragOver);
      dropzone.addEventListener('dragleave', handleDragLeave);
      dropzone.addEventListener('drop', handleDrop);
    });
  }

  function attachCardEvents() {
    document.querySelectorAll('.agent-card[draggable="true"]').forEach(card => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
      card.addEventListener('click', handleCardClick);
      card.addEventListener('dblclick', handleCardDblClick);
      card.addEventListener('keydown', handleCardKeydown);
      card.addEventListener('contextmenu', handleCardContextMenu);
      bindLongPress(card);
    });
  }

  const IMG_MODE_ORDER = ["square", "round", "profile"];
  const IMG_MODE_LABEL = { square: "立繪", round: "Q版", profile: "頭貼" };
  let longPressTimer = null;

  function cycleImageMode(agentId) {
    const next = IMG_MODE_ORDER[(IMG_MODE_ORDER.indexOf(imgModeFor(agentId)) + 1) % IMG_MODE_ORDER.length];
    if (next === state.imgMode) delete state.imgOverride[agentId];
    else state.imgOverride[agentId] = next;
    const agent = AGENTS.find(a => a.id === agentId);
    const label = I18N.t(`img.mode.${next}`);
    showToast(`${agent ? I18N.agentName(agent) : agentId} · ${I18N.t("app.toast.img_changed", {mode: label})}`, 'info');
    renderTierCards();
    renderPool();
    saveState();
  }

  function handleCardContextMenu(e) {
    const card = e.target.closest('.agent-card');
    if (!card) return;
    e.preventDefault();
    cycleImageMode(card.dataset.id);
  }

  function bindLongPress(card) {
    card.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        card.dataset.longPressed = "1";
        cycleImageMode(card.dataset.id);
      }, 550);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
      card.addEventListener(evt, () => {
        if (!longPressTimer) return;
        clearTimeout(longPressTimer);
        longPressTimer = null;
      });
    });
  }

  let dragSourceTier = null;
  let dragSourceIndex = null;

  function handleDragStart(e) {
    const card = e.target.closest('.agent-card');
    if (!card) return;
    dragSourceTier = card.dataset.tierIndex !== undefined ? parseInt(card.dataset.tierIndex, 10) : null;
    dragSourceIndex = card.dataset.agentIndex !== undefined ? parseInt(card.dataset.agentIndex, 10) : null;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.id);
  }

  function handleDragEnd(e) {
    const card = e.target.closest('.agent-card');
    if (card) card.classList.remove('dragging');
    document.querySelectorAll('.agent-dropzone.drag-active').forEach(dz => dz.classList.remove('drag-active'));
    document.querySelectorAll('.agent-tier.drag-over').forEach(t => t.classList.remove('drag-over'));
    dragSourceTier = null;
    dragSourceIndex = null;
  }

  function handleCardDblClick(e) {
    const card = e.target.closest('.agent-card');
    if (!card) return;
    if (card.dataset.tierIndex === undefined) return;
    returnToPool(card.dataset.id, parseInt(card.dataset.tierIndex, 10), parseInt(card.dataset.agentIndex, 10));
  }

  function returnToPool(agentId, fromTier, fromIndex) {
    if (fromTier === null || !state.tiers[fromTier]?.agents) return;
    state.tiers[fromTier].agents.splice(fromIndex, 1);
    if (!state.pool.includes(agentId)) state.pool.unshift(agentId);
    renderTierCards();
    renderPool();
    updateCounts();
    saveState();
    showToast(I18N.t('app.toast.returned_pool'), 'success');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const dropzone = e.target.closest('.agent-dropzone');
    if (dropzone) {
      dropzone.classList.add('drag-active');
      const tier = dropzone.closest('.agent-tier');
      if (tier) tier.classList.add('drag-over');
    }
  }

  function handleDragLeave(e) {
    const dropzone = e.target.closest('.agent-dropzone');
    if (dropzone && !dropzone.contains(e.relatedTarget)) {
      dropzone.classList.remove('drag-active');
      const tier = dropzone.closest('.agent-tier');
      if (tier) tier.classList.remove('drag-over');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.target.closest('.agent-dropzone');
    if (!dropzone) return;
    dropzone.classList.remove('drag-active');
    const tier = dropzone.closest('.agent-tier');
    if (tier) tier.classList.remove('drag-over');
    const targetTierIndex = parseInt(dropzone.dataset.tierIndex, 10);
    const agentId = e.dataTransfer.getData('text/plain');
    if (!agentId) return;
    moveAgent(agentId, dragSourceTier, dragSourceIndex, targetTierIndex);
  }

  function handleCardClick(e) {
    const card = e.target.closest('.agent-card');
    if (!card) return;
    if (card.dataset.longPressed) {
      delete card.dataset.longPressed;
      return;
    }
    const agentId = card.dataset.id;
    if (card.closest('#agent-pool')) {
      if (state.view === 'chart') {
        ZZZChart.armPending(agentId);
        const agent = AGENTS.find(a => a.id === agentId);
        showToast(I18N.t('app.toast.tier_picked', {name: agent ? I18N.agentName(agent) : agentId}), 'info');
      } else {
        addToFirstTier(agentId);
      }
    }
  }

  function handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const card = e.target.closest('.agent-card');
      if (card) card.click();
    }
  }

  function moveAgent(agentId, fromTier, fromIndex, toTier) {
    if (fromTier !== null && fromTier === toTier) return;
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    if (fromTier !== null && state.tiers[fromTier]?.agents) {
      state.tiers[fromTier].agents.splice(fromIndex, 1);
    } else {
      state.pool = state.pool.filter(id => id !== agentId);
    }
    if (!state.tiers[toTier].agents) state.tiers[toTier].agents = [];
    state.tiers[toTier].agents.push(agentId);
    renderTierCards();
    renderPool();
    updateCounts();
    saveState();
    showToast(I18N.t('app.toast.tier_moved', {name: I18N.agentName(agent)}), 'success');
  }

  function addToFirstTier(agentId) {
    if (state.tiers.length === 0) {
      openTierEditor();
      return;
    }
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    if (!state.tiers[0].agents) state.tiers[0].agents = [];
    if (state.tiers[0].agents.includes(agentId)) return;
    state.tiers[0].agents.push(agentId);
    state.pool = state.pool.filter(id => id !== agentId);
    renderTierCards();
    renderPool();
    updateCounts();
    saveState();
    showToast(I18N.t('app.toast.tier_added', {name: I18N.agentName(agent)}), 'success');
  }

  function openTierEditor(tierIndex = null) {
    const isEditing = tierIndex !== null;
    const tier = isEditing ? state.tiers[tierIndex] : { label: '', color: TIER_COLORS[state.nextTierColorIndex % TIER_COLORS.length] };
    const modal = document.createElement('div');
    modal.className = 'tier-editor-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <p class="eyebrow">Tier Editor</p>
        <h3>${isEditing ? '編輯階級' : '新增階級'}</h3>
        <div class="form-group">
          <label>階級標籤</label>
          <input type="text" id="tier-label" value="${escapeHtml(tier.label)}" maxlength="2" placeholder="S" required>
        </div>
        <div class="form-group">
          <label>顏色</label>
          <div class="color-options" id="color-options"></div>
        </div>
        <div class="modal-actions">
          ${isEditing ? '<button class="btn btn-ghost" id="tier-delete" type="button">刪除</button>' : ''}
          <button class="btn btn-secondary" id="tier-cancel" type="button">取消</button>
          <button class="btn btn-primary" id="tier-save" type="button">儲存</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));

    const colorOptions = modal.querySelector('#color-options');
    TIER_COLORS.forEach(color => {
      const opt = document.createElement('div');
      opt.className = `color-option${color === tier.color ? ' selected' : ''}`;
      opt.style.background = color;
      opt.dataset.color = color;
      opt.addEventListener('click', () => {
        colorOptions.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
      colorOptions.appendChild(opt);
    });

    const labelInput = modal.querySelector('#tier-label');
    labelInput.focus();
    labelInput.select();

    modal.querySelector('#tier-save').addEventListener('click', () => {
      const label = labelInput.value.trim().toUpperCase();
      if (!label) { showToast('請輸入階級標籤', 'error'); return; }
      const selectedColor = colorOptions.querySelector('.color-option.selected')?.dataset.color || tier.color;
      if (isEditing) {
        state.tiers[tierIndex] = { label, color: selectedColor, agents: state.tiers[tierIndex].agents || [] };
      } else {
        state.tiers.push({ label, color: selectedColor, agents: [] });
        state.nextTierColorIndex++;
      }
      renderTiers();
      updateCounts();
      saveState();
      closeModal(modal);
      showToast(isEditing ? '已更新階級' : '已新增階級', 'success');
    });

    modal.querySelector('#tier-cancel').addEventListener('click', () => closeModal(modal));
    if (isEditing) {
      modal.querySelector('#tier-delete').addEventListener('click', () => {
        if (!confirm('確定要刪除此階級？其中的角色將移回未排行池。')) return;
        const agents = state.tiers[tierIndex].agents || [];
        state.pool.unshift(...agents);
        state.tiers.splice(tierIndex, 1);
        renderTiers();
        renderPool();
        updateCounts();
        saveState();
        closeModal(modal);
        showToast('已刪除階級', 'success');
      });
    }

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); });
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(modal); });
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 200);
  }

  /* ---------- tutorial ---------- */

  const TUTORIAL_KEY = 'zzz-tierlist-tutorial-done';

  function openTutorial() {
    const modal = document.createElement('div');
    modal.className = 'tier-editor-modal tutorial-modal';
    modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-label="使用教學">
        <p class="eyebrow">How To Use</p>
        <h3>使用教學</h3>
        <div class="tutorial-section">
          <h4>階級表</h4>
          <ul>
            <li>從右側<b>角色庫拖曳</b>角色到階級列；或<b>點擊</b>角色卡快速放入第一個階級</li>
            <li><b>雙擊</b>卡片移回角色庫；也可直接拖回角色庫</li>
            <li>點擊<b>階級名</b>編輯標籤與顏色，「＋ 新增階級」自訂階級</li>
            <li><b>右鍵</b>卡片切換圖片樣式（立繪／Q版／頭貼）</li>
            <li>板下「顯示職業」只影響顯示，不影響排行資料</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4>二維圖</h4>
          <ul>
            <li>點選角色庫角色後<b>點擊板面</b>放置，或直接<b>拖曳</b>進板面</li>
            <li><b>拖動圓點</b>調整位置；重疊時<b>雙擊</b>循環選取</li>
            <li>選取後可用<b>方向鍵</b>微調（Shift 加速），並可「移至最前」「從圖上移除」</li>
            <li>Y／X <b>軸名稱</b>可自訂編輯；兩介面的放置狀態互不影響</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h4>標記與匯出</h4>
          <ul>
            <li>屬性含<b>特殊</b>（流明／凜刃／烈霜／玄墨）的角色，卡片右下角有<b>圓點標記</b></li>
            <li>「<b>下載 PNG</b>」依當前檢視匯出階級表或二維圖</li>
            <li>「<b>分享與匯出</b>」：複製分享連結、預覽匯出、JSON 匯入／匯出</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button class="btn btn-erotic" id="tutorial-erotic" type="button" aria-pressed="${eroticOn() ? 'true' : 'false'}">
            <svg class="heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7.5-4.7-10-9.2C.6 8.6 2.6 4 7 4c2.2 0 3.8 1.2 5 3 1.2-1.8 2.8-3 5-3 4.4 0 6.4 4.6 5 7.8C19.5 16.3 12 21 12 21z"/></svg>
            <span>${escapeHtml(I18N.t('tutorial.erotic'))}${eroticOn() ? '：ON' : '：OFF'}</span>
          </button>
          <button class="btn btn-primary" id="tutorial-close" type="button">開始使用</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));
    const close = () => {
      try { localStorage.setItem(TUTORIAL_KEY, '1'); } catch (e) { /* noop */ }
      closeModal(modal);
      maybeAskName();
    };
    modal.querySelector('#tutorial-close').addEventListener('click', close);
    const eroticBtn = modal.querySelector('#tutorial-erotic');
    eroticBtn.addEventListener('click', () => {
      const on = !eroticOn();
      setEroticOn(on);
      eroticBtn.setAttribute('aria-pressed', String(on));
      eroticBtn.querySelector('span').textContent = I18N.t('tutorial.erotic') + (on ? '：ON' : '：OFF');
      renderSortSelect();
      showToast(I18N.t('tutorial.erotic') + (on ? '：ON' : '：OFF'), 'info');
    });
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function maybeShowTutorial() {
    let seen = false;
    try { seen = localStorage.getItem(TUTORIAL_KEY) === '1'; } catch (e) { /* noop */ }
    if (!seen) openTutorial();
  }

  function openNamePrompt() {
    const modal = document.createElement('div');
    modal.className = 'tier-editor-modal name-prompt-modal';
    modal.innerHTML = `
      <div class="modal-content" role="dialog" aria-label="使用者名稱">
        <p class="eyebrow">Your Name</p>
        <h3>怎麼稱呼你？</h3>
        <div class="form-group">
          <label>用於預設排行標題（可隨時直接修改標題，不影響其他資料）</label>
          <input type="text" id="user-name" maxlength="20" placeholder="例如：繩匠">
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="name-skip" type="button">略過</button>
          <button class="btn btn-primary" id="name-save" type="button">儲存</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));
    const input = modal.querySelector('#user-name');
    input.value = userName();
    input.focus();
    const commit = name => {
      try { localStorage.setItem(USER_NAME_KEY, name || ""); } catch (e) { /* noop */ }
      const neutral = !state.title || state.title === "絕區零排行" || state.title === "我的絕區零排行";
      if (neutral) {
        state.title = name ? `${name}的絕區零排行` : "絕區零排行";
        elements.titleInput.value = state.title;
        saveState();
        updateSaveStatus();
      }
      closeModal(modal);
    };
    modal.querySelector('#name-save').addEventListener('click', () => commit(input.value.trim()));
    modal.querySelector('#name-skip').addEventListener('click', () => commit(""));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') commit(input.value.trim()); });
    modal.addEventListener('click', e => { if (e.target === modal) commit(""); });
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') commit(""); });
  }

  function maybeAskName() {
    let asked = true;
    try { asked = localStorage.getItem(USER_NAME_KEY) !== null; } catch (e) { /* noop */ }
    if (asked || readSharedState()) return;
    openNamePrompt();
  }

  /* ---------- export / import / share ---------- */

  function downloadAsPNG() {
    const boardWrap = document.querySelector('.tier-board-wrap');
    if (!boardWrap) return;
    if (typeof html2canvas !== 'function') {
      downloadBoardFallback();
      return;
    }
    html2canvas(boardWrap, {
      backgroundColor: '#0a0a0c',
      scale: 2,
      useCORS: true,
      logging: false,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `${state.title.replace(/[^\w\u4e00-\u9fff-]+/g, '_') || 'tierlist'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('已下載 PNG', 'success');
    }).catch(err => {
      console.error(err);
      downloadBoardFallback();
    });
  }

  function downloadBoardFallback() {
    try {
      const canvas = drawBoardToCanvas();
      const link = document.createElement('a');
      link.download = `${state.title.replace(/[^\w\u4e00-\u9fff-]+/g, '_') || 'tierlist'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('已使用離線模式下載 PNG', 'success');
    } catch (err) {
      console.error(err);
      showToast('下載失敗', 'error');
    }
  }

  function drawBoardToCanvas() {
    const dpr = 2;
    const width = 900;
    const rowH = 112;
    const pad = 24;
    const cell = 84;
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = (pad * 2 + 56 + state.tiers.length * (rowH + 12)) * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#131316';
    ctx.fillRect(0, 0, width, canvas.height / dpr);
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(state.title.slice(0, 60), pad, pad + 20);
    state.tiers.forEach((tier, row) => drawTierRow(ctx, tier, row, { pad, rowH, cell, width }));
    return canvas;
  }

  function drawTierRow(ctx, tier, row, box) {
    const y = box.pad + 56 + row * (box.rowH + 12);
    ctx.fillStyle = '#1a1a1f';
    ctx.fillRect(box.pad, y, box.width - box.pad * 2, box.rowH);
    ctx.fillStyle = tier.color || '#333';
    ctx.fillRect(box.pad, y, 64, box.rowH);
    ctx.fillStyle = '#101014';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(tier.label).slice(0, 2), box.pad + 32, y + box.rowH / 2 + 10);
    ctx.textAlign = 'left';
    ctx.font = '12px system-ui, sans-serif';
    (tier.agents || []).forEach((agentId, index) => {
      const agent = AGENTS.find(a => a.id === agentId);
      if (!agent) return;
      const x = box.pad + 76 + index * (box.cell + 8);
      if (x + box.cell > box.width - box.pad) return;
      ctx.fillStyle = '#222228';
      ctx.fillRect(x, y + 14, box.cell, box.cell);
      ctx.fillStyle = '#f4f4f5';
      ctx.fillText(I18N.agentName(agent).slice(0, 8), x + 4, y + 14 + box.cell + 14);
    });
  }

  function chartPayload() {
    return {
      axisX: state.chart.axisX,
      axisY: state.chart.axisY,
      nextZ: state.chart.nextZ,
      points: state.chart.points,
    };
  }

  function exportJSON() {
    const payload = {
      app: 'theweb-zzz-tierlist',
      version: 3,
      exportedAt: new Date().toISOString(),
      title: state.title,
      tiers: state.tiers,
      pool: state.pool,
      chart: chartPayload(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.title.replace(/[^\w\u4e00-\u9fff-]+/g, '_') || 'tierlist'}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('已匯出 JSON', 'success');
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.tiers)) throw new Error('missing tiers');
        const knownIds = new Set(AGENTS.map(a => a.id));
        state.title = typeof data.title === 'string' ? data.title.slice(0, 80) : state.title;
        state.tiers = data.tiers.map(tier => ({
          label: String(tier.label || 'T').slice(0, 2),
          color: tier.color || '#888888',
          agents: Array.isArray(tier.agents) ? tier.agents.filter(id => knownIds.has(id)) : [],
        }));
        state.pool = Array.isArray(data.pool)
          ? data.pool.filter(id => knownIds.has(id) && !NON_PC_IDS.includes(id))
          : playableAgents().map(a => a.id);
        if (data.chart && data.chart.points && typeof data.chart.points === 'object') {
          const points = {};
          for (const [id, p] of Object.entries(data.chart.points)) {
            if (knownIds.has(id) && p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
              points[id] = { x: p.x, y: p.y, z: Number(p.z) || 0 };
            }
          }
          state.chart = {
            axisX: typeof data.chart.axisX === 'string' ? data.chart.axisX : "易用度",
            axisY: typeof data.chart.axisY === 'string' ? data.chart.axisY : "強度",
            selected: null,
            nextZ: Number.isInteger(data.chart.nextZ) ? data.chart.nextZ : 1,
            points,
          };
          syncControls();
          ZZZChart.render();
          syncChartTools();
        }
        elements.titleInput.value = state.title;
        renderTiers();
        renderPool();
        updateCounts();
        saveState();
        showToast('已匯入 JSON', 'success');
      } catch (err) {
        console.error(err);
        showToast('JSON 格式錯誤', 'error');
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  function shareToCommunity() {
    showToast(I18N.t('app.toast.community_soon'), 'info');
  }

  function saveAndShare() {
    saveState();
    const shareData = {
      title: state.title,
      tiers: state.tiers,
      pool: state.pool,
      chart: chartPayload(),
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const url = `${location.origin}${location.pathname}?data=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast(I18N.t('app.toast.copied'), 'success');
    }).catch(() => {
      prompt('複製此連結分享：', url);
    });
  }

  function previewExport() {
    const previewWindow = window.open('', '_blank');
    const rankedTotal = state.tiers.reduce((sum, t) => sum + (t.agents?.length || 0), 0);
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html lang="zh-TW">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(state.title)} - Preview</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0a0a0c; color: #f4f4f5; padding: 2rem; margin: 0; }
          .tier { margin-bottom: 1.5rem; }
          .tier-label { display: inline-block; padding: 0.5rem 1rem; font-weight: 700; margin-bottom: 0.75rem; color: #101014; }
          .agents { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .agent { width: 80px; text-align: center; font-size: 0.7rem; }
          .agent img { width: 100%; aspect-ratio: 1; object-fit: cover; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(state.title)}</h1>
        <p>${rankedTotal} agents ranked across ${state.tiers.length} tiers</p>
        ${state.tiers.map(tier => `
          <div class="tier">
            <div class="tier-label" style="background:${tier.color}">${escapeHtml(tier.label)}</div>
            <div class="agents">
              ${(tier.agents || []).map(aid => {
                const a = AGENTS.find(x => x.id === aid);
                return a ? `<div class="agent"><img src="${a.imgRound || a.imgSquare || a.img}" alt="${escapeHtml(I18N.agentName(a))}"><div>${escapeHtml(I18N.agentName(a))}</div></div>` : '';
              }).join('')}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `);
    previewWindow.document.close();
  }

  /* ---------- utils ---------- */

  function showToast(message, type = 'info') {
    const toast = elements.toast;
    toast.textContent = message;
    toast.className = 'toast show' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 250);
    }, 2200);
  }

  function escapeHtml(text) {
    return String(text ?? '').replace(/[&<>"']/g, ch => (
      ch === '&' ? '&#38;' : ch === '<' ? '&#60;' : ch === '>' ? '&#62;' : ch === '"' ? '&#34;' : '&#39;'
    ));
  }

  init();
})();
