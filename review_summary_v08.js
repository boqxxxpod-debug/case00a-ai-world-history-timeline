(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  const order = ['ST01','ST02','ST03','ST04','ST05','ST06'];
  const chapters = {
    ST01:{
      label:'印刷で宗教が爆速？',
      line:'印刷インフラの上に宗教論争が乗り、宗教改革と印刷市場がお互いを大きくした。',
      wow:'印刷は「宗教改革の原因」というより、すでにあった不満や論争を増幅する装置だった。',
      lens:'原因より「増幅器」で見る'
    },
    ST02:{
      label:'宗教で国が変わる？',
      line:'宗派分裂は、信仰だけでなく教育・行政・同盟・戦争を巻き込み、統治のしかたを変えた。',
      wow:'1648年を「近代国家の誕生日」とする説明は、分かりやすいけれど単純すぎる。',
      lens:'事件より「長い制度変化」で見る'
    },
    ST03:{
      label:'戦争代、どう払う？',
      line:'高額な戦争を続けるため、議会・税・公信用・国債・銀行が組み合わさっていった。',
      wow:'イングランド銀行の出発点をたどると、工場より先に「対仏戦争の資金」が出てくる。',
      lens:'制度を「困りごとの答え」として見る'
    },
    ST04:{
      label:'科学は工場につながる？',
      line:'印刷・観測・数学・学会・雑誌が、知識をためて比較し、共有する回路を変えた。',
      wow:'ニュートンから工場へ直通したわけではない。科学と産業の間には職人・技術者・出版・試行錯誤がいる。',
      lens:'直線より「知識の生態系」で見る'
    },
    ST05:{
      label:'炭鉱の水 → 蒸気',
      line:'炭鉱の排水という現場の困りごとが、ニューコメン→ワット→商業化という改良の連鎖を生んだ。',
      wow:'世界を変えた蒸気機関も、最初は「水をくみ出したい」というかなり地味な問題から始まった。',
      lens:'発明より「ボトルネックのリレー」で見る'
    },
    ST06:{
      label:'産業革命、結局なに？',
      line:'石炭・賃金・市場・帝国・繊維・工場・鉄・蒸気・金融・知識が、18世紀後半の英国で重なった。',
      wow:'「真の原因を1つ」に決めるより、強い因果・背景条件・論争中の因果を分けて見るほうが分かる。',
      lens:'単独原因より「合流点」で見る'
    }
  };

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function totalSteps() {
    return order.reduce((sum,id) => sum + (stories[id]?.steps?.length || 0), 0);
  }

  function clickStory(id) {
    const btn = document.querySelector(`.story-button[data-story-id="${CSS.escape(id)}"]`);
    btn?.click();
    const review = document.getElementById('v08Review');
    if (review) review.hidden = true;
    setTimeout(() => document.getElementById('storySummary')?.scrollIntoView({behavior:'smooth',block:'start'}), 0);
  }

  function ensureButton() {
    if (document.getElementById('v08ReviewButton')) return;
    const controls = document.querySelector('.controls .control-row:first-child .button-wrap');
    if (!controls) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'v08ReviewButton';
    btn.className = 'story-button v08-review-button';
    btn.textContent = '🧭 6章まとめ';
    controls.appendChild(btn);
  }

  function ensurePanel() {
    let panel = document.getElementById('v08Review');
    if (panel) return panel;
    const storySummary = document.getElementById('storySummary');
    if (!storySummary) return null;
    panel = document.createElement('section');
    panel.id = 'v08Review';
    panel.className = 'v08-review card';
    panel.hidden = true;
    storySummary.insertAdjacentElement('afterend', panel);
    return panel;
  }

  function renderPanel() {
    const panel = ensurePanel();
    if (!panel) return;
    const cards = order.map((id,i) => {
      const c = chapters[id];
      return `<article class="v08-chapter-card">
        <div class="v08-card-top"><span>${i+1}</span><small>${esc(id)}</small></div>
        <h3>${esc(c.label)}</h3>
        <div class="v08-card-section"><b>何が起きた？</b><p>${esc(c.line)}</p></div>
        <div class="v08-card-section wow"><b>😮 ここが残る</b><p>${esc(c.wow)}</p></div>
        <div class="v08-card-lens">🕶️ ${esc(c.lens)}</div>
        <button type="button" data-v08-story="${id}">この章に戻る →</button>
      </article>`;
    }).join('');

    panel.innerHTML = `
      <div class="v08-head">
        <div>
          <div class="story-kicker">MVP v0.8 · 6章まとめ</div>
          <h2>結局、この350年で何がつながった？</h2>
          <p>細かい年号を覚えるより、<b>「因果の見方」</b>を6つ持ち帰るための振り返りです。</p>
        </div>
        <button type="button" class="v08-close" data-v08-close>閉じる ×</button>
      </div>

      <div class="v08-six-lines">
        <div class="v08-six-title">350年を6行で</div>
        <ol>
          <li><b>印刷</b>が情報の流れを変え、宗教論争を巨大化させる。</li>
          <li><b>宗派分裂</b>が、統治・教育・同盟・戦争の問題になる。</li>
          <li><b>戦争</b>が、税・信用・国債・銀行の新しい仕組みを要求する。</li>
          <li>同時代に<b>科学の知識回路</b>も、観測・出版・学会を通じて変わる。</li>
          <li><b>現場の技術</b>は、炭鉱の困りごと→改良→商業化で育つ。</li>
          <li>最後に市場・資源・技術・制度・知識が<b>産業革命という合流点</b>で重なる。</li>
        </ol>
      </div>

      <div class="v08-big-idea">
        <span>💡</span>
        <div><b>この年表で一番持ち帰りたいこと</b><p>歴史は「AがBを起こした」の一本線より、<strong>増幅・分岐・並行・ボトルネック・合流</strong>として見ると急に面白くなる。</p></div>
      </div>

      <div class="v08-grid">${cards}</div>

      <div class="v08-footer-note">
        <div><b>${totalSteps()}ステップ / 38ノード / 35リンク</b><span>まとめ画面でも、基準グラフそのものは増やしていません。</span></div>
        <button type="button" data-v08-story="ST01">最初からもう一周 ↻</button>
      </div>`;
  }

  function openPanel() {
    renderPanel();
    const panel = document.getElementById('v08Review');
    if (!panel) return;
    panel.hidden = false;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .v08-review-button { border-style:dashed !important; font-weight:900 !important; }
      .v08-review { margin-top:14px; padding:20px; }
      .v08-head { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; }
      .v08-head h2 { margin:5px 0 6px; font-size:24px; }
      .v08-head p { margin:0; color:#655f57; font-size:13px; line-height:1.6; }
      .v08-close { flex:0 0 auto; border:1px solid #d7d2c8; background:#fff; border-radius:999px; padding:7px 10px; cursor:pointer; color:#5f5a53; font-size:11px; font-weight:800; }
      .v08-six-lines { margin-top:18px; padding:15px 16px; background:#f4f0e7; border:1px solid #dfd6c8; border-radius:14px; }
      .v08-six-title { font-size:11px; font-weight:900; margin-bottom:7px; }
      .v08-six-lines ol { margin:0; padding-left:23px; display:grid; gap:5px; }
      .v08-six-lines li { font-size:13px; line-height:1.6; }
      .v08-big-idea { margin:14px 0 18px; padding:14px 15px; background:#fff6d9; border:1px solid #ead89a; border-radius:14px; display:flex; gap:10px; align-items:flex-start; }
      .v08-big-idea > span { font-size:22px; }
      .v08-big-idea b { font-size:12px; }
      .v08-big-idea p { margin:4px 0 0; font-size:14px; line-height:1.65; }
      .v08-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:11px; }
      .v08-chapter-card { min-width:0; padding:14px; border:1px solid #ddd7cd; border-radius:14px; background:#fff; display:flex; flex-direction:column; }
      .v08-card-top { display:flex; align-items:center; justify-content:space-between; }
      .v08-card-top > span { width:26px; height:26px; display:grid; place-items:center; border-radius:50%; background:#273b55; color:#fff; font-size:11px; font-weight:900; }
      .v08-card-top small { color:#8a8277; font-size:9px; font-weight:800; }
      .v08-chapter-card h3 { margin:9px 0 10px; font-size:16px; line-height:1.4; }
      .v08-card-section { margin-top:7px; }
      .v08-card-section b { font-size:10.5px; color:#625d56; }
      .v08-card-section p { margin:3px 0 0; font-size:12.5px; line-height:1.65; }
      .v08-card-section.wow { padding:9px 10px; background:#faf4df; border-radius:10px; }
      .v08-card-lens { margin:10px 0 12px; padding-top:9px; border-top:1px dashed #e1dcd3; font-size:11px; font-weight:900; color:#455365; }
      .v08-chapter-card > button { margin-top:auto; align-self:flex-start; border:0; background:#eef1f4; color:#273b55; border-radius:999px; padding:7px 9px; cursor:pointer; font-size:10.5px; font-weight:900; }
      .v08-footer-note { margin-top:14px; padding-top:13px; border-top:1px solid #e6e0d7; display:flex; justify-content:space-between; gap:12px; align-items:center; }
      .v08-footer-note > div { display:grid; gap:2px; }
      .v08-footer-note b { font-size:11px; }
      .v08-footer-note span { font-size:10px; color:#817a71; }
      .v08-footer-note button { border:0; background:#273b55; color:#fff; border-radius:999px; padding:8px 11px; cursor:pointer; font-size:11px; font-weight:900; }
      @media (max-width:1040px) { .v08-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media (max-width:720px) {
        .v08-review { padding:15px; }
        .v08-head { flex-direction:column; }
        .v08-grid { grid-template-columns:1fr; }
        .v08-footer-note { align-items:flex-start; flex-direction:column; }
        .v08-head h2 { font-size:21px; }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', e => {
    if (e.target.closest?.('#v08ReviewButton')) {
      e.preventDefault();
      openPanel();
      return;
    }
    if (e.target.closest?.('[data-v08-close]')) {
      e.preventDefault();
      const panel = document.getElementById('v08Review');
      if (panel) panel.hidden = true;
      return;
    }
    const storyBtn = e.target.closest?.('[data-v08-story]');
    if (storyBtn) {
      e.preventDefault();
      clickStory(storyBtn.dataset.v08Story);
    }
  });

  const observer = new MutationObserver(() => ensureButton());
  observer.observe(document.body, {childList:true,subtree:true});
  installStyles();
  ensureButton();
  ensurePanel();
})();
