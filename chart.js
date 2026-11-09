/* TheWeb ZZZ 2-axis chart module.
 * Interaction model follows ZZZ 2軸Tierメーカー Ver.2.8:
 * percentage-positioned DOM dots, pointer drag, click-to-select,
 * double-click cycles overlapping dots, pending placement from the library. */
(function() {
  'use strict';

  let state = null;
  let hooks = {};
  let board = null;
  let pending = null;
  let clicks = { id: null, t: 0 };

  const clamp = n => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));

  function agents() {
    if (window.AGENTS) return window.AGENTS;
    try { return AGENTS || []; } catch (e) { return []; }
  }
  function findAgent(id) { return agents().find(a => a.id === id) || null; }
  function points() { return state.chart.points; }
  function get(id) { return points()[id] || null; }

  function dotEl(id) {
    return board.querySelector('.chart-dot[data-id="' + CSS.escape(id) + '"]');
  }

  function clientToPct(e) {
    const r = board.getBoundingClientRect();
    return [
      clamp((e.clientX - r.left) / r.width * 100),
      clamp((1 - (e.clientY - r.top) / r.height) * 100),
    ];
  }

  function armPending(agentId) {
    pending = agentId;
    board.classList.add('pending');
    if (hooks.onPending) hooks.onPending(agentId);
  }

  function clearPending() {
    pending = null;
    board.classList.remove('pending');
    if (hooks.onPending) hooks.onPending(null);
  }

  function place(agentId, x, y) {
    const p = get(agentId) || { z: 0 };
    p.x = clamp(x);
    p.y = clamp(y);
    p.z = ++state.chart.nextZ;
    points()[agentId] = p;
    state.chart.selected = agentId;
    clearPending();
    render();
    if (hooks.onChange) hooks.onChange(agentId);
    if (hooks.onMembership) hooks.onMembership();
    if (hooks.onSelect) hooks.onSelect(agentId);
  }

  function remove(agentId) {
    delete points()[agentId];
    if (state.chart.selected === agentId) state.chart.selected = null;
    clearPending();
    render();
    if (hooks.onChange) hooks.onChange(agentId);
    if (hooks.onMembership) hooks.onMembership();
    if (hooks.onSelect) hooks.onSelect(null);
  }

  function setPos(agentId, x, y) {
    if (!get(agentId)) { place(agentId, x, y); return; }
    const p = get(agentId);
    p.x = clamp(x);
    p.y = clamp(y);
    const el = board.querySelector('.chart-dot[data-id="' + CSS.escape(agentId) + '"]');
    if (el) {
      el.style.left = p.x + '%';
      el.style.top = (100 - p.y) + '%';
      el.title = dotTitle(agentId, p);
    }
    if (hooks.onPos) hooks.onPos(agentId);
    if (hooks.onChange) hooks.onChange(agentId);
  }

  function bringFront(agentId) {
    const p = get(agentId);
    if (!p) return;
    p.z = ++state.chart.nextZ;
    render();
    if (hooks.onChange) hooks.onChange(agentId);
  }

  function nudge(agentId, dx, dy) {
    const p = get(agentId);
    if (!p) return;
    setPos(agentId, clamp(p.x + dx), clamp(p.y + dy));
  }

  function select(agentId) {
    state.chart.selected = agentId || null;
    render();
    if (state.chart.selected) {
      const el = dotEl(state.chart.selected);
      if (el) { try { el.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
    }
    if (hooks.onSelect) hooks.onSelect(state.chart.selected);
  }

  function dotTitle(id, p) {
    const agent = findAgent(id);
    return (agent ? I18N.agentName(agent) : id) + ' / ' + state.chart.axisY + ' ' + p.y + ' / ' + state.chart.axisX + ' ' + p.x;
  }

  function faceFor(agent) {
    return agent ? (agent.imgRound || agent.img || agent.imgSquare) : null;
  }

  function render() {
    board.querySelectorAll('.chart-dot').forEach(el => el.remove());
    for (const [id, p] of Object.entries(points())) {
      const agent = findAgent(id);
      if (!agent) continue;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'chart-dot' + (state.chart.selected === id ? ' selected' : '');
      el.dataset.id = id;
      el.style.left = p.x + '%';
      el.style.top = (100 - p.y) + '%';
      el.style.zIndex = String(1000 + (p.z || 0));
      el.title = dotTitle(id, p);
      el.setAttribute('aria-label', el.title);
      const face = faceFor(agent);
      if (face) el.style.backgroundImage = 'url("' + face + '")';
      else el.textContent = I18N.agentName(agent).replace(/[0-9・＆\s]/g, '').slice(0, 2);
      if (state.showNames) {
        const label = document.createElement('span');
        label.className = 'chart-dot-label';
        label.textContent = I18N.agentName(agent);
        el.appendChild(label);
      }
      bindDot(el, id);
      board.appendChild(el);
    }
    applyRoleView();
  }

  function applyRoleView() {
    const view = (state && state.chartRoleView) || 'all';
    board.querySelectorAll('.chart-dot').forEach(el => {
      const agent = findAgent(el.dataset.id);
      el.classList.toggle('role-hidden', view !== 'all' && !!agent && agent.role !== view);
    });
  }

  function bindDot(el, id) {
    let drag = null;
    el.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, pointer: e.pointerId, moved: false };
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    el.addEventListener('pointermove', e => {
      if (!drag || drag.pointer !== e.pointerId) return;
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) {
        drag.moved = true;
        const [x, y] = clientToPct(e);
        setPos(id, x, y);
      }
    });
    el.addEventListener('pointerup', e => {
      if (!drag || drag.pointer !== e.pointerId) return;
      const moved = drag.moved;
      drag = null;
      if (moved) {
        select(id);
        if (hooks.onChange) hooks.onChange(id);
        return;
      }
      const now = Date.now();
      const p = get(id);
      let target = id;
      if (p && clicks.id === id && now - clicks.t < 1500) {
        const near = Object.entries(points())
          .filter(([qid, q]) => qid !== id && Math.hypot(q.x - p.x, q.y - p.y) < 4)
          .map(([qid]) => qid);
        if (near.length > 0) {
          const order = [id].concat(near);
          const idx = order.indexOf(state.chart.selected);
          target = order[(idx + 1) % order.length];
        }
      }
      clicks = { id, t: now };
      select(target);
    });
    el.addEventListener('pointercancel', () => { drag = null; });
  }

  function bindBoard() {
    board.addEventListener('click', e => {
      if (e.target.closest('.chart-dot')) return;
      if (pending === null) { select(null); return; }
      const [x, y] = clientToPct(e);
      place(pending, x, y);
    });
    board.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    board.addEventListener('drop', e => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain') || pending;
      if (!id) return;
      const [x, y] = clientToPct(e);
      place(id, x, y);
      clearPending();
    });
  }

  /* PNG export — canvas render modeled after the reference site. */
  async function exportPNG() {
    const W = 1800, H = 1930, pad = 130, size = 1510;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#101014';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 43px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((state.title || 'ZZZ 2軸Tier表').slice(0, 30) + ' — 2軸評価', W / 2, 67);

    ctx.fillStyle = '#17171c';
    ctx.fillRect(pad, pad, size, size);
    ctx.strokeStyle = '#2b2b33';
    ctx.lineWidth = 2;
    for (let n = 0; n <= 10; n++) {
      const v = pad + size * n / 10;
      ctx.beginPath(); ctx.moveTo(v, pad); ctx.lineTo(v, pad + size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, v); ctx.lineTo(pad + size, v); ctx.stroke();
    }
    ctx.strokeStyle = '#8b8b96';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pad + size / 2, pad); ctx.lineTo(pad + size / 2, pad + size);
    ctx.moveTo(pad, pad + size / 2); ctx.lineTo(pad + size, pad + size / 2);
    ctx.stroke();

    ctx.fillStyle = '#d4d4dc';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('← 難用', pad, 1720);
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(state.chart.axisX, W / 2, 1720);
    ctx.textAlign = 'right';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('好用 →', pad + size, 1720);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 27px sans-serif';
    const yText = [['強', pad + 95], [state.chart.axisY, pad + size / 2], ['弱', pad + size - 95]];
    for (const [txt, yy] of yText) {
      const chars = [...String(txt)];
      chars.forEach((ch, i, arr) => ctx.fillText(ch, 73, yy + (i - (arr.length - 1) / 2) * 34));
    }
    ctx.restore();

    const entries = Object.entries(points());
    const images = new Map();
    await Promise.all(entries.map(([id]) => new Promise(resolve => {
      const agent = findAgent(id);
      const src = faceFor(agent);
      if (!src) { resolve(); return; }
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => { images.set(id, im); resolve(); };
      im.onerror = () => resolve();
      im.src = src;
    })));

    const sorted = entries.slice().sort((a, b) => (a[1].z || 0) - (b[1].z || 0));
    for (const [id, p] of sorted) {
      const agent = findAgent(id);
      if (!agent) continue;
      const x = pad + size * p.x / 100;
      const y = pad + size * (100 - p.y) / 100;
      const r = 31.04;
      const faceR = 32.67;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#3a3a44';
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      const im = images.get(id);
      if (im) ctx.drawImage(im, x - faceR, y - faceR, faceR * 2, faceR * 2);
      else {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(agent.name.replace(/[0-9・＆\s]/g, '').slice(0, 2), x, y + 8);
      }
      ctx.restore();
      ctx.strokeStyle = id === state.chart.selected ? '#d4ff3f' : 'rgba(212,255,63,0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      if (state.showNames) {
        ctx.fillStyle = '#f4f4f5';
        ctx.font = '600 17px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(agent.name, x, y + r + 24);
        ctx.shadowBlur = 0;
      }
    }

    const link = document.createElement('a');
    link.download = ((state.title || 'zzz-chart').replace(/[^\w\u4e00-\u9fff-]+/g, '_')) + '-2axis.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (hooks.onExport) hooks.onExport();
  }

  function init(opts) {
    state = opts.state;
    hooks = opts.hooks || {};
    board = opts.board;
    bindBoard();
    render();
  }

  window.ZZZChart = {
    init,
    render,
    place,
    remove,
    setPos,
    nudge,
    bringFront,
    select,
    armPending,
    clearPending,
    exportPNG,
    applyRoleView,
    get selected() { return state ? state.chart.selected : null; },
  };
})();
