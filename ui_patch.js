(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  const storyData = window.CASE00A_STORIES;
  if (!data || !storyData) return;

  const nodesById = new Map(data.nodes.map(n => [n.id, n]));
  const linksById = new Map(data.links.map(l => [l.id, l]));
  const storiesById = new Map(storyData.stories.map(s => [s.id, s]));
  const laneNames = { printing:'印刷', reformation:'宗教改革', state:'国家・政治', science:'科学', industry:'産業' };
  const kindNames = { event:'できごと', process:'長い変化', institution:'制度', publication:'本・出版', technology:'技術', condition:'背景条件' };
  const strengthNames = { strong:'かなり強い', medium:'中くらい', debated:'議論あり' };

  const escapeHtml = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const escapeAttr = escapeHtml;
  const detail = () => document.getElementById('detailPanel');

  function sourceHtml(sourceIds=[]) {
    if (!sourceIds.length) return '<p class="muted">このノードには出典情報がありません。</p>';
    return `<ul class="source-list">${sourceIds.map(id => {
      const s = data.sources[id];
      return s ? `<li><a href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">${id} · ${escapeHtml(s.name || s.url)}</a></li>` : `<li>${id}</li>`;
    }).join('')}</ul>`;
  }

  function relationHtml(n) {
    const incoming = data.links.filter(l => l.to === n.id);
    const outgoing = data.links.filter(l => l.from === n.id);

    const list = (links, direction) => {
      if (!links.length) return '<p class="muted">このMVPでは直接つないでいる矢印はありません。</p>';
      return `<ul class="relation-list">${links.map(l => {
        const otherId = direction === 'in' ? l.from : l.to;
        const other = nodesById.get(otherId);
        return `<li>
          <button type="button" class="relation-jump" data-jump-node="${escapeAttr(otherId)}">
            <span class="relation-title">${escapeHtml(other?.title || otherId)}</span>
            <span class="relation-label">${direction === 'in' ? '→' : '→'} ${escapeHtml(l.label || '')}</span>
            <span class="relation-strength ${escapeAttr(l.strength)}">${escapeHtml(strengthNames[l.strength] || l.strength)}</span>
          </button>
        </li>`;
      }).join('')}</ul>`;
    };

    return `
      <h3>この前に何があった？</h3>${list(incoming, 'in')}
      <h3>このあと何につながる？</h3>${list(outgoing, 'out')}
    `;
  }

  function renderNodeDetail(n) {
    if (!n || !detail()) return;
    const place = n.place?.label || '—';
    detail().innerHTML = `
      <div class="story-kicker">${n.id} · ${escapeHtml(laneNames[n.lane] || n.lane)}</div>
      <h2>${escapeHtml(n.title)}</h2>
      <div class="detail-meta">
        <span class="pill">${escapeHtml(n.date_label || String(n.start_year))}</span>
        <span class="pill">${escapeHtml(kindNames[n.kind] || n.kind)}</span>
      </div>
      <h3>何が起きた？</h3>
      <p class="detail-lead">${escapeHtml(n.summary || '')}</p>
      <h3>どこ？</h3><p>${escapeHtml(place)}</p>
      ${relationHtml(n)}
      ${n.historiography ? `<div class="history-note"><h3>ここは少し注意</h3><p>${escapeHtml(n.historiography)}</p></div>` : ''}
      <h3>もっと確かめたい人へ</h3>${sourceHtml(n.sources)}
    `;
  }

  function renderLinkDetail(l) {
    if (!l || !detail()) return;
    const from = nodesById.get(l.from);
    const to = nodesById.get(l.to);
    const warning = l.strength === 'debated'
      ? '<div class="debate-warning">⚠ このつながりは「有力な見方のひとつ」。歴史家の間でも議論があります。</div>'
      : '';
    detail().innerHTML = `
      <div class="story-kicker">つながり · ${l.id}</div>
      <h2>${escapeHtml(from?.title || l.from)} → ${escapeHtml(to?.title || l.to)}</h2>
      <div class="detail-meta">
        <span class="pill">${escapeHtml(strengthNames[l.strength] || l.strength)}</span>
        <span class="pill">${escapeHtml(l.causal_role || '')}</span>
      </div>
      ${warning}
      <h3>どうつながる？</h3><p class="detail-lead">${escapeHtml(l.explanation || l.label || '')}</p>
      ${l.debate_note ? `<div class="history-note"><h3>どこが議論になる？</h3><p>${escapeHtml(l.debate_note)}</p></div>` : ''}
      <h3>もっと確かめたい人へ</h3>${sourceHtml(l.sources)}
    `;
  }

  function renderEmpty() {
    if (!detail()) return;
    detail().innerHTML = `
      <div class="detail-empty">
        <div class="detail-icon">↗</div>
        <h2>気になる出来事をタップ</h2>
        <p>「何が起きた？」「前に何があった？」「このあと何につながる？」まで見られます。</p>
        <p class="muted">矢印をタップすると、その因果関係も読めます。</p>
      </div>`;
  }

  function renderStory(storyId) {
    const box = document.getElementById('storySummary');
    if (!box) return;
    if (!storyId) {
      box.innerHTML = `<div class="all-mode"><div class="story-kicker">まずは全体を眺める</div><h2>1450〜1800年、何がどうつながった？</h2><p>38の出来事と35本の矢印を並べています。気になる出来事をタップしてもいいし、上のストーリーから一本ずつ追ってもOKです。</p></div>`;
      return;
    }
    const s = storiesById.get(storyId);
    if (!s) return;
    box.innerHTML = `
      <div class="story-kicker">${s.id} · ${escapeHtml(s.short_title)}</div>
      <h2>${escapeHtml(s.title)}</h2>
      <p><b>ここを見る：</b>${escapeHtml(s.question)}</p>
      <p>${escapeHtml(s.hook)}</p>
      <p class="story-takeaway"><b>ざっくり言うと：</b> ${escapeHtml(s.takeaway)}</p>`;
  }

  function casualizeStaticCopy() {
    const headerP = document.querySelector('.app-header p');
    if (headerP) headerP.textContent = '1450〜1800年のヨーロッパを、出来事ではなく「つながり」で眺めてみる。';

    const stats = document.querySelector('.stats');
    if (stats) stats.innerHTML = '<span><b id="nodeCount">38</b> できごと</span><span><b id="linkCount">35</b> つながり</span><span><b id="storyCount">6</b> ストーリー</span>';

    const labels = document.querySelectorAll('.control-label');
    if (labels[0]) labels[0].textContent = 'どの流れを見る？';
    if (labels[1]) labels[1].textContent = 'テーマを絞る';

    const legend = document.querySelector('.legend');
    if (legend) legend.innerHTML = '<span><i class="legend-line strong"></i> 強め</span><span><i class="legend-line medium"></i> 中くらい</span><span><i class="legend-line debated"></i> 議論あり</span>';

    const help = document.querySelector('.graph-help');
    if (help) help.innerHTML = '<span>● 出来事をタップ → 前後のつながりを見る</span><span>↗ 矢印をタップ → なぜつながるか読む</span><button id="resetSelection" class="text-button" type="button">いったん戻す</button>';

    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = '歴史は一本線ではありません。矢印の強さや「議論あり」も含めて眺めてください。';
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .detail-lead { font-size: 1.02rem; line-height: 1.85; }
      .relation-list { list-style:none; padding:0; margin:8px 0 18px; display:grid; gap:8px; }
      .relation-list li { margin:0; }
      .relation-jump { width:100%; text-align:left; border:1px solid rgba(90,105,120,.18); border-radius:12px; background:rgba(255,255,255,.72); padding:10px 12px; cursor:pointer; display:grid; gap:4px; }
      .relation-jump:hover { border-color:rgba(60,80,100,.38); transform:translateY(-1px); }
      .relation-title { font-weight:700; line-height:1.4; }
      .relation-label { font-size:.86rem; color:#56616d; line-height:1.45; }
      .relation-strength { width:max-content; font-size:.72rem; font-weight:700; border-radius:999px; padding:2px 7px; background:#eef2f5; }
      .relation-strength.strong { color:#26313b; }
      .relation-strength.medium { color:#63707c; }
      .relation-strength.debated { color:#9b4e27; background:#fff0e8; }
      .history-note { margin:16px 0; padding:12px 14px; border-radius:12px; background:#f6f3ed; }
      .history-note h3 { margin-top:0; }
      @media (max-width: 720px) {
        .detail-lead { font-size:1rem; }
        .relation-jump { padding:12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function installHandlers() {
    document.addEventListener('click', (e) => {
      const node = e.target.closest?.('.node');
      if (node?.dataset.nodeId) {
        queueMicrotask(() => renderNodeDetail(nodesById.get(node.dataset.nodeId)));
        return;
      }

      const link = e.target.closest?.('.link-hit');
      if (link?.dataset.linkId) {
        queueMicrotask(() => renderLinkDetail(linksById.get(link.dataset.linkId)));
        return;
      }

      const jump = e.target.closest?.('.relation-jump');
      if (jump?.dataset.jumpNode) {
        const target = document.querySelector(`.node[data-node-id="${CSS.escape(jump.dataset.jumpNode)}"]`);
        target?.click();
        target?.scrollIntoView({ behavior:'smooth', block:'center', inline:'center' });
        return;
      }

      const storyButton = e.target.closest?.('.story-button');
      if (storyButton) {
        queueMicrotask(() => {
          renderStory(storyButton.dataset.storyId || null);
          renderEmpty();
        });
        return;
      }

      if (e.target.id === 'resetSelection') {
        queueMicrotask(renderEmpty);
      }
    });
  }

  casualizeStaticCopy();
  installStyles();
  renderStory(null);
  renderEmpty();
  installHandlers();
})();
