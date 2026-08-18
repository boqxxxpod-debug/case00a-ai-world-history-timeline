(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  const kindLabels = {
    number:'📏 数字で見ると',
    scale:'🔥 どれくらい？',
    twist:'😮 え、そうなの？',
    debate:'⚖️ ここ、割れてます',
    system:'🧠 仕組みで見ると',
    detail:'🔎 もう一段だけ'
  };

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function currentStoryId() {
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

  function getSource(id) {
    return window.CASE00A_DATA?.sources?.[id] || window.CASE00A_DEEP_EXTRA_SOURCES?.[id] || null;
  }

  function sourcesHtml(ids=[]) {
    const links = ids.map(id => {
      const s = getSource(id);
      if (!s) return '';
      return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name || id)}</a>`;
    }).filter(Boolean).join('');
    if (!links) return '';
    return `<details class="v05-card-sources"><summary>ほんと？ 根拠を見る</summary><div>${links}</div></details>`;
  }

  function cardHtml(card) {
    const kind = card.kind || 'detail';
    return `
      <section class="v05-depth-card v05-${esc(kind)}">
        <div class="v05-depth-label">${kindLabels[kind] || kindLabels.detail}</div>
        <h3>${esc(card.title || '')}</h3>
        <p>${esc(card.text || '')}</p>
        ${sourcesHtml(card.sources)}
      </section>`;
  }

  function inject() {
    const panel = document.getElementById('detailPanel');
    const reader = panel?.querySelector('.deep-reader');
    if (!reader) return;

    const storyId = currentStoryId();
    const story = stories[storyId];
    if (!story?.steps) return;
    const idx = currentStepIndex();
    const step = story.steps[idx];
    if (!step?.v05cards?.length) {
      reader.querySelectorAll('.v05-depth-wrap').forEach(el => el.remove());
      return;
    }

    const key = `${storyId}:${idx}:${step.v05cards.length}`;
    if (reader.querySelector(`.v05-depth-wrap[data-v05-key="${CSS.escape(key)}"]`)) return;
    reader.querySelectorAll('.v05-depth-wrap').forEach(el => el.remove());

    const wrap = document.createElement('div');
    wrap.className = 'v05-depth-wrap';
    wrap.dataset.v05Key = key;
    wrap.innerHTML = step.v05cards.map(cardHtml).join('');

    const ooh = reader.querySelector('.deep-ooh');
    const transition = reader.querySelector('.deep-transition');
    if (ooh) ooh.insertAdjacentElement('afterend', wrap);
    else if (transition) transition.insertAdjacentElement('beforebegin', wrap);
    else reader.appendChild(wrap);
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .v05-depth-wrap { display:grid; gap:10px; margin:12px 0 16px; }
      .v05-depth-card { padding:13px 14px; border-radius:14px; border:1px solid #d7d2c8; background:#fff; }
      .v05-depth-card h3 { margin:3px 0 7px !important; font-size:14px !important; letter-spacing:0 !important; color:#25313b !important; line-height:1.45; }
      .v05-depth-card p { margin:0; font-size:13px; line-height:1.75; }
      .v05-depth-label { font-size:10.5px; font-weight:900; letter-spacing:.02em; color:#625d56; }
      .v05-number { background:#eef6fb; border-color:#cbdde9; }
      .v05-scale { background:#eef7f0; border-color:#cfe1d1; }
      .v05-twist { background:#fff6df; border-color:#ead89c; }
      .v05-debate { background:#f8eef3; border-color:#dfcbd4; }
      .v05-system { background:#f0f1fa; border-color:#d4d6e8; }
      .v05-detail { background:#f7f5f0; border-color:#ded9cf; }
      .v05-card-sources { margin-top:9px; padding-top:8px; border-top:1px dashed rgba(70,70,70,.18); }
      .v05-card-sources summary { cursor:pointer; font-size:10.5px; font-weight:800; color:#6f6a63; }
      .v05-card-sources div { display:grid; gap:5px; margin-top:7px; }
      .v05-card-sources a { font-size:10px; line-height:1.4; color:#315a7d; }
      @media (max-width:720px) {
        .v05-depth-card { padding:12px; }
        .v05-depth-card p { font-size:12.8px; }
      }
    `;
    document.head.appendChild(style);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(inject));
  observer.observe(document.body, {childList:true, subtree:true});
  document.addEventListener('click', () => setTimeout(inject, 0), true);
  installStyles();
  inject();
})();