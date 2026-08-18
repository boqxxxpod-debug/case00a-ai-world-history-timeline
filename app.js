(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  const storyData = window.CASE00A_STORIES;
  if (!data || !storyData) throw new Error('CASE00A data not loaded');

  const laneOrder = ['printing', 'reformation', 'state', 'science', 'industry'];
  const laneNames = { printing:'印刷', reformation:'宗教改革', state:'国家', science:'科学', industry:'産業' };
  const laneColors = { printing:'#4b6f8f', reformation:'#8a5b47', state:'#6d647f', science:'#3f7a6b', industry:'#9a752f' };
  const YEAR_MIN = 1450, YEAR_MAX = 1800;
  const WORLD_W = 2100, WORLD_H = 1110;
  const LEFT = 72, RIGHT = 36, AXIS_Y = 52, LANE_TOP = 92, LANE_H = 198;

  const nodesById = new Map(data.nodes.map(n => [n.id, n]));
  const linksById = new Map(data.links.map(l => [l.id, l]));
  const storiesById = new Map(storyData.stories.map(s => [s.id, s]));
  const positions = new Map();

  const state = {
    storyId: null,
    selectedNodeId: null,
    selectedLinkId: null,
    activeLanes: new Set(laneOrder)
  };

  const el = id => document.getElementById(id);
  const svg = el('graphSvg');
  const nodeLayer = el('nodeLayer');

  function xForYear(year) {
    const clamped = Math.max(YEAR_MIN, Math.min(YEAR_MAX, year));
    return LEFT + ((clamped - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (WORLD_W - LEFT - RIGHT);
  }

  function midpointYear(n) {
    return n.end_year ? (n.start_year + n.end_year) / 2 : n.start_year;
  }

  function createSvg(tag, attrs = {}) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, String(v)));
    return e;
  }

  function layoutNodes() {
    positions.clear();
    laneOrder.forEach((lane, laneIndex) => {
      const laneNodes = data.nodes.filter(n => n.lane === lane).sort((a,b) => midpointYear(a)-midpointYear(b) || a.id.localeCompare(b.id));
      const lastX = [-Infinity,-Infinity,-Infinity];
      laneNodes.forEach((n, idx) => {
        const x = xForYear(midpointYear(n));
        let slot = lastX.findIndex(v => x - v > 148);
        if (slot < 0) slot = idx % 3;
        lastX[slot] = x;
        const y = LANE_TOP + laneIndex * LANE_H + 58 + slot * 49;
        positions.set(n.id, { x, y, slot });
      });
    });
  }

  function drawBase() {
    svg.setAttribute('viewBox', `0 0 ${WORLD_W} ${WORLD_H}`);
    svg.setAttribute('width', WORLD_W);
    svg.setAttribute('height', WORLD_H);
    svg.innerHTML = '';

    const defs = createSvg('defs');
    ['strong','medium','debated'].forEach(kind => {
      const marker = createSvg('marker', { id:`arrow-${kind}`, markerWidth:8, markerHeight:8, refX:7, refY:3, orient:'auto', markerUnits:'strokeWidth' });
      const color = kind === 'strong' ? '#1f2933' : kind === 'medium' ? '#6f7b87' : '#b35c2e';
      marker.appendChild(createSvg('path', { d:'M0,0 L0,6 L7,3 z', fill:color }));
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    laneOrder.forEach((lane, i) => {
      const top = LANE_TOP + i * LANE_H;
      const bg = createSvg('rect', { x:0, y:top, width:WORLD_W, height:LANE_H, fill:laneColors[lane], class:'lane-bg', 'data-lane':lane });
      svg.appendChild(bg);
      svg.appendChild(createSvg('line', { x1:0, x2:WORLD_W, y1:top, y2:top, class:'lane-divider' }));
      const txt = createSvg('text', { x:12, y:top+22, class:'lane-label', fill:laneColors[lane] });
      txt.textContent = laneNames[lane];
      svg.appendChild(txt);
    });

    for (let year = YEAR_MIN; year <= YEAR_MAX; year += 25) {
      const x = xForYear(year);
      const major = year % 50 === 0;
      svg.appendChild(createSvg('line', { x1:x, x2:x, y1:AXIS_Y+8, y2:WORLD_H-16, class:`year-grid${major?' major':''}` }));
      const label = createSvg('text', { x, y:AXIS_Y, 'text-anchor':'middle', class:'year-label' });
      label.textContent = year;
      svg.appendChild(label);
    }

    data.nodes.filter(n => n.end_year).forEach(n => {
      const laneIndex = laneOrder.indexOf(n.lane);
      const p = positions.get(n.id);
      const y = p ? p.y + 23 : LANE_TOP + laneIndex * LANE_H + 45;
      const bar = createSvg('line', { x1:xForYear(n.start_year), x2:xForYear(n.end_year), y1:y, y2:y, stroke:laneColors[n.lane], class:'duration-bar', 'data-duration-node':n.id });
      svg.appendChild(bar);
    });
  }

  function pathForLink(link, index) {
    const a = positions.get(link.from), b = positions.get(link.to);
    if (!a || !b) return '';
    const x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
    if (Math.abs(y2-y1) < 35) {
      const bend = 34 + (index % 3) * 17;
      const direction = index % 2 ? 1 : -1;
      const cy = y1 + direction * bend;
      return `M ${x1} ${y1} Q ${(x1+x2)/2} ${cy} ${x2} ${y2}`;
    }
    const dx = Math.max(45, Math.abs(x2-x1) * .38);
    const c1x = x1 + Math.sign(x2-x1 || 1) * dx;
    const c2x = x2 - Math.sign(x2-x1 || 1) * dx;
    return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
  }

  function drawLinks() {
    const group = createSvg('g', { id:'linkLayer' });
    data.links.forEach((link, i) => {
      const d = pathForLink(link, i);
      const vis = createSvg('path', { d, class:`link-visible ${link.strength}`, 'data-link-id':link.id, 'marker-end':`url(#arrow-${link.strength})` });
      const hit = createSvg('path', { d, class:'link-hit', 'data-link-id':link.id, tabindex:'0', role:'button', 'aria-label':`${link.id}: ${link.label}` });
      hit.addEventListener('click', () => selectLink(link.id));
      hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectLink(link.id); });
      group.appendChild(vis);
      group.appendChild(hit);
    });
    svg.appendChild(group);
  }

  function drawNodes() {
    nodeLayer.innerHTML = '';
    data.nodes.forEach(n => {
      const p = positions.get(n.id);
      const div = document.createElement('button');
      div.type = 'button';
      div.className = 'node';
      div.dataset.nodeId = n.id;
      div.dataset.lane = n.lane;
      div.style.left = `${p.x}px`;
      div.style.top = `${p.y}px`;
      div.style.setProperty('--lane-color', laneColors[n.lane]);
      div.innerHTML = `<span class="node-id">${n.id}</span><div class="node-date">${escapeHtml(n.date_label || String(n.start_year))}</div><div class="node-title">${escapeHtml(n.title)}</div>`;
      div.addEventListener('click', () => selectNode(n.id));
      nodeLayer.appendChild(div);
    });
  }

  function renderControls() {
    const storyButtons = el('storyButtons');
    storyButtons.innerHTML = '';
    const all = document.createElement('button');
    all.type='button'; all.className='story-button active'; all.dataset.storyId=''; all.textContent='全体表示';
    all.addEventListener('click', () => setStory(null));
    storyButtons.appendChild(all);
    storyData.stories.forEach(s => {
      const b = document.createElement('button');
      b.type='button'; b.className='story-button'; b.dataset.storyId=s.id; b.textContent=`${s.id} ${s.short_title}`;
      b.title=s.title; b.addEventListener('click', () => setStory(s.id));
      storyButtons.appendChild(b);
    });

    const laneToggles = el('laneToggles');
    laneToggles.innerHTML='';
    laneOrder.forEach(lane => {
      const b=document.createElement('button');
      b.type='button'; b.className='lane-button'; b.dataset.lane=lane; b.textContent=laneNames[lane];
      b.style.setProperty('--lane-color',laneColors[lane]);
      b.addEventListener('click', () => toggleLane(lane));
      laneToggles.appendChild(b);
    });
  }

  function setStory(storyId) {
    state.storyId=storyId;
    state.selectedNodeId=null;
    state.selectedLinkId=null;
    document.querySelectorAll('.story-button').forEach(b => b.classList.toggle('active', (b.dataset.storyId || null) === storyId));
    renderStorySummary();
    renderState();
    renderDetailEmpty();
  }

  function toggleLane(lane) {
    if (state.activeLanes.has(lane)) state.activeLanes.delete(lane); else state.activeLanes.add(lane);
    document.querySelectorAll('.lane-button').forEach(b => b.classList.toggle('off', !state.activeLanes.has(b.dataset.lane)));
    renderState();
  }

  function selectNode(id) {
    state.selectedNodeId=id;
    state.selectedLinkId=null;
    renderState();
    renderNodeDetail(nodesById.get(id));
  }

  function selectLink(id) {
    state.selectedLinkId=id;
    state.selectedNodeId=null;
    renderState();
    renderLinkDetail(linksById.get(id));
  }

  function resetSelection() {
    state.selectedNodeId=null; state.selectedLinkId=null;
    renderState(); renderDetailEmpty();
  }

  function renderState() {
    const story = state.storyId ? storiesById.get(state.storyId) : null;
    const storyNodes = story ? new Set(story.node_ids) : null;
    const storyLinks = story ? new Set(story.link_ids) : null;
    let connectedNodes = null, relatedLinks = null;

    if (state.selectedNodeId) {
      relatedLinks = new Set(data.links.filter(l => l.from===state.selectedNodeId || l.to===state.selectedNodeId).map(l=>l.id));
      connectedNodes = new Set([state.selectedNodeId]);
      data.links.filter(l => relatedLinks.has(l.id)).forEach(l => { connectedNodes.add(l.from); connectedNodes.add(l.to); });
    } else if (state.selectedLinkId) {
      const link=linksById.get(state.selectedLinkId);
      relatedLinks=new Set([state.selectedLinkId]);
      connectedNodes=new Set([link.from,link.to]);
    }

    document.querySelectorAll('.node').forEach(nodeEl => {
      const id=nodeEl.dataset.nodeId;
      const n=nodesById.get(id);
      const laneVisible=state.activeLanes.has(n.lane);
      nodeEl.classList.toggle('hidden-lane', !laneVisible);
      let dim = false;
      if (storyNodes && !storyNodes.has(id)) dim=true;
      if (connectedNodes && !connectedNodes.has(id)) dim=true;
      nodeEl.classList.toggle('dim', dim);
      nodeEl.classList.toggle('connected', !!connectedNodes?.has(id));
      nodeEl.classList.toggle('selected', state.selectedNodeId===id || (state.selectedLinkId && connectedNodes?.has(id)));
    });

    document.querySelectorAll('.link-visible').forEach(path => {
      const id=path.dataset.linkId;
      const l=linksById.get(id);
      const laneVisible=state.activeLanes.has(nodesById.get(l.from).lane) && state.activeLanes.has(nodesById.get(l.to).lane);
      path.classList.toggle('link-hidden', !laneVisible);
      let dim=false;
      if (storyLinks && !storyLinks.has(id)) dim=true;
      if (relatedLinks && !relatedLinks.has(id)) dim=true;
      path.classList.toggle('dim',dim);
      path.classList.toggle('related', !!relatedLinks?.has(id));
      path.classList.toggle('selected', state.selectedLinkId===id);
    });
    document.querySelectorAll('.link-hit').forEach(path => {
      const l=linksById.get(path.dataset.linkId);
      const laneVisible=state.activeLanes.has(nodesById.get(l.from).lane) && state.activeLanes.has(nodesById.get(l.to).lane);
      path.classList.toggle('link-hidden',!laneVisible);
    });
    document.querySelectorAll('[data-duration-node]').forEach(bar => {
      const n=nodesById.get(bar.dataset.durationNode);
      bar.style.display=state.activeLanes.has(n.lane)?'':'none';
      bar.style.opacity=(storyNodes && !storyNodes.has(n.id))?'.035':'.15';
    });
  }

  function renderStorySummary() {
    const box=el('storySummary');
    if (!state.storyId) {
      box.innerHTML=`<div class="all-mode"><div class="story-kicker">OVERVIEW</div><h2>1450–1800の全体因果グラフ</h2><p>5 laneを横断して38ノード／35リンクを表示しています。ストーリーを選ぶと、関連ノードとリンクだけを前面化します。</p></div>`;
      return;
    }
    const s=storiesById.get(state.storyId);
    box.innerHTML=`<div class="story-kicker">${s.id} · ${escapeHtml(s.short_title)}</div><h2>${escapeHtml(s.title)}</h2><p><b>問い：</b>${escapeHtml(s.question)}</p><p>${escapeHtml(s.hook)}</p><p class="story-takeaway">→ ${escapeHtml(s.takeaway)}</p>`;
  }

  function sourceHtml(sourceIds=[]) {
    if (!sourceIds.length) return '<p class="muted">出典なし</p>';
    return `<ul class="source-list">${sourceIds.map(id => {
      const s=data.sources[id];
      return s ? `<li><a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">${id} · ${escapeHtml(s.name || s.url)}</a></li>` : `<li>${id}</li>`;
    }).join('')}</ul>`;
  }

  function renderNodeDetail(n) {
    const p=n.place?.label || '—';
    el('detailPanel').innerHTML=`
      <div class="story-kicker">NODE · ${n.id}</div>
      <h2>${escapeHtml(n.title)}</h2>
      <div class="detail-meta"><span class="pill">${escapeHtml(n.date_label || String(n.start_year))}</span><span class="pill">${escapeHtml(laneNames[n.lane] || n.lane)}</span><span class="pill">${escapeHtml(n.kind)}</span></div>
      <h3>概要</h3><p>${escapeHtml(n.summary || '')}</p>
      <h3>場所</h3><p>${escapeHtml(p)}</p>
      ${n.historiography ? `<h3>史学上の注記</h3><p>${escapeHtml(n.historiography)}</p>` : ''}
      <h3>出典</h3>${sourceHtml(n.sources)}
    `;
  }

  function renderLinkDetail(l) {
    const from=nodesById.get(l.from), to=nodesById.get(l.to);
    const warning=l.strength==='debated' ? `<div class="debate-warning">⚠ 研究上議論あり：この矢印は確定した単一因果ではなく、競合理論を伴う説明です。</div>` : '';
    const debate=l.debate_note ? `<h3>論争点</h3><p>${escapeHtml(l.debate_note)}</p>` : '';
    el('detailPanel').innerHTML=`
      <div class="story-kicker">CAUSAL LINK · ${l.id}</div>
      <h2>${escapeHtml(l.label)}</h2>
      <div class="detail-meta"><span class="pill strength-${l.strength}">${l.strength.toUpperCase()}</span><span class="pill">${escapeHtml(l.causal_role)}</span><span class="pill">${escapeHtml(l.type)}</span></div>
      ${warning}
      <h3>因果方向</h3><p><b>${escapeHtml(from.title)}</b><br>↓<br><b>${escapeHtml(to.title)}</b></p>
      <h3>説明</h3><p>${escapeHtml(l.explanation || '')}</p>
      ${debate}
      <h3>出典</h3>${sourceHtml(l.sources)}
    `;
  }

  function renderDetailEmpty() {
    el('detailPanel').innerHTML=`<div class="detail-empty"><div class="detail-icon">↗</div><h2>詳細</h2><p>ノードまたは因果リンクを選択してください。</p><p class="muted">DEBATEDリンクでは「研究上議論あり」を明示します。</p></div>`;
  }

  function escapeHtml(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function escapeAttr(v='') { return escapeHtml(v); }

  function init() {
    el('nodeCount').textContent=data.nodes.length;
    el('linkCount').textContent=data.links.length;
    el('storyCount').textContent=storyData.stories.length;
    layoutNodes();
    drawBase();
    drawLinks();
    drawNodes();
    renderControls();
    renderStorySummary();
    renderState();
    el('resetSelection').addEventListener('click', resetSelection);
  }

  init();
})();
