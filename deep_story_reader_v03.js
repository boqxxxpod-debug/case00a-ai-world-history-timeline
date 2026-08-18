(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  const stories = window.CASE00A_DEEP_STORIES;
  if (!data || !stories) return;

  const nodesById = new Map(data.nodes.map(n => [n.id, n]));
  const detailPanel = () => document.getElementById('detailPanel');
  const summaryBox = () => document.getElementById('storySummary');
  let activeStoryId = null;
  let currentIndex = 0;

  const esc = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function source(id) {
    return data.sources?.[id] || window.CASE00A_DEEP_EXTRA_SOURCES?.[id] || null;
  }

  function sourcesHtml(ids=[]) {
    const links = ids.map(id => {
      const s = source(id);
      return s ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>` : '';
    }).filter(Boolean);
    return links.length ? `<div class="v3-sources">${links.join('')}</div>` : '<p class="muted">このステップの追加出典はありません。</p>';
  }

  function activeStory() { return stories[activeStoryId]; }
  function activeStep() { return activeStory()?.steps?.[currentIndex]; }

  function progressHtml(story) {
    return `<div class="v3-progress" aria-label="${esc(activeStoryId)}のステップ">${story.steps.map((step,i) => `
      <button type="button" class="v3-progress-step ${i===currentIndex?'active':''}" data-v3-step="${i}" title="${esc(step.title)}">
        <span>${i+1}</span><small>${esc(step.short)}</small>
      </button>${i < story.steps.length-1 ? '<i>→</i>' : ''}` ).join('')}</div>`;
  }

  function renderSummary() {
    const story = activeStory();
    const box = summaryBox();
    if (!story || !box) return;
    box.innerHTML = `
      <div class="v3-summary-head">
        <div>
          <div class="story-kicker">${activeStoryId} · じっくり読む版</div>
          <h2>${esc(story.title)}</h2>
          <p>${esc(story.intro)}</p>
          <p class="v3-howto">👉 右で読むのがメイン。気になったら「地図で見る」で左を確認。</p>
        </div>
        <span class="v3-badge">v0.3</span>
      </div>
      ${progressHtml(story)}`;
  }

  function renderStep(index=currentIndex) {
    const story = activeStory();
    if (!story) return;
    currentIndex = Math.max(0, Math.min(story.steps.length-1, index));
    const step = activeStep();
    const panel = detailPanel();
    if (!step || !panel) return;

    const nodeLabels = (step.anchors || []).map(id => nodesById.get(id)?.title || id).join(' / ');
    const bulletHtml = step.bullets?.length ? `<ul class="v3-bullets">${step.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
    const mapNote = step.mapNote ? `<div class="v3-map-note"><b>🧩 地図の線が気になる人へ</b><p>${esc(step.mapNote)}</p></div>` : '';
    const nextStoryButton = step.nextStory
      ? `<button type="button" class="primary" data-v3-next-story="${esc(step.nextStory)}">${esc(step.nextLabel || '次の話へ →')}</button>`
      : `<button type="button" class="primary" data-v3-next ${currentIndex===story.steps.length-1?'disabled':''}>次へ →</button>`;

    panel.innerHTML = `
      <div class="v3-reader">
        <div class="v3-reader-top">
          <div class="story-kicker">${activeStoryId} · ${currentIndex+1}/${story.steps.length}</div>
          <span class="v3-year">${esc(step.year)}</span>
        </div>
        <h2>${esc(step.title)}</h2>
        <div class="v3-body">${step.body.map(p => `<p>${esc(p)}</p>`).join('')}</div>
        ${bulletHtml}
        <div class="v3-ooh">
          <div class="v3-ooh-label">👀 へえポイント</div>
          <p>${esc(step.ooh)}</p>
        </div>
        ${mapNote}
        <div class="v3-transition"><span>↓</span><p>${esc(step.transition)}</p></div>
        <div class="v3-map-box">
          <div><b>地図ではここ</b><small>${esc(nodeLabels || '対応ノードなし')}</small></div>
          <button type="button" data-v3-map>地図で見る</button>
        </div>
        <details class="v3-source-details">
          <summary>根拠・出典も見る</summary>
          ${sourcesHtml(step.sources)}
        </details>
        <div class="v3-nav">
          <button type="button" data-v3-prev ${currentIndex===0?'disabled':''}>← 前へ</button>
          <span>${currentIndex+1} / ${story.steps.length}</span>
          ${nextStoryButton}
        </div>
      </div>`;

    applyFocus(step);
    renderSummary();
  }

  function applyFocus(step) {
    document.querySelectorAll('.node').forEach(el => el.classList.remove('v3-current-node'));
    document.querySelectorAll('.link-visible').forEach(el => el.classList.remove('v3-current-link'));
    (step.anchors || []).forEach(id => document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.classList.add('v3-current-node'));
    (step.links || []).forEach(id => document.querySelector(`.link-visible[data-link-id="${CSS.escape(id)}"]`)?.classList.add('v3-current-link'));
  }

  function scrollMapToCurrent() {
    const anchor = activeStep()?.anchors?.[0];
    if (!anchor) return;
    const target = document.querySelector(`.node[data-node-id="${CSS.escape(anchor)}"]`);
    target?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
  }

  function addReturnBar() {
    if (!activeStoryId) return;
    const panel = detailPanel();
    if (!panel || panel.querySelector('.v3-return')) return;
    const story = activeStory();
    const bar = document.createElement('div');
    bar.className = 'v3-return';
    bar.innerHTML = `<button type="button" data-v3-return>← ${activeStoryId}の続きに戻る</button><span>${currentIndex+1}/${story.steps.length}</span>`;
    panel.prepend(bar);
  }

  function enterStory(id) {
    if (!stories[id]) return;
    activeStoryId = id;
    currentIndex = 0;
    document.body.classList.add('v3-deep-mode');
    renderStep(0);
  }

  function leaveStory() {
    activeStoryId = null;
    currentIndex = 0;
    document.body.classList.remove('v3-deep-mode');
    document.querySelectorAll('.node').forEach(el => el.classList.remove('v3-current-node'));
    document.querySelectorAll('.link-visible').forEach(el => el.classList.remove('v3-current-link'));
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width:1041px){body.v3-deep-mode .workspace{grid-template-columns:minmax(0,1fr) minmax(470px,520px)}}
      body.v3-deep-mode .detail-panel{padding:22px;}
      .v3-summary-head{display:flex;gap:16px;justify-content:space-between;align-items:flex-start}
      .v3-summary-head h2{margin:4px 0 6px;font-size:20px}
      .v3-summary-head p{margin:3px 0;line-height:1.55}
      .v3-howto{font-weight:750;color:#425466!important}
      .v3-badge{flex:0 0 auto;font-size:10px;font-weight:850;padding:4px 8px;border-radius:999px;border:1px solid #d7d2c8;color:#68737d;background:#fff}
      .v3-progress{margin-top:13px;padding-top:12px;border-top:1px solid #ebe7df;display:flex;align-items:center;gap:5px;overflow:auto;scrollbar-width:thin}
      .v3-progress>i{color:#b4ada3;font-style:normal;font-size:10px}
      .v3-progress-step{flex:0 0 auto;width:108px;min-height:50px;border:1px solid #ddd7cd;background:#fff;border-radius:11px;padding:6px 7px;text-align:left;cursor:pointer;display:grid;grid-template-columns:22px 1fr;gap:4px 6px;align-items:center}
      .v3-progress-step>span{grid-row:1/3;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#eef1f4;font-size:10px;font-weight:900}
      .v3-progress-step small{font-size:9px;line-height:1.25;color:#68737d}
      .v3-progress-step.active{border-color:#273b55;box-shadow:0 0 0 2px rgba(39,59,85,.10)}
      .v3-progress-step.active>span{background:#273b55;color:#fff}
      .v3-reader-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
      .v3-year{font-size:11px;color:#68737d;font-weight:800}
      .v3-reader h2{font-size:24px;line-height:1.42;margin:7px 0 16px;letter-spacing:-.015em}
      .v3-body p{font-size:15px;line-height:1.9;margin:0 0 13px}
      .v3-bullets{margin:10px 0 18px;padding-left:20px;display:grid;gap:7px}
      .v3-bullets li{font-size:13.5px;line-height:1.55;font-weight:700}
      .v3-ooh{margin:19px 0;padding:15px 16px;background:#fff1bd;border:1px solid #e6cc6c;border-radius:15px}
      .v3-ooh-label{font-size:12px;font-weight:900;margin-bottom:6px}
      .v3-ooh p{margin:0;font-size:14.5px;line-height:1.72;font-weight:800}
      .v3-map-note{margin:15px 0;padding:13px 14px;background:#f3f0ea;border:1px dashed #c6bcae;border-radius:13px}
      .v3-map-note b{font-size:12px}
      .v3-map-note p{margin:5px 0 0;font-size:12.5px;line-height:1.65;color:#56616d}
      .v3-transition{margin:15px 0 18px;display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:start;color:#56616d}
      .v3-transition>span{font-size:21px;line-height:1}
      .v3-transition p{margin:0;font-size:13.5px;line-height:1.65;font-weight:650}
      .v3-map-box{margin:16px 0;padding:12px 13px;border:1px solid #dcd6cc;border-radius:13px;display:flex;gap:10px;justify-content:space-between;align-items:center;background:#fbfaf6}
      .v3-map-box div{display:grid;gap:3px;min-width:0}.v3-map-box b{font-size:11px}.v3-map-box small{color:#68737d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .v3-map-box button{border:0;background:#273b55;color:#fff;border-radius:999px;padding:8px 11px;cursor:pointer;font-size:11px;font-weight:850;white-space:nowrap}
      .v3-source-details{margin:14px 0 19px;border-top:1px solid #ebe7df;padding-top:12px}.v3-source-details summary{cursor:pointer;font-size:11px;color:#68737d;font-weight:800}
      .v3-sources{display:grid;gap:7px;margin-top:9px}.v3-sources a{font-size:10.5px;color:#315a7d;line-height:1.45}
      .v3-nav{position:sticky;bottom:-22px;margin:20px -22px -22px;padding:12px 17px;border-top:1px solid #e5dfd6;background:rgba(255,253,248,.97);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:space-between;gap:8px}
      .v3-nav button{border:1px solid #d7d2c8;background:#fff;border-radius:999px;padding:8px 12px;cursor:pointer;font-size:12px;font-weight:850}.v3-nav button.primary{background:#273b55;color:#fff;border-color:#273b55}.v3-nav button:disabled{opacity:.35;cursor:default}.v3-nav span{font-size:11px;color:#68737d}
      .v3-current-node{opacity:1!important;z-index:9!important;box-shadow:0 0 0 4px #efac37,0 8px 24px rgba(25,30,35,.24)!important}
      .v3-current-link{opacity:1!important;stroke:#e0922f!important;stroke-width:5.5!important;filter:drop-shadow(0 2px 2px rgba(0,0,0,.20))}
      .v3-return{margin:-5px -5px 14px;padding:9px 10px;border-radius:11px;background:#f1efe9;display:flex;justify-content:space-between;align-items:center;gap:10px}.v3-return button{border:0;background:transparent;color:#273b55;cursor:pointer;font-size:11px;font-weight:900}.v3-return span{font-size:10px;color:#68737d}
      @media (max-width:1040px){body.v3-deep-mode .workspace{display:flex;flex-direction:column}body.v3-deep-mode .detail-panel{order:-1;width:100%;position:relative;top:auto;max-height:none}body.v3-deep-mode .graph-shell{width:100%}}
      @media (max-width:720px){body.v3-deep-mode .detail-panel{padding:16px}.v3-reader h2{font-size:22px}.v3-body p{font-size:14.5px}.v3-nav{bottom:-16px;margin-left:-16px;margin-right:-16px;margin-bottom:-16px}.v3-progress-step{width:96px}.v3-map-box{align-items:flex-start;flex-direction:column}.v3-ooh{padding:14px}.v3-summary-head{flex-direction:column}.v3-badge{align-self:flex-start}}
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', e => {
    const storyBtn = e.target.closest?.('.story-button');
    if (storyBtn) {
      const id = storyBtn.dataset.storyId || null;
      if (id && stories[id]) queueMicrotask(() => enterStory(id));
      else queueMicrotask(leaveStory);
      return;
    }

    const next = e.target.closest?.('[data-v3-next]');
    if (next) { e.preventDefault(); e.stopPropagation(); renderStep(currentIndex+1); return; }
    const prev = e.target.closest?.('[data-v3-prev]');
    if (prev) { e.preventDefault(); e.stopPropagation(); renderStep(currentIndex-1); return; }
    const stepBtn = e.target.closest?.('[data-v3-step]');
    if (stepBtn) { e.preventDefault(); e.stopPropagation(); renderStep(Number(stepBtn.dataset.v3Step)); return; }
    if (e.target.closest?.('[data-v3-map]')) { e.preventDefault(); e.stopPropagation(); scrollMapToCurrent(); return; }
    if (e.target.closest?.('[data-v3-return]')) { e.preventDefault(); e.stopPropagation(); renderStep(currentIndex); return; }

    const nextStory = e.target.closest?.('[data-v3-next-story]');
    if (nextStory) {
      e.preventDefault(); e.stopPropagation();
      const target = document.querySelector(`.story-button[data-story-id="${CSS.escape(nextStory.dataset.v3NextStory)}"]`);
      target?.click();
      return;
    }

    if (activeStoryId && (e.target.closest?.('.node') || e.target.closest?.('.link-hit'))) queueMicrotask(addReturnBar);
  });

  installStyles();
})();