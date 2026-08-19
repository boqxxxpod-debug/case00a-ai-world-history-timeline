(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  let lastKey = '';

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function activeStoryId() {
    const active = document.querySelector('.story-button.active');
    if (active?.dataset.storyId) return active.dataset.storyId;
    const kicker = document.querySelector('#detailPanel .story-kicker')?.textContent || '';
    const m = kicker.match(/(ST\d+)/);
    return m ? m[1] : null;
  }

  function currentStepIndex() {
    const kicker = document.querySelector('#detailPanel .story-kicker')?.textContent || '';
    const m = kicker.match(/ST\d+\s*[·・]\s*(\d+)\s*\//);
    return m ? Math.max(0, Number(m[1]) - 1) : 0;
  }

  function clearNodeBadges() {
    document.querySelectorAll('.v07-step-badge').forEach(el => el.remove());
  }

  function clearClasses() {
    const classes = [
      'v07-chapter-node','v07-visited-node','v07-current-node','v07-next-node','v07-future-node','v07-outside-node',
      'v07-chapter-link','v07-visited-link','v07-current-link','v07-next-link','v07-future-link','v07-outside-link'
    ];
    document.querySelectorAll('.node,.link-visible').forEach(el => classes.forEach(c => el.classList.remove(c)));
    clearNodeBadges();
  }

  function stepMap(story) {
    const nodeSteps = new Map();
    const linkSteps = new Map();
    story.steps.forEach((step, i) => {
      (step.anchors || []).forEach(id => {
        if (!nodeSteps.has(id)) nodeSteps.set(id, []);
        nodeSteps.get(id).push(i);
      });
      (step.links || []).forEach(id => {
        if (!linkSteps.has(id)) linkSteps.set(id, []);
        linkSteps.get(id).push(i);
      });
    });
    return {nodeSteps, linkSteps};
  }

  function stateFor(indices, current) {
    if (!indices?.length) return 'future';
    if (indices.includes(current)) return 'current';
    if (indices.includes(current + 1)) return 'next';
    if (indices.some(i => i < current)) return 'visited';
    return 'future';
  }

  function addBadge(nodeEl, indices, current) {
    if (!nodeEl || !indices?.length) return;
    const badge = document.createElement('span');
    const state = stateFor(indices, current);
    badge.className = `v07-step-badge ${state}`;
    const numbers = indices.slice(0, 2).map(i => i + 1);
    badge.textContent = numbers.join('·') + (indices.length > 2 ? '+' : '');
    badge.title = `この章のステップ ${indices.map(i => i + 1).join(', ')}`;
    nodeEl.appendChild(badge);
  }

  function classifyMap(storyId, current) {
    const story = stories[storyId];
    if (!story?.steps?.length) return;
    const {nodeSteps, linkSteps} = stepMap(story);

    document.querySelectorAll('.node').forEach(el => {
      const id = el.dataset.nodeId;
      const indices = nodeSteps.get(id);
      if (!indices) {
        el.classList.add('v07-outside-node');
        return;
      }
      el.classList.add('v07-chapter-node');
      const state = stateFor(indices, current);
      el.classList.add(`v07-${state}-node`);
      addBadge(el, indices, current);
    });

    document.querySelectorAll('.link-visible').forEach(el => {
      const id = el.dataset.linkId;
      const indices = linkSteps.get(id);
      if (!indices) {
        el.classList.add('v07-outside-link');
        return;
      }
      el.classList.add('v07-chapter-link');
      const state = stateFor(indices, current);
      el.classList.add(`v07-${state}-link`);
    });
  }

  function lensStatus(story, idx) {
    const step = story.steps[idx] || {};
    const linkCount = step.links?.length || 0;
    if (linkCount === 0) return {icon:'🧩', text:'このステップは直接の矢印なし。右の読み物で「間」をつないでいます。', cls:'bridge'};
    if (linkCount >= 3) return {icon:'🛣️', text:`ここは${linkCount}本の矢印が絡むところ。一本道ではなく、分岐・合流として見てください。`, cls:'branch'};
    return {icon:'↗', text:'右で読んだ因果を、左の矢印で確認するステップです。', cls:'normal'};
  }

  function ensureLensBar() {
    let bar = document.getElementById('v07MapLens');
    if (bar) return bar;
    const help = document.querySelector('.graph-shell .graph-help');
    if (!help) return null;
    bar = document.createElement('div');
    bar.id = 'v07MapLens';
    bar.className = 'v07-map-lens';
    help.insertAdjacentElement('afterend', bar);
    return bar;
  }

  function renderLensBar(storyId, idx) {
    const bar = ensureLensBar();
    if (!bar) return;
    const story = stories[storyId];
    if (!story?.steps?.length) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    const step = story.steps[idx];
    const status = lensStatus(story, idx);
    bar.innerHTML = `
      <div class="v07-lens-main">
        <div class="v07-lens-title"><span>🗺️</span><div><b>読んだあとに見る地図</b><small>${esc(storyId)} · ${idx + 1}/${story.steps.length} · ${esc(step?.short || step?.title || '')}</small></div></div>
        <button type="button" data-v07-center>今ここへ</button>
      </div>
      <div class="v07-lens-legend">
        <span><i class="visited">✓</i>通った</span>
        <span><i class="current">●</i>いま</span>
        <span><i class="next">○</i>つぎ</span>
        <span><i class="future">·</i>この章の先</span>
      </div>
      <div class="v07-lens-note ${status.cls}"><span>${status.icon}</span>${esc(status.text)}</div>`;
  }

  function centerCurrent(storyId, idx, smooth=true) {
    const story = stories[storyId];
    const viewport = document.getElementById('graphViewport');
    if (!story || !viewport) return;
    const anchor = story.steps?.[idx]?.anchors?.[0];
    if (!anchor) return;
    const node = document.querySelector(`.node[data-node-id="${CSS.escape(anchor)}"]`);
    if (!node) return;

    const world = document.getElementById('graphWorld');
    if (!world) return;
    const nodeCenterX = node.offsetLeft + node.offsetWidth / 2;
    const nodeCenterY = node.offsetTop + node.offsetHeight / 2;
    const left = Math.max(0, nodeCenterX - viewport.clientWidth / 2);
    const top = Math.max(0, nodeCenterY - viewport.clientHeight / 2);
    viewport.scrollTo({left, top, behavior: smooth ? 'smooth' : 'auto'});
  }

  function update(autoCenter=false) {
    const sid = activeStoryId();
    const idx = currentStepIndex();
    const key = `${sid || 'none'}:${idx}`;
    if (!sid || !stories[sid]) {
      if (lastKey !== key) clearClasses();
      const bar = ensureLensBar();
      if (bar) bar.hidden = true;
      lastKey = key;
      return;
    }

    if (lastKey !== key) {
      clearClasses();
      classifyMap(sid, idx);
      renderLensBar(sid, idx);
      if (autoCenter) centerCurrent(sid, idx, false);
      lastKey = key;
    } else {
      renderLensBar(sid, idx);
    }
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .v07-map-lens { padding:10px 12px; border-bottom:1px solid #e9e4db; background:#f8f6f0; display:grid; gap:8px; }
      .v07-lens-main { display:flex; align-items:center; justify-content:space-between; gap:10px; }
      .v07-lens-title { display:flex; gap:8px; align-items:flex-start; min-width:0; }
      .v07-lens-title > span { font-size:18px; line-height:1.1; }
      .v07-lens-title > div { display:grid; gap:1px; min-width:0; }
      .v07-lens-title b { font-size:11.5px; }
      .v07-lens-title small { font-size:9.5px; color:#777067; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .v07-lens-main button { border:1px solid #cfc8bd; background:#fff; color:#273b55; border-radius:999px; padding:6px 9px; cursor:pointer; font-size:10px; font-weight:900; white-space:nowrap; }
      .v07-lens-legend { display:flex; flex-wrap:wrap; gap:10px; font-size:9.5px; color:#6c665e; font-weight:700; }
      .v07-lens-legend span { display:flex; align-items:center; gap:4px; }
      .v07-lens-legend i { width:17px; height:17px; display:grid; place-items:center; border-radius:50%; font-style:normal; font-size:9px; font-weight:900; border:1px solid #ccc5ba; background:#fff; }
      .v07-lens-legend i.visited { background:#718873; color:#fff; border-color:#718873; }
      .v07-lens-legend i.current { background:#e5a93f; color:#fff; border-color:#d18f1d; }
      .v07-lens-legend i.next { background:#55789b; color:#fff; border-color:#55789b; }
      .v07-lens-legend i.future { background:#efede8; color:#8a8379; }
      .v07-lens-note { display:flex; gap:6px; align-items:flex-start; font-size:10px; line-height:1.45; color:#615b53; padding:6px 8px; border-radius:9px; background:#fff; border:1px solid #e0dbd1; }
      .v07-lens-note.bridge { background:#eef5f7; border-color:#cbdde1; }
      .v07-lens-note.branch { background:#f1f0fa; border-color:#d6d1ea; }

      body.deep-story-mode .node.v07-outside-node { opacity:.10 !important; filter:saturate(.3); }
      body.deep-story-mode .node.v07-chapter-node { opacity:.58 !important; }
      body.deep-story-mode .node.v07-future-node { opacity:.36 !important; }
      body.deep-story-mode .node.v07-visited-node { opacity:.68 !important; box-shadow:0 0 0 2px rgba(103,132,106,.22),0 3px 12px rgba(25,30,35,.08) !important; }
      body.deep-story-mode .node.v07-current-node { opacity:1 !important; z-index:9 !important; box-shadow:0 0 0 4px #e5a93f,0 10px 26px rgba(25,30,35,.25) !important; transform:translate(-50%,-50%) scale(1.055); }
      body.deep-story-mode .node.v07-next-node { opacity:.92 !important; z-index:7 !important; box-shadow:0 0 0 3px rgba(85,120,155,.55),0 6px 18px rgba(25,30,35,.14) !important; }

      body.deep-story-mode .link-visible.v07-outside-link { opacity:.025 !important; }
      body.deep-story-mode .link-visible.v07-future-link { opacity:.16 !important; }
      body.deep-story-mode .link-visible.v07-visited-link { opacity:.38 !important; }
      body.deep-story-mode .link-visible.v07-current-link { opacity:1 !important; stroke:#e0922f !important; stroke-width:5.5 !important; filter:drop-shadow(0 2px 2px rgba(0,0,0,.18)); }
      body.deep-story-mode .link-visible.v07-next-link { opacity:.72 !important; stroke:#55789b !important; stroke-width:3.8 !important; }

      .node .v07-step-badge { position:absolute; left:-11px; top:-11px; min-width:20px; height:20px; padding:0 4px; border-radius:999px; display:grid; place-items:center; font-size:8px; font-weight:900; line-height:1; background:#efede8; color:#736c63; border:2px solid #fff; box-shadow:0 2px 5px rgba(0,0,0,.16); z-index:12; }
      .node .v07-step-badge.visited { background:#718873; color:#fff; }
      .node .v07-step-badge.current { background:#e5a93f; color:#fff; }
      .node .v07-step-badge.next { background:#55789b; color:#fff; }
      .node .v07-step-badge.future { background:#ece9e3; color:#81796f; }

      @media (max-width:1040px) {
        .v07-map-lens { position:sticky; top:0; z-index:10; }
      }
      @media (max-width:720px) {
        .v07-lens-legend { gap:7px; }
        .v07-lens-note { font-size:9.5px; }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', e => {
    if (e.target.closest?.('[data-v07-center]')) {
      e.preventDefault();
      const sid = activeStoryId();
      if (sid) centerCurrent(sid, currentStepIndex(), true);
      return;
    }
    setTimeout(() => update(true), 0);
  }, true);

  const observer = new MutationObserver(() => requestAnimationFrame(() => update(false)));
  observer.observe(document.body, {childList:true, subtree:true});

  installStyles();
  update(false);
})();