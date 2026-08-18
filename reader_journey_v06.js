(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  const order = ['ST01','ST02','ST03','ST04','ST05','ST06'];
  const meta = {
    ST01:{ short:'印刷で宗教が爆速？', bridgeIn:null, bridgeType:'START', bridgeOut:'印刷で増幅された宗教改革は、次に「どの地域を、どの宗派で治める？」という政治の問題になります。' },
    ST02:{ short:'宗教で国が変わる？', bridgeIn:'印刷で広がった宗教改革が、信仰の話だけでは終わらず、教育・行政・同盟・戦争まで巻き込みます。', bridgeType:'つながる', bridgeOut:'長い宗教対立と戦争を見ると、次に気になるのは「こんなに高い戦争代を、国はどう払った？」です。' },
    ST03:{ short:'戦争代、どう払う？', bridgeIn:'ST02で出てきた「戦争には税・役所・信用が要る」を、英国にズームしてお金の仕組みから見ます。', bridgeType:'ズーム', bridgeOut:'ここで道はいったん枝分かれ。金融革命が科学革命を起こすわけではありません。同じ時代に、もう一方では「知識の作り方・広げ方」が変わっていました。' },
    ST04:{ short:'科学は工場につながる？', bridgeIn:'ここはST03からの直接因果ではなく、同じ近世ヨーロッパを走っていた「もう一本の変化」に視点を移します。', bridgeType:'並行ルート', bridgeOut:'知識のネットワークが変わったとしても、工場は本から直接生まれません。次はもっと現場へ降りて、炭鉱の水から蒸気機関を追います。' },
    ST05:{ short:'炭鉱の水 → 蒸気', bridgeIn:'ST04の「知識の回路」から、今度は現場のボトルネックへ。科学理論を工場へコピペするのではなく、困りごと→改良→商売を見ます。', bridgeType:'現場へ', bridgeOut:'蒸気機関だけでは産業革命になりません。最後は、石炭・賃金・市場・帝国・繊維・工場・金融・知識を全部同じ画面へ戻します。' },
    ST06:{ short:'産業革命、結局なに？', bridgeIn:'ここまで別々に見てきた技術・市場・金融・知識を、最後に「因果のハブ」へ合流させます。', bridgeType:'合流', bridgeOut:'6本を一周したら、ST01へ戻ってみる。最初は一本に見えた矢印が、今度は分岐や合流として見えるはずです。' }
  };

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

  function totalSteps() {
    return order.reduce((sum,id) => sum + (stories[id]?.steps?.length || 0), 0);
  }

  function globalStep(storyId, idx) {
    let n = idx + 1;
    for (const id of order) {
      if (id === storyId) break;
      n += stories[id]?.steps?.length || 0;
    }
    return n;
  }

  function clickStory(id) {
    const btn = document.querySelector(`.story-button[data-story-id="${CSS.escape(id)}"]`);
    btn?.click();
  }

  function ensureJourneyBar() {
    let bar = document.getElementById('v06Journey');
    if (bar) return bar;
    const summary = document.getElementById('storySummary');
    if (!summary) return null;
    bar = document.createElement('section');
    bar.id = 'v06Journey';
    bar.className = 'v06-journey card';
    summary.insertAdjacentElement('beforebegin', bar);
    return bar;
  }

  function renderJourney() {
    const bar = ensureJourneyBar();
    if (!bar) return;
    const sid = activeStoryId();
    const idx = currentStepIndex();
    const total = totalSteps();

    const chapters = order.map((id,i) => {
      const active = id === sid;
      const done = sid && order.indexOf(id) < order.indexOf(sid);
      return `<button type="button" class="v06-chapter ${active?'active':''} ${done?'done':''}" data-v06-story="${id}">
        <span>${done?'✓':i+1}</span><small>${esc(meta[id].short)}</small>
      </button>`;
    }).join('<i>→</i>');

    if (!sid) {
      bar.innerHTML = `
        <div class="v06-journey-head">
          <div><b>6章で、1450→1800を一周</b><small>49ステップ。最初から読んでも、気になる章だけでもOK。</small></div>
          <button type="button" class="v06-start" data-v06-story="ST01">最初から読む →</button>
        </div>
        <div class="v06-chapters">${chapters}</div>`;
      return;
    }

    const chapterNo = order.indexOf(sid) + 1;
    const g = globalStep(sid, idx);
    bar.innerHTML = `
      <div class="v06-journey-head">
        <div><b>第${chapterNo}章 / 6 · ${esc(meta[sid].short)}</b><small>全体では ${g} / ${total} ステップ</small></div>
        <div class="v06-global-meter"><span style="width:${Math.max(2,(g/total)*100)}%"></span></div>
      </div>
      <div class="v06-chapters">${chapters}</div>`;
  }

  function renderBridgeIn() {
    const sid = activeStoryId();
    if (!sid || sid === 'ST01') return;
    const idx = currentStepIndex();
    const panel = document.getElementById('detailPanel');
    const reader = panel?.querySelector('.deep-reader');
    if (!reader) return;
    reader.querySelectorAll('.v06-bridge-in').forEach(el => el.remove());
    if (idx !== 0) return;

    const box = document.createElement('div');
    box.className = 'v06-bridge-in';
    box.innerHTML = `
      <div class="v06-bridge-label">↪ 前の章からどう来た？ <span>${esc(meta[sid].bridgeType)}</span></div>
      <p>${esc(meta[sid].bridgeIn)}</p>`;
    const body = reader.querySelector('.deep-body');
    if (body) body.insertAdjacentElement('beforebegin', box);
    else reader.prepend(box);
  }

  function renderBridgeOut() {
    const sid = activeStoryId();
    if (!sid) return;
    const story = stories[sid];
    const idx = currentStepIndex();
    const reader = document.querySelector('#detailPanel .deep-reader');
    if (!reader || !story?.steps?.length) return;
    reader.querySelectorAll('.v06-bridge-out').forEach(el => el.remove());
    if (idx !== story.steps.length - 1) return;

    const currentPos = order.indexOf(sid);
    const nextId = currentPos >= 0 && currentPos < order.length - 1 ? order[currentPos+1] : 'ST01';
    const box = document.createElement('div');
    box.className = 'v06-bridge-out';
    box.innerHTML = `
      <div class="v06-bridge-label">🧭 ここから次へ</div>
      <p>${esc(meta[sid].bridgeOut)}</p>
      <button type="button" data-v06-story="${nextId}">${sid === 'ST06' ? 'もう一周する ↻' : `第${currentPos+2}章へ →`}</button>`;
    const nav = reader.querySelector('.deep-nav');
    if (nav) nav.insertAdjacentElement('beforebegin', box);
    else reader.appendChild(box);
  }

  function renderChapterContext() {
    const sid = activeStoryId();
    const summary = document.getElementById('storySummary');
    if (!sid || !summary) return;
    summary.querySelectorAll('.v06-context').forEach(el => el.remove());
    const pos = order.indexOf(sid);
    const prev = pos > 0 ? order[pos-1] : null;
    const next = pos < order.length-1 ? order[pos+1] : null;
    const row = document.createElement('div');
    row.className = 'v06-context';
    row.innerHTML = `
      ${prev ? `<button type="button" data-v06-story="${prev}"><span>← 前</span><b>${esc(meta[prev].short)}</b></button>` : '<div class="v06-context-spacer"></div>'}
      <div class="v06-context-now"><span>いまここ</span><b>${esc(meta[sid].short)}</b></div>
      ${next ? `<button type="button" data-v06-story="${next}"><span>次 →</span><b>${esc(meta[next].short)}</b></button>` : `<button type="button" data-v06-story="ST01"><span>一周したら ↻</span><b>${esc(meta.ST01.short)}</b></button>`}`;
    summary.appendChild(row);
  }

  function renderAll() {
    renderJourney();
    renderChapterContext();
    renderBridgeIn();
    renderBridgeOut();
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .v06-journey { margin-top:14px; padding:13px 15px; }
      .v06-journey-head { display:flex; gap:14px; align-items:center; justify-content:space-between; }
      .v06-journey-head > div:first-child { display:grid; gap:2px; }
      .v06-journey-head b { font-size:13px; }
      .v06-journey-head small { color:#777067; font-size:10.5px; }
      .v06-start { border:0; background:#273b55; color:#fff; border-radius:999px; padding:8px 12px; font-size:11px; font-weight:900; cursor:pointer; }
      .v06-global-meter { flex:0 0 160px; height:7px; overflow:hidden; border-radius:999px; background:#e8e3da; }
      .v06-global-meter span { display:block; height:100%; background:#6c8066; border-radius:999px; }
      .v06-chapters { display:flex; align-items:center; gap:5px; overflow:auto; margin-top:11px; padding-top:10px; border-top:1px solid #ece7de; scrollbar-width:thin; }
      .v06-chapters > i { font-style:normal; color:#bbb4aa; font-size:10px; }
      .v06-chapter { flex:0 0 120px; min-height:42px; border:1px solid #ddd7cd; background:#fff; border-radius:10px; padding:6px 7px; text-align:left; cursor:pointer; display:grid; grid-template-columns:22px 1fr; gap:6px; align-items:center; }
      .v06-chapter > span { width:22px; height:22px; display:grid; place-items:center; border-radius:50%; background:#eef1f4; font-size:10px; font-weight:900; }
      .v06-chapter small { font-size:9px; line-height:1.25; color:#625d56; }
      .v06-chapter.active { border-color:#273b55; box-shadow:0 0 0 2px rgba(39,59,85,.09); }
      .v06-chapter.active > span { background:#273b55; color:#fff; }
      .v06-chapter.done > span { background:#6f8a70; color:#fff; }
      .v06-context { display:grid; grid-template-columns:1fr auto 1fr; gap:8px; align-items:stretch; margin-top:12px; padding-top:11px; border-top:1px dashed #ddd6ca; }
      .v06-context button,.v06-context-now { border:1px solid #ddd7cd; border-radius:10px; background:#fff; padding:7px 9px; display:grid; gap:2px; min-width:0; text-align:left; }
      .v06-context button { cursor:pointer; }
      .v06-context span { color:#837b71; font-size:9px; font-weight:800; }
      .v06-context b { font-size:10px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .v06-context-now { background:#f3f0e8; min-width:120px; text-align:center; }
      .v06-context-now span,.v06-context-now b { text-align:center; }
      .v06-context-spacer { min-width:1px; }
      .v06-bridge-in,.v06-bridge-out { margin:10px 0 16px; padding:13px 14px; border-radius:14px; background:#eef4f2; border:1px solid #cadbd5; }
      .v06-bridge-out { background:#f4efe6; border-color:#dfd2bd; margin-top:20px; }
      .v06-bridge-label { font-size:11px; font-weight:900; margin-bottom:6px; }
      .v06-bridge-label span { display:inline-block; margin-left:5px; padding:2px 6px; border-radius:999px; background:rgba(255,255,255,.75); border:1px solid rgba(80,80,80,.14); font-size:9px; }
      .v06-bridge-in p,.v06-bridge-out p { margin:0; font-size:12.8px; line-height:1.7; }
      .v06-bridge-out button { margin-top:10px; border:0; border-radius:999px; background:#273b55; color:#fff; padding:8px 12px; font-size:11px; font-weight:900; cursor:pointer; }
      @media (max-width:720px) {
        .v06-journey-head { align-items:flex-start; flex-direction:column; }
        .v06-global-meter { width:100%; flex-basis:7px; }
        .v06-chapter { flex-basis:105px; }
        .v06-context { grid-template-columns:1fr 1fr; }
        .v06-context-now { grid-column:1 / -1; grid-row:1; }
        .v06-context-spacer { display:none; }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', e => {
    const target = e.target.closest?.('[data-v06-story]');
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      clickStory(target.dataset.v06Story);
      return;
    }
    setTimeout(renderAll, 0);
  }, true);

  const observer = new MutationObserver(() => requestAnimationFrame(renderAll));
  observer.observe(document.body, { childList:true, subtree:true });
  installStyles();
  renderAll();
})();