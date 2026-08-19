(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  const stories = window.CASE00A_DEEP_STORIES;
  if (!data || !stories) return;

  const ORDER = ['ST01','ST02','ST03','ST04','ST05','ST06'];
  const LABELS = {
    ST01:'印刷で宗教が爆速？',
    ST02:'宗教で国が変わる？',
    ST03:'戦争代、どう払う？',
    ST04:'科学は工場につながる？',
    ST05:'炭鉱の水 → 蒸気',
    ST06:'産業革命、結局なに？'
  };

  const META = {
    ST01:{
      question:'ルターがすごかっただけなら、なぜここまで広がった？',
      takeaway:['印刷は「原因」より「増幅器」','宗教改革も印刷市場を大きくした','メディアは紙だけでなく、声・絵・歌にも乗った'],
      bridgeType:'START', bridgeIn:null,
      bridgeOut:'印刷で増幅された宗教改革は、次に「どの地域を、どの宗派で治める？」という政治の問題になります。'
    },
    ST02:{
      question:'信仰の違いが、どうして税・軍隊・国づくりの話になる？',
      takeaway:['宗派分裂は統治の問題になった','和平はゴールではなく暫定ルール','「宗教戦争→近代国家」は一本線ではない'],
      bridgeType:'つながる',
      bridgeIn:'印刷で広がった宗教改革が、信仰の話だけでは終わらず、教育・行政・同盟・戦争まで巻き込みます。',
      bridgeOut:'長い宗教対立と戦争を見ると、次に気になるのは「こんなに高い戦争代を、国はどう払った？」です。'
    },
    ST03:{
      question:'銀行や国債の話なのに、スタートが戦争なのはなぜ？',
      takeaway:['戦争は「信用」を必要とした','議会・税・借金・銀行がセットで育った','金融革命＝産業革命の直接原因、とは限らない'],
      bridgeType:'ズーム',
      bridgeIn:'ST02で出てきた「戦争には税・役所・信用が要る」を、英国にズームしてお金の仕組みから見ます。',
      bridgeOut:'ここで道はいったん枝分かれ。金融革命が科学革命を起こすわけではありません。同じ時代に、もう一方では「知識の作り方・広げ方」が変わっていました。'
    },
    ST04:{
      question:'コペルニクスやニュートンから、どうやって工場の話まで行く？',
      takeaway:['科学革命→産業革命は直通ではない','印刷・観測・学会・出版が知識の回路を作った','「役に立つ知識」がどこまで効いたかは議論中'],
      bridgeType:'並行ルート',
      bridgeIn:'ここはST03からの直接因果ではなく、同じ近世ヨーロッパを走っていた「もう一本の変化」に視点を移します。',
      bridgeOut:'知識のネットワークが変わったとしても、工場は本から直接生まれません。次はもっと現場へ降りて、炭鉱の水から蒸気機関を追います。'
    },
    ST05:{
      question:'世界を変えた蒸気機関、最初の目的が「水抜き」って本当？',
      takeaway:['発明の出発点は現場の困りごと','ニューコメン→ワットは改良の連続','発明だけでなく商業化で広がった'],
      bridgeType:'現場へ',
      bridgeIn:'ST04の「知識の回路」から、今度は現場のボトルネックへ。科学理論を工場へコピペするのではなく、困りごと→改良→商売を見ます。',
      bridgeOut:'蒸気機関だけでは産業革命になりません。最後は、石炭・賃金・市場・帝国・繊維・工場・金融・知識を全部同じ画面へ戻します。'
    },
    ST06:{
      question:'石炭？賃金？帝国？科学？銀行？――1個に決めなくていい？',
      takeaway:['産業革命は「合流点」として見る','強い因果と議論中の因果を分ける','単独原因探しより、条件の組み合わせを見る'],
      bridgeType:'合流',
      bridgeIn:'ここまで別々に見てきた技術・市場・金融・知識を、最後に「因果のハブ」へ合流させます。',
      bridgeOut:'6本を一周したら、ST01へ戻ってみる。最初は一本に見えた矢印が、今度は分岐や合流として見えるはずです。'
    }
  };

  const REVIEW = {
    ST01:{line:'印刷インフラの上に宗教論争が乗り、宗教改革と印刷市場がお互いを大きくした。',wow:'印刷は「宗教改革の原因」というより、すでにあった不満や論争を増幅する装置だった。',lens:'原因より「増幅器」で見る'},
    ST02:{line:'宗派分裂は、信仰だけでなく教育・行政・同盟・戦争を巻き込み、統治のしかたを変えた。',wow:'1648年を「近代国家の誕生日」とする説明は、分かりやすいけれど単純すぎる。',lens:'事件より「長い制度変化」で見る'},
    ST03:{line:'高額な戦争を続けるため、議会・税・公信用・国債・銀行が組み合わさっていった。',wow:'イングランド銀行の出発点をたどると、工場より先に「対仏戦争の資金」が出てくる。',lens:'制度を「困りごとの答え」として見る'},
    ST04:{line:'印刷・観測・数学・学会・雑誌が、知識をためて比較し、共有する回路を変えた。',wow:'ニュートンから工場へ直通したわけではない。科学と産業の間には職人・技術者・出版・試行錯誤がいる。',lens:'直線より「知識の生態系」で見る'},
    ST05:{line:'炭鉱の排水という現場の困りごとが、ニューコメン→ワット→商業化という改良の連鎖を生んだ。',wow:'世界を変えた蒸気機関も、最初は「水をくみ出したい」というかなり地味な問題から始まった。',lens:'発明より「ボトルネックのリレー」で見る'},
    ST06:{line:'石炭・賃金・市場・帝国・繊維・工場・鉄・蒸気・金融・知識が、18世紀後半の英国で重なった。',wow:'「真の原因を1つ」に決めるより、強い因果・背景条件・論争中の因果を分けて見るほうが分かる。',lens:'単独原因より「合流点」で見る'}
  };

  const CARD_LABELS = {
    number:'📏 数字で見ると', scale:'🔥 どれくらい？', twist:'😮 え、そうなの？',
    debate:'⚖️ ここ、割れてます', system:'🧠 仕組みで見ると', detail:'🔎 もう一段だけ'
  };

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let rafPending = false;
  let mapKey = '';

  function activeStoryId() {
    const active = [...document.querySelectorAll('.story-button.active')].find(b => stories[b.dataset.storyId]);
    if (active?.dataset.storyId) return active.dataset.storyId;
    const kicker = document.querySelector('#detailPanel .story-kicker')?.textContent || '';
    const m = kicker.match(/(ST\d+)/);
    return m && stories[m[1]] ? m[1] : null;
  }

  function currentStepIndex() {
    const kicker = document.querySelector('#detailPanel .story-kicker')?.textContent || '';
    const m = kicker.match(/ST\d+\s*[·・]\s*(\d+)\s*\//);
    return m ? Math.max(0, Number(m[1]) - 1) : 0;
  }

  function totalSteps() {
    return ORDER.reduce((sum,id) => sum + (stories[id]?.steps?.length || 0), 0);
  }

  function globalStep(storyId, idx) {
    let n = idx + 1;
    for (const id of ORDER) {
      if (id === storyId) break;
      n += stories[id]?.steps?.length || 0;
    }
    return n;
  }

  function clickStory(id) {
    document.querySelector(`.story-button[data-story-id="${CSS.escape(id)}"]`)?.click();
  }

  function getSource(id) {
    return data.sources?.[id] || window.CASE00A_DEEP_EXTRA_SOURCES?.[id] || null;
  }

  function applyButtonLabels() {
    ORDER.forEach(id => {
      const btn = document.querySelector(`.story-button[data-story-id="${id}"]`);
      if (btn && btn.textContent !== `${id} ${LABELS[id]}`) btn.textContent = `${id} ${LABELS[id]}`;
    });
    const all = document.querySelector('.story-button[data-story-id=""]');
    if (all && all.textContent !== '全体を眺める') all.textContent = '全体を眺める';
  }

  function ensureReviewButton() {
    if (document.getElementById('v09ReviewButton')) return;
    const wrap = document.querySelector('.controls .control-row:first-child .button-wrap');
    if (!wrap) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'v09ReviewButton';
    btn.className = 'v09-review-button';
    btn.textContent = '🧭 6章まとめ';
    wrap.appendChild(btn);
  }

  function ensureJourney() {
    let bar = document.getElementById('v09Journey');
    if (bar) return bar;
    const summary = document.getElementById('storySummary');
    if (!summary) return null;
    bar = document.createElement('section');
    bar.id = 'v09Journey';
    bar.className = 'v09-journey card';
    summary.insertAdjacentElement('beforebegin', bar);
    return bar;
  }

  function renderJourney(sid, idx) {
    const bar = ensureJourney();
    if (!bar) return;
    const key = `${sid || 'none'}:${idx}`;
    if (bar.dataset.key === key) return;
    bar.dataset.key = key;

    const currentPos = sid ? ORDER.indexOf(sid) : -1;
    const chapters = ORDER.map((id,i) => {
      const active = id === sid;
      const done = currentPos >= 0 && i < currentPos;
      return `<button type="button" class="v09-chapter ${active?'active':''} ${done?'done':''}" data-v09-story="${id}"><span>${done?'✓':i+1}</span><small>${esc(LABELS[id])}</small></button>`;
    }).join('<i>→</i>');

    if (!sid) {
      bar.innerHTML = `<div class="v09-journey-head"><div><b>6章で1450→1800を一周</b><small>${totalSteps()}ステップ。最初からでも、気になる章だけでもOK。</small></div><button type="button" class="v09-start" data-v09-story="ST01">最初から読む →</button></div><div class="v09-chapters">${chapters}</div>`;
      return;
    }

    const g = globalStep(sid, idx);
    bar.innerHTML = `<div class="v09-journey-head"><div><b>第${currentPos+1}章 / 6 · ${esc(LABELS[sid])}</b><small>全体では ${g} / ${totalSteps()} ステップ</small></div><div class="v09-global-meter"><span style="width:${Math.max(2,g/totalSteps()*100)}%"></span></div></div><div class="v09-chapters">${chapters}</div>`;
  }

  function renderSummaryExtras(sid) {
    const box = document.getElementById('storySummary');
    if (!sid || !box || !META[sid]) return;
    if (!box.querySelector('.v09-story-guide')) {
      const guide = document.createElement('div');
      guide.className = 'v09-story-guide';
      guide.innerHTML = `<div class="v09-guide-question"><span>🤔</span><b>${esc(META[sid].question)}</b></div><div class="v09-guide-hint">答えを先に覚えるより、「どこで話が曲がる？」を探しながら読むと面白いです。</div>`;
      box.appendChild(guide);
    }
    if (!box.querySelector('.v09-context')) {
      const pos = ORDER.indexOf(sid);
      const prev = pos > 0 ? ORDER[pos-1] : null;
      const next = pos < ORDER.length-1 ? ORDER[pos+1] : null;
      const row = document.createElement('div');
      row.className = 'v09-context';
      row.innerHTML = `${prev?`<button type="button" data-v09-story="${prev}"><span>← 前</span><b>${esc(LABELS[prev])}</b></button>`:'<div></div>'}<div class="v09-context-now"><span>いまここ</span><b>${esc(LABELS[sid])}</b></div>${next?`<button type="button" data-v09-story="${next}"><span>次 →</span><b>${esc(LABELS[next])}</b></button>`:`<button type="button" data-v09-story="ST01"><span>一周したら ↻</span><b>${esc(LABELS.ST01)}</b></button>`}`;
      box.appendChild(row);
    }
  }

  function depthSources(ids=[]) {
    const html = ids.map(id => {
      const s = getSource(id);
      return s ? `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name || id)}</a>` : '';
    }).filter(Boolean).join('');
    return html ? `<details class="v09-card-sources"><summary>ほんと？ 根拠を見る</summary><div>${html}</div></details>` : '';
  }

  function renderDepthCards(step) {
    if (!step?.v05cards?.length) return '';
    return `<div class="v09-depth-wrap">${step.v05cards.map(card => {
      const kind = card.kind || 'detail';
      return `<section class="v09-depth-card v09-${esc(kind)}"><div class="v09-depth-label">${CARD_LABELS[kind] || CARD_LABELS.detail}</div><h3>${esc(card.title || '')}</h3><p>${esc(card.text || '')}</p>${depthSources(card.sources)}</section>`;
    }).join('')}</div>`;
  }

  function reasoningHtml(step) {
    const n = step?.links?.length || 0;
    if (n === 0) return `<div class="v09-reasoning bridge"><div class="v09-mini-label">🧩 地図に矢印がないけど？</div><p>ミスではありません。ここは<strong>「間を埋める話」</strong>。直接の原因とまでは言い切れないので、線ではなく読み物で橋をかけています。</p></div>`;
    if (n >= 3) return `<div class="v09-reasoning branch"><div class="v09-mini-label">🛣️ ここ、一本道じゃない</div><p>${n}本の矢印が絡みます。「原因を1個に決める」より、<strong>何が同時に効いているか</strong>を見る場所です。</p></div>`;
    return `<div class="v09-pause"><span>💭</span><p><b>ちょっとだけ考える：</b> この矢印、逆向きの影響や別ルートもありそう？</p></div>`;
  }

  function renderReaderExtras(sid, idx) {
    const reader = document.querySelector('#detailPanel .v3-reader');
    const story = stories[sid];
    const step = story?.steps?.[idx];
    if (!reader || !step || !META[sid]) return;
    const key = `${sid}:${idx}`;
    if (reader.dataset.v09Decorated === key) return;
    reader.dataset.v09Decorated = key;

    const oohLabel = reader.querySelector('.v3-ooh-label');
    if (oohLabel) oohLabel.textContent = '👀 ここ、ちょっと面白い';
    const sourceSummary = reader.querySelector('.v3-source-details summary');
    if (sourceSummary) sourceSummary.textContent = 'ほんと？ 出典を見る';
    const mapBox = reader.querySelector('.v3-map-box');
    if (mapBox) {
      const b = mapBox.querySelector('b'); if (b) b.textContent = '左の地図だとここ';
      const btn = mapBox.querySelector('button'); if (btn) btn.textContent = '地図で確認 👀';
    }
    reader.querySelectorAll('.v3-nav button').forEach(btn => {
      const t = btn.textContent.trim();
      if (t.includes('前へ')) btn.textContent = '← ひとつ戻る';
      if (t === '次へ →') btn.textContent = 'つぎ →';
    });

    const body = reader.querySelector('.v3-body');
    if (idx === 0 && sid !== 'ST01' && META[sid].bridgeIn && body) {
      const box = document.createElement('div');
      box.className = 'v09-bridge-in';
      box.innerHTML = `<div class="v09-bridge-label">↪ 前の章からどう来た？ <span>${esc(META[sid].bridgeType)}</span></div><p>${esc(META[sid].bridgeIn)}</p>`;
      body.insertAdjacentElement('beforebegin', box);
    }

    const ooh = reader.querySelector('.v3-ooh');
    if (ooh && step.v05cards?.length) ooh.insertAdjacentHTML('afterend', renderDepthCards(step));
    const transition = reader.querySelector('.v3-transition');
    if (transition) transition.insertAdjacentHTML('afterend', reasoningHtml(step));

    const progress = document.querySelectorAll('.v3-progress-step');
    progress.forEach((el,i) => el.classList.toggle('v09-done', i < idx));

    if (idx === story.steps.length - 1) {
      const nav = reader.querySelector('.v3-nav');
      if (nav) {
        nav.insertAdjacentHTML('beforebegin', `<div class="v09-three-lines"><div class="v09-mini-label">☕ この話、3行で持ち帰るなら</div><ol>${META[sid].takeaway.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p>細かい年号は、必要になったら地図に戻れば大丈夫です。</p></div>`);
        const pos = ORDER.indexOf(sid);
        const nextId = pos < ORDER.length-1 ? ORDER[pos+1] : 'ST01';
        nav.insertAdjacentHTML('beforebegin', `<div class="v09-bridge-out"><div class="v09-bridge-label">🧭 ここから次へ</div><p>${esc(META[sid].bridgeOut)}</p><button type="button" data-v09-story="${nextId}">${sid==='ST06'?'もう一周する ↻':`第${pos+2}章へ →`}</button></div>`);
      }
    }
  }

  function clearMap() {
    const classes = ['v09-outside-node','v09-chapter-node','v09-visited-node','v09-current-node','v09-next-node','v09-future-node','v09-outside-link','v09-chapter-link','v09-visited-link','v09-current-link','v09-next-link','v09-future-link'];
    document.querySelectorAll('.node,.link-visible').forEach(el => classes.forEach(c => el.classList.remove(c)));
    document.querySelectorAll('.v09-step-badge').forEach(el => el.remove());
  }

  function stepMap(story) {
    const nodes = new Map(), links = new Map();
    story.steps.forEach((step,i) => {
      (step.anchors || []).forEach(id => { if (!nodes.has(id)) nodes.set(id,[]); nodes.get(id).push(i); });
      (step.links || []).forEach(id => { if (!links.has(id)) links.set(id,[]); links.get(id).push(i); });
    });
    return {nodes,links};
  }

  function stateFor(indices,current) {
    if (indices.includes(current)) return 'current';
    if (indices.includes(current+1)) return 'next';
    if (indices.some(i => i < current)) return 'visited';
    return 'future';
  }

  function classifyMap(sid,idx) {
    clearMap();
    const story = stories[sid];
    if (!story) return;
    const maps = stepMap(story);
    document.querySelectorAll('.node').forEach(el => {
      const indices = maps.nodes.get(el.dataset.nodeId);
      if (!indices) { el.classList.add('v09-outside-node'); return; }
      const state = stateFor(indices,idx);
      el.classList.add('v09-chapter-node',`v09-${state}-node`);
      const badge = document.createElement('span');
      badge.className = `v09-step-badge ${state}`;
      badge.textContent = indices.slice(0,2).map(i=>i+1).join('·') + (indices.length>2?'+':'');
      badge.title = `この章のステップ ${indices.map(i=>i+1).join(', ')}`;
      el.appendChild(badge);
    });
    document.querySelectorAll('.link-visible').forEach(el => {
      const indices = maps.links.get(el.dataset.linkId);
      if (!indices) { el.classList.add('v09-outside-link'); return; }
      const state = stateFor(indices,idx);
      el.classList.add('v09-chapter-link',`v09-${state}-link`);
    });
  }

  function ensureMapLens() {
    let bar = document.getElementById('v09MapLens');
    if (bar) return bar;
    const help = document.querySelector('.graph-shell .graph-help');
    if (!help) return null;
    bar = document.createElement('div');
    bar.id = 'v09MapLens';
    bar.className = 'v09-map-lens';
    help.insertAdjacentElement('afterend',bar);
    return bar;
  }

  function renderMapLens(sid,idx) {
    const bar = ensureMapLens();
    if (!bar) return;
    if (!sid || !stories[sid]) { bar.hidden = true; return; }
    bar.hidden = false;
    const step = stories[sid].steps[idx];
    const n = step?.links?.length || 0;
    const status = n===0 ? ['🧩','このステップは直接の矢印なし。右の読み物で「間」をつないでいます。','bridge'] : n>=3 ? ['🛣️',`ここは${n}本の矢印が絡むところ。一本道ではなく、分岐・合流として見てください。`,'branch'] : ['↗','右で読んだ因果を、左の矢印で確認するステップです。','normal'];
    const key = `${sid}:${idx}`;
    if (bar.dataset.key === key) return;
    bar.dataset.key = key;
    bar.innerHTML = `<div class="v09-lens-main"><div class="v09-lens-title"><span>🗺️</span><div><b>読んだあとに見る地図</b><small>${esc(sid)} · ${idx+1}/${stories[sid].steps.length} · ${esc(step?.short || step?.title || '')}</small></div></div><button type="button" data-v09-center>今ここへ</button></div><div class="v09-lens-legend"><span><i class="visited">✓</i>通った</span><span><i class="current">●</i>いま</span><span><i class="next">○</i>つぎ</span><span><i class="future">·</i>この章の先</span></div><div class="v09-lens-note ${status[2]}"><span>${status[0]}</span>${esc(status[1])}</div>`;
  }

  function centerCurrent(sid,idx,smooth=true) {
    const anchor = stories[sid]?.steps?.[idx]?.anchors?.[0];
    const viewport = document.getElementById('graphViewport');
    const node = anchor ? document.querySelector(`.node[data-node-id="${CSS.escape(anchor)}"]`) : null;
    if (!viewport || !node) return;
    viewport.scrollTo({left:Math.max(0,node.offsetLeft-viewport.clientWidth/2),top:Math.max(0,node.offsetTop-viewport.clientHeight/2),behavior:smooth?'smooth':'auto'});
  }

  function syncMap(sid,idx) {
    const key = `${sid || 'none'}:${idx}`;
    if (!sid) {
      if (mapKey !== key) clearMap();
      const bar = ensureMapLens(); if (bar) bar.hidden = true;
      mapKey = key; return;
    }
    if (mapKey !== key) { classifyMap(sid,idx); mapKey = key; }
    renderMapLens(sid,idx);
  }

  function ensureReviewPanel() {
    let panel = document.getElementById('v09Review');
    if (panel) return panel;
    const summary = document.getElementById('storySummary');
    if (!summary) return null;
    panel = document.createElement('section');
    panel.id = 'v09Review';
    panel.className = 'v09-review card';
    panel.hidden = true;
    const cards = ORDER.map((id,i) => `<article class="v09-review-card"><div class="v09-review-top"><span>${i+1}</span><small>${id}</small></div><h3>${esc(LABELS[id])}</h3><div class="v09-review-section"><b>何が起きた？</b><p>${esc(REVIEW[id].line)}</p></div><div class="v09-review-section wow"><b>😮 ここが残る</b><p>${esc(REVIEW[id].wow)}</p></div><div class="v09-review-lens">🕶️ ${esc(REVIEW[id].lens)}</div><button type="button" data-v09-story="${id}">この章に戻る →</button></article>`).join('');
    panel.innerHTML = `<div class="v09-review-head"><div><div class="story-kicker">MVP v0.9 · 6章まとめ</div><h2>結局、この350年で何がつながった？</h2><p>細かい年号より、<b>「因果の見方」</b>を6つ持ち帰るための振り返りです。</p></div><button type="button" class="v09-close" data-v09-close>閉じる ×</button></div><div class="v09-six-lines"><div>350年を6行で</div><ol><li><b>印刷</b>が情報の流れを変え、宗教論争を巨大化させる。</li><li><b>宗派分裂</b>が、統治・教育・同盟・戦争の問題になる。</li><li><b>戦争</b>が、税・信用・国債・銀行の新しい仕組みを要求する。</li><li>同時代に<b>科学の知識回路</b>も、観測・出版・学会を通じて変わる。</li><li><b>現場の技術</b>は、炭鉱の困りごと→改良→商業化で育つ。</li><li>最後に市場・資源・技術・制度・知識が<b>産業革命という合流点</b>で重なる。</li></ol></div><div class="v09-big-idea"><span>💡</span><div><b>この年表で一番持ち帰りたいこと</b><p>歴史は「AがBを起こした」の一本線より、<strong>増幅・分岐・並行・ボトルネック・合流</strong>として見ると急に面白くなる。</p></div></div><div class="v09-review-grid">${cards}</div><div class="v09-review-footer"><div><b>${totalSteps()}ステップ / 38ノード / 35リンク</b><span>まとめ画面でも基準グラフは増やしていません。</span></div><button type="button" data-v09-story="ST01">最初からもう一周 ↻</button></div>`;
    summary.insertAdjacentElement('afterend',panel);
    return panel;
  }

  function openReview() {
    const panel = ensureReviewPanel();
    if (!panel) return;
    panel.hidden = false;
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function installStyles() {
    const style = document.createElement('style');
    style.id = 'v09Styles';
    style.textContent = `
      @media (min-width:1041px){body.v3-deep-mode .workspace{grid-template-columns:minmax(430px,.86fr) minmax(520px,1.14fr)!important}}
      .v09-review-button{border:1px dashed #bcb6ad;background:#fff;color:#273b55;border-radius:999px;padding:7px 10px;cursor:pointer;font-size:12px;font-weight:900}
      .v09-journey{margin-top:14px;padding:13px 15px}.v09-journey-head{display:flex;gap:14px;align-items:center;justify-content:space-between}.v09-journey-head>div:first-child{display:grid;gap:2px}.v09-journey-head b{font-size:13px}.v09-journey-head small{font-size:10.5px;color:#777067}.v09-start{border:0;background:#273b55;color:#fff;border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;cursor:pointer}.v09-global-meter{flex:0 0 160px;height:7px;background:#e8e3da;border-radius:999px;overflow:hidden}.v09-global-meter span{display:block;height:100%;background:#6c8066}.v09-chapters{display:flex;gap:5px;align-items:center;overflow:auto;margin-top:11px;padding-top:10px;border-top:1px solid #ece7de}.v09-chapters>i{font-style:normal;color:#bbb4aa;font-size:10px}.v09-chapter{flex:0 0 120px;min-height:42px;border:1px solid #ddd7cd;background:#fff;border-radius:10px;padding:6px 7px;text-align:left;cursor:pointer;display:grid;grid-template-columns:22px 1fr;gap:6px;align-items:center}.v09-chapter>span{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#eef1f4;font-size:10px;font-weight:900}.v09-chapter small{font-size:9px;line-height:1.25}.v09-chapter.active{border-color:#273b55;box-shadow:0 0 0 2px rgba(39,59,85,.09)}.v09-chapter.active>span{background:#273b55;color:#fff}.v09-chapter.done>span{background:#6f8a70;color:#fff}
      .v09-story-guide{margin-top:12px;padding-top:11px;border-top:1px dashed #ddd6ca;display:grid;gap:5px}.v09-guide-question{display:flex;gap:8px;font-size:13px;line-height:1.5}.v09-guide-question span{font-size:16px}.v09-guide-hint{color:#777067;font-size:11px;padding-left:24px}.v09-context{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;margin-top:12px;padding-top:11px;border-top:1px dashed #ddd6ca}.v09-context button,.v09-context-now{border:1px solid #ddd7cd;border-radius:10px;background:#fff;padding:7px 9px;display:grid;gap:2px;min-width:0;text-align:left}.v09-context button{cursor:pointer}.v09-context span{font-size:9px;color:#837b71;font-weight:800}.v09-context b{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v09-context-now{background:#f3f0e8;text-align:center;min-width:120px}.v09-context-now span,.v09-context-now b{text-align:center}
      .v09-bridge-in,.v09-bridge-out{margin:10px 0 16px;padding:13px 14px;border-radius:14px;background:#eef4f2;border:1px solid #cadbd5}.v09-bridge-out{background:#f4efe6;border-color:#dfd2bd;margin-top:20px}.v09-bridge-label{font-size:11px;font-weight:900;margin-bottom:6px}.v09-bridge-label span{margin-left:5px;padding:2px 6px;border-radius:999px;background:#fff;border:1px solid rgba(80,80,80,.14);font-size:9px}.v09-bridge-in p,.v09-bridge-out p{margin:0;font-size:12.8px;line-height:1.7}.v09-bridge-out button{margin-top:10px;border:0;border-radius:999px;background:#273b55;color:#fff;padding:8px 12px;font-size:11px;font-weight:900;cursor:pointer}
      .v09-depth-wrap{display:grid;gap:10px;margin:12px 0 16px}.v09-depth-card{padding:13px 14px;border-radius:14px;border:1px solid #d7d2c8;background:#fff}.v09-depth-card h3{margin:3px 0 7px!important;font-size:14px!important;letter-spacing:0!important;color:#25313b!important;line-height:1.45}.v09-depth-card p{margin:0;font-size:13px;line-height:1.75}.v09-depth-label{font-size:10.5px;font-weight:900}.v09-number{background:#eef6fb;border-color:#cbdde9}.v09-scale{background:#eef7f0;border-color:#cfe1d1}.v09-twist{background:#fff6df;border-color:#ead89c}.v09-debate{background:#f8eef3;border-color:#dfcbd4}.v09-system{background:#f0f1fa;border-color:#d4d6e8}.v09-detail{background:#f7f5f0;border-color:#ded9cf}.v09-card-sources{margin-top:9px;padding-top:8px;border-top:1px dashed rgba(70,70,70,.18)}.v09-card-sources summary{cursor:pointer;font-size:10.5px;font-weight:800;color:#6f6a63}.v09-card-sources div{display:grid;gap:5px;margin-top:7px}.v09-card-sources a{font-size:10px;line-height:1.4;color:#315a7d}
      .v09-reasoning{margin:10px 0 16px;padding:12px 13px;border-radius:12px;background:#eef5f7;border:1px solid #cbdde1}.v09-reasoning.branch{background:#f1f0fa;border-color:#d6d1ea}.v09-mini-label{font-size:11px;font-weight:900;margin-bottom:5px}.v09-reasoning p,.v09-pause p{margin:0;font-size:12.5px;line-height:1.65}.v09-pause{display:flex;gap:8px;color:#635f59;padding:5px 2px;margin:10px 0 16px}.v09-three-lines{margin:22px 0 14px;padding:15px 16px;border-radius:14px;background:#f5efe4;border:1px solid #e2d5c0}.v09-three-lines ol{margin:8px 0 10px;padding-left:22px}.v09-three-lines li{margin:5px 0;font-size:13px;line-height:1.55;font-weight:700}.v09-three-lines p{margin:0;font-size:11px;color:#756d63}.v3-progress-step.v09-done{background:#f7f8f6;border-color:#cfd7ce}.v3-progress-step.v09-done>span{background:#6f8a70;color:#fff;font-size:0}.v3-progress-step.v09-done>span::after{content:'✓';font-size:10px}
      .v09-map-lens{padding:10px 12px;border-bottom:1px solid #e9e4db;background:#f8f6f0;display:grid;gap:8px}.v09-lens-main{display:flex;align-items:center;justify-content:space-between;gap:10px}.v09-lens-title{display:flex;gap:8px;min-width:0}.v09-lens-title>span{font-size:18px}.v09-lens-title>div{display:grid;min-width:0}.v09-lens-title b{font-size:11.5px}.v09-lens-title small{font-size:9.5px;color:#777067;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v09-lens-main button{border:1px solid #cfc8bd;background:#fff;color:#273b55;border-radius:999px;padding:6px 9px;cursor:pointer;font-size:10px;font-weight:900}.v09-lens-legend{display:flex;flex-wrap:wrap;gap:10px;font-size:9.5px;color:#6c665e;font-weight:700}.v09-lens-legend span{display:flex;align-items:center;gap:4px}.v09-lens-legend i{width:17px;height:17px;display:grid;place-items:center;border-radius:50%;font-style:normal;font-size:9px;font-weight:900;border:1px solid #ccc5ba;background:#fff}.v09-lens-legend i.visited{background:#718873;color:#fff}.v09-lens-legend i.current{background:#e5a93f;color:#fff}.v09-lens-legend i.next{background:#55789b;color:#fff}.v09-lens-legend i.future{background:#efede8;color:#8a8379}.v09-lens-note{display:flex;gap:6px;font-size:10px;line-height:1.45;color:#615b53;padding:6px 8px;border-radius:9px;background:#fff;border:1px solid #e0dbd1}.v09-lens-note.bridge{background:#eef5f7;border-color:#cbdde1}.v09-lens-note.branch{background:#f1f0fa;border-color:#d6d1ea}
      body.v3-deep-mode .node.v09-outside-node{opacity:.10!important;filter:saturate(.3)}body.v3-deep-mode .node.v09-chapter-node{opacity:.58!important}body.v3-deep-mode .node.v09-future-node{opacity:.36!important}body.v3-deep-mode .node.v09-visited-node{opacity:.68!important;box-shadow:0 0 0 2px rgba(103,132,106,.22),0 3px 12px rgba(25,30,35,.08)!important}body.v3-deep-mode .node.v09-current-node{opacity:1!important;z-index:9!important;box-shadow:0 0 0 4px #e5a93f,0 10px 26px rgba(25,30,35,.25)!important;transform:translate(-50%,-50%) scale(1.055)}body.v3-deep-mode .node.v09-next-node{opacity:.92!important;z-index:7!important;box-shadow:0 0 0 3px rgba(85,120,155,.55),0 6px 18px rgba(25,30,35,.14)!important}body.v3-deep-mode .link-visible.v09-outside-link{opacity:.025!important}body.v3-deep-mode .link-visible.v09-future-link{opacity:.16!important}body.v3-deep-mode .link-visible.v09-visited-link{opacity:.38!important}body.v3-deep-mode .link-visible.v09-current-link{opacity:1!important;stroke:#e0922f!important;stroke-width:5.5!important}body.v3-deep-mode .link-visible.v09-next-link{opacity:.72!important;stroke:#55789b!important;stroke-width:3.8!important}.node .v09-step-badge{position:absolute;left:-11px;top:-11px;min-width:20px;height:20px;padding:0 4px;border-radius:999px;display:grid;place-items:center;font-size:8px;font-weight:900;background:#efede8;color:#736c63;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,.16);z-index:12;pointer-events:none}.node .v09-step-badge.visited{background:#718873;color:#fff}.node .v09-step-badge.current{background:#e5a93f;color:#fff}.node .v09-step-badge.next{background:#55789b;color:#fff}
      .v09-review{margin-top:14px;padding:20px}.v09-review-head{display:flex;justify-content:space-between;gap:18px}.v09-review-head h2{margin:5px 0 6px;font-size:24px}.v09-review-head p{margin:0;color:#655f57;font-size:13px;line-height:1.6}.v09-close{border:1px solid #d7d2c8;background:#fff;border-radius:999px;padding:7px 10px;cursor:pointer;height:max-content}.v09-six-lines{margin-top:18px;padding:15px 16px;background:#f4f0e7;border:1px solid #dfd6c8;border-radius:14px}.v09-six-lines>div{font-size:11px;font-weight:900;margin-bottom:7px}.v09-six-lines ol{margin:0;padding-left:23px;display:grid;gap:5px}.v09-six-lines li{font-size:13px;line-height:1.6}.v09-big-idea{margin:14px 0 18px;padding:14px 15px;background:#fff6d9;border:1px solid #ead89a;border-radius:14px;display:flex;gap:10px}.v09-big-idea>span{font-size:22px}.v09-big-idea b{font-size:12px}.v09-big-idea p{margin:4px 0 0;font-size:14px;line-height:1.65}.v09-review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.v09-review-card{padding:14px;border:1px solid #ddd7cd;border-radius:14px;background:#fff;display:flex;flex-direction:column}.v09-review-top{display:flex;justify-content:space-between}.v09-review-top>span{width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:#273b55;color:#fff;font-size:11px;font-weight:900}.v09-review-card h3{margin:9px 0 10px;font-size:16px}.v09-review-section{margin-top:7px}.v09-review-section b{font-size:10.5px}.v09-review-section p{margin:3px 0 0;font-size:12.5px;line-height:1.65}.v09-review-section.wow{padding:9px 10px;background:#faf4df;border-radius:10px}.v09-review-lens{margin:10px 0 12px;padding-top:9px;border-top:1px dashed #e1dcd3;font-size:11px;font-weight:900;color:#455365}.v09-review-card>button{margin-top:auto;align-self:flex-start;border:0;background:#eef1f4;color:#273b55;border-radius:999px;padding:7px 9px;cursor:pointer;font-size:10.5px;font-weight:900}.v09-review-footer{margin-top:14px;padding-top:13px;border-top:1px solid #e6e0d7;display:flex;justify-content:space-between;gap:12px;align-items:center}.v09-review-footer>div{display:grid}.v09-review-footer span{font-size:10px;color:#817a71}.v09-review-footer button{border:0;background:#273b55;color:#fff;border-radius:999px;padding:8px 11px;cursor:pointer;font-size:11px;font-weight:900}
      @media(max-width:1040px){.v09-review-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v09-map-lens{position:sticky;top:0;z-index:10}}
      @media(max-width:720px){.v09-journey-head{align-items:flex-start;flex-direction:column}.v09-global-meter{width:100%;flex-basis:7px}.v09-chapter{flex-basis:105px}.v09-guide-hint{padding-left:0}.v09-context{grid-template-columns:1fr}.v09-context-now{order:-1}.v09-depth-card{padding:12px}.v09-three-lines{padding:13px}.v09-review{padding:15px}.v09-review-head{flex-direction:column}.v09-review-grid{grid-template-columns:1fr}.v09-review-footer{align-items:flex-start;flex-direction:column}.v09-review-head h2{font-size:21px}}
    `;
    document.head.appendChild(style);
  }

  function sync() {
    applyButtonLabels();
    ensureReviewButton();
    ensureReviewPanel();
    const sid = activeStoryId();
    const idx = currentStepIndex();
    renderJourney(sid,idx);
    if (sid) {
      renderSummaryExtras(sid);
      renderReaderExtras(sid,idx);
    }
    syncMap(sid,idx);
  }

  function scheduleSync() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; sync(); });
  }

  document.addEventListener('click', e => {
    const storyJump = e.target.closest?.('[data-v09-story]');
    if (storyJump) {
      e.preventDefault(); e.stopPropagation();
      const review = document.getElementById('v09Review'); if (review) review.hidden = true;
      clickStory(storyJump.dataset.v09Story);
      setTimeout(() => document.getElementById('storySummary')?.scrollIntoView({behavior:'smooth',block:'start'}),0);
      return;
    }
    if (e.target.closest?.('#v09ReviewButton')) { e.preventDefault(); openReview(); return; }
    if (e.target.closest?.('[data-v09-close]')) { e.preventDefault(); const p=document.getElementById('v09Review'); if(p)p.hidden=true; return; }
    if (e.target.closest?.('[data-v09-center]')) { e.preventDefault(); const sid=activeStoryId(); if(sid)centerCurrent(sid,currentStepIndex(),true); return; }
    setTimeout(scheduleSync,0);
  }, true);

  const observer = new MutationObserver(scheduleSync);
  observer.observe(document.body,{childList:true,subtree:true});

  installStyles();
  sync();
})();
