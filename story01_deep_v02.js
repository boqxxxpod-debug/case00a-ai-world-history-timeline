(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  if (!data) return;

  const nodesById = new Map(data.nodes.map(n => [n.id, n]));
  const linksById = new Map(data.links.map(l => [l.id, l]));
  const detailPanel = () => document.getElementById('detailPanel');
  const summaryBox = () => document.getElementById('storySummary');

  const extraSources = {
    OX01: {
      name: 'Oxford Research Encyclopedia - Printing, Propaganda, and Public Opinion in the Age of Martin Luther',
      url: 'https://academic.oup.com/edited-volume/62249/chapter-abstract/551349967'
    },
    MIT01: {
      name: 'Rubin 2014 - Printing and Protestants (MIT Press)',
      url: 'https://direct.mit.edu/rest/article/96/2/270/58126/Printing-and-Protestants-An-Empirical-Test-of-the'
    },
    CAM01: {
      name: 'Cambridge - Calls for Reform before Martin Luther',
      url: 'https://www.cambridge.org/core/books/martin-luther-in-context/calls-for-reform-before-martin-luther/0171D3279C14306D745DEE3A0CA339B6'
    }
  };

  const steps = [
    {
      id: 'S1',
      year: '1450〜1500ごろ',
      title: '印刷機ができた。で、すぐ革命？…ではない',
      short: '印刷技術が広がる',
      anchors: ['P01'], links: [], sources: ['S01', 'S02', 'S30'],
      body: [
        'グーテンベルク以後、ヨーロッパには印刷所が広がっていきます。同じ文章を何十冊、何百冊と複製できる。これはたしかに大きな変化です。',
        'でも、技術ができた瞬間に「情報革命」が始まったわけではありません。初期の印刷業は、何を大量に刷れば商売になるのかを探していました。新しい技術があっても、読者と市場がなければ広がりません。'
      ],
      ooh: '技術だけでは革命にならない。印刷機には、まず「何を刷れば売れるの？」という普通の商売の問題がありました。',
      transition: 'そして意外なことに、初期の印刷業を支えた大口のお客さんの一つが教会でした。'
    },
    {
      id: 'S2',
      year: 'ルター以前',
      title: '印刷は最初から「改革派の武器」じゃなかった',
      short: '教会も印刷を使っていた',
      anchors: ['P01'], links: [], sources: ['S30'],
      body: [
        '印刷と宗教改革はセットで語られがちですが、印刷業は最初からプロテスタントの味方だったわけではありません。むしろ初期には、典礼書、説教集、祈祷書など、カトリック教会の需要が安定した仕事になっていました。',
        'さらに贖宥状のキャンペーンでも、告知や説教、証明書など大量の印刷物が必要でした。つまり、のちにルターが強く批判する贖宥状のしくみ自体が、印刷ビジネスのお客さんでもあったわけです。'
      ],
      ooh: '「印刷＝宗教改革の味方」ではない。同じ印刷インフラを、教会側も改革側も使いました。',
      transition: 'そこへ1517年、ルターの贖宥状批判が飛び込んできます。'
    },
    {
      id: 'S3',
      year: '1517',
      title: 'ルターが火種を投げたとき、すでに「拡散装置」があった',
      short: 'ルターの論争が始まる',
      anchors: ['E02', 'P01'], links: ['L01', 'L02'], sources: ['S29', 'S30'],
      body: [
        '1517年、ルターの贖宥状批判から宗教論争が始まります。ここで大事なのは、ルターが印刷機を発明したわけでも、ゼロから情報網を作ったわけでもないことです。',
        'すでに数十年かけて印刷所、紙、本の流通が育っていました。そこに「教会の権威をめぐる刺激の強い論争」が乗った。火種と燃え広がる仕組みが、ちょうど同じ時代に重なったのです。'
      ],
      ooh: 'ルターの「すごい主張」だけを見ると半分しか見えない。1517年には、主張を増幅できるインフラがもう存在していました。',
      transition: 'そしてこの論争は、分厚い神学書ではなく、もっと売りやすい形に変わっていきます。'
    },
    {
      id: 'S4',
      year: '1517〜1525ごろ',
      title: '宗教論争が「売れるコンテンツ」になった',
      short: 'パンフレット市場が爆発',
      anchors: ['P07'], links: ['L01', 'L02', 'L03'], sources: ['S29', 'S30'],
      body: [
        '宗教改革期には、短く、比較的安く、素早く刷れるパンフレットが大きな役割を持ちます。難しい神学論争が、長大な本だけでなく、手に取りやすい商品になりました。',
        'ウィッテンベルクではルターと印刷業者・デザイナーの協力も進み、宗教改革のパンフレットには「読まれ、選ばれ、売れる」ための形が作られていきます。印刷が宗教改革を助けただけでなく、宗教改革が印刷市場に新しい読者と商品を与えました。'
      ],
      ooh: '因果は一方通行じゃない。「印刷 → 宗教改革」だけでなく、「宗教改革 → 印刷市場の成長」も起きました。',
      transition: 'ただし「パンフレットが売れた＝みんなが読んだ」と考えると、次の落とし穴があります。'
    },
    {
      id: 'S5',
      year: '16世紀前半',
      title: '文字を読めない人には届かなかった？ そう単純でもない',
      short: '読む以外でも広がる',
      anchors: ['P07'], links: ['L03'], sources: ['OX01'],
      body: [
        '当時の識字率は低く、「印刷物が増えても読める人は少ない」という問題があります。ここは、印刷革命を単純化しないためにかなり大事です。',
        'でも印刷物は、黙って一人で読むだけのメディアではありませんでした。絵を使う、誰かが声に出して読む、説教で内容を伝える、歌う。印刷された内容が、口頭や視覚のコミュニケーションに乗ってさらに広がることがありました。'
      ],
      ooh: '「印刷物の読者数」と「印刷物の影響を受けた人の数」は同じではない。印刷は、口頭・画像・歌とも組み合わさりました。',
      transition: 'では、印刷所があった場所ほど本当に宗教改革が広がったのでしょうか。'
    },
    {
      id: 'S6',
      year: '1500〜1600',
      title: '印刷所のある都市ほど、プロテスタント化しやすかった？',
      short: '都市データで見る',
      anchors: ['P01', 'P02'], links: ['L03'], sources: ['MIT01'],
      body: [
        '経済史家Jared Rubinは、都市ごとの印刷所の有無と宗教改革の広がりを統計的に分析しました。2014年の研究では、1500年までに印刷所があった都市は、1600年までにプロテスタントになっている確率が少なくとも29ポイント高かった、という推定を示しています。',
        'もちろん「印刷所があれば自動的にプロテスタントになる」という意味ではありません。都市の条件や政治、宗教、ネットワークなど別の要因もあります。それでも、印刷インフラが初期の広がりと関係していたことを数字で確かめようとした研究です。'
      ],
      ooh: '「印刷が効いた気がする」だけではなく、都市データから効果を測ろうとする研究もあります。',
      transition: 'ここまで見ると印刷が主役に見えます。でも最後に、ブレーキを踏んでおきます。'
    },
    {
      id: 'S7',
      year: 'ここが大事',
      title: 'それでも「印刷機が宗教改革を起こした」は言いすぎ',
      short: '印刷だけでは決まらない',
      anchors: ['P02', 'P07'], links: ['L03'], sources: ['S29', 'S30', 'CAM01'],
      body: [
        '宗教改革以前から教会改革を求める声はありましたし、ルターの神学、政治的な保護、都市や領邦の事情なども無視できません。印刷だけあっても、同じ結果がどこでも起きたわけではありません。',
        'だからこの年表では「印刷が宗教改革を起こした」と一本線で断定しません。印刷は、すでに存在した論争や不満を、速く、広く、繰り返し届ける強力な増幅器だった、と考える方が実態に近いです。'
      ],
      ooh: '原因というより「増幅器」。この言い換えだけで、印刷革命と宗教改革の関係がかなり見えやすくなります。',
      transition: 'そして増幅された宗教改革は、次に「地域ごとに宗派が分かれる」という政治問題へ進んでいきます。'
    },
    {
      id: 'S8',
      year: '次の話へ',
      title: 'ST01の答え：技術 × 市場 × 論争が合流した',
      short: '宗派分裂へつながる',
      anchors: ['P02'], links: ['L03'], sources: ['S29', 'S30', 'MIT01'],
      body: [
        'このストーリーで見たかったのは、「グーテンベルク → ルター → 宗教改革」という英雄と発明の一直線ではありません。',
        '印刷技術が先に広がる。印刷を支える市場ができる。そこへルターの論争が入り、パンフレットという商品になり、文字・画像・口頭をまたいで広がる。その結果、宗教改革の拡大がさらに印刷市場を刺激する。いくつもの要素が回り始めた、と見るのがポイントです。'
      ],
      ooh: '「印刷が宗教改革を生んだ」ではなく、「印刷と宗教改革がお互いを大きくした」。これがST01のいちばん大事な学びです。',
      transition: '次は、広がった宗教改革が国家や政治にどう入り込んだのか。ST02へ続きます。',
      nextStory: 'ST02'
    }
  ];

  let active = false;
  let currentIndex = 0;

  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[c]));

  function getSource(id) {
    return data.sources?.[id] || extraSources[id] || null;
  }

  function sourcesHtml(ids = []) {
    return `<div class="deep-sources">${ids.map(id => {
      const s = getSource(id);
      if (!s) return '';
      return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>`;
    }).join('')}</div>`;
  }

  function progressHtml() {
    return `<div class="deep-progress" aria-label="ST01の8ステップ">${steps.map((step, i) => `
      <button type="button" class="deep-progress-step ${i === currentIndex ? 'active' : ''}" data-deep-step="${i}" title="${esc(step.title)}">
        <span>${i + 1}</span><small>${esc(step.short)}</small>
      </button>`).join('<i>→</i>')}</div>`;
  }

  function renderSummary() {
    const box = summaryBox();
    if (!box || !active) return;
    box.innerHTML = `
      <div class="deep-summary-head">
        <div>
          <div class="story-kicker">ST01 · 深掘り版</div>
          <h2>印刷がなかったら、宗教改革はここまで広がった？</h2>
          <p>右の8ステップを順番に読む → 気になったところを左の地図で確認、という使い方です。</p>
        </div>
        <span class="deep-beta">v0.2 prototype</span>
      </div>
      ${progressHtml()}`;
  }

  function renderStep(index = currentIndex) {
    if (!active) return;
    currentIndex = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[currentIndex];
    const panel = detailPanel();
    if (!panel) return;

    const nodeLabels = step.anchors.map(id => nodesById.get(id)?.title || id).join(' / ');
    panel.innerHTML = `
      <div class="deep-reader">
        <div class="deep-reader-top">
          <div class="story-kicker">ST01 · ${currentIndex + 1}/${steps.length}</div>
          <span class="deep-year">${esc(step.year)}</span>
        </div>
        <h2>${esc(step.title)}</h2>
        <div class="deep-body">${step.body.map(p => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="deep-ooh">
          <div class="deep-ooh-label">💡 ここがおもしろい</div>
          <p>${esc(step.ooh)}</p>
        </div>
        <div class="deep-transition"><span>↓</span><p>${esc(step.transition)}</p></div>
        <div class="deep-map-box">
          <div><b>地図ではここ</b><small>${esc(nodeLabels)}</small></div>
          <button type="button" data-deep-map>左の地図で見る</button>
        </div>
        <details class="deep-source-details">
          <summary>根拠・出典を見る</summary>
          ${sourcesHtml(step.sources)}
        </details>
        <div class="deep-nav">
          <button type="button" data-deep-prev ${currentIndex === 0 ? 'disabled' : ''}>← 前へ</button>
          <span>${currentIndex + 1} / ${steps.length}</span>
          ${step.nextStory
            ? `<button type="button" class="primary" data-deep-next-story="${step.nextStory}">ST02へ →</button>`
            : `<button type="button" class="primary" data-deep-next ${currentIndex === steps.length - 1 ? 'disabled' : ''}>次へ →</button>`}
        </div>
      </div>`;

    applyDeepFocus(step);
    renderSummary();
  }

  function applyDeepFocus(step) {
    document.querySelectorAll('.node').forEach(el => el.classList.remove('deep-current-node'));
    document.querySelectorAll('.link-visible').forEach(el => el.classList.remove('deep-current-link'));
    step.anchors.forEach(id => document.querySelector(`.node[data-node-id="${CSS.escape(id)}"]`)?.classList.add('deep-current-node'));
    step.links.forEach(id => document.querySelector(`.link-visible[data-link-id="${CSS.escape(id)}"]`)?.classList.add('deep-current-link'));
  }

  function scrollMapToCurrent() {
    const step = steps[currentIndex];
    const anchor = step.anchors[0];
    const target = document.querySelector(`.node[data-node-id="${CSS.escape(anchor)}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  function addReturnBar() {
    if (!active) return;
    const panel = detailPanel();
    if (!panel || panel.querySelector('.deep-return')) return;
    const bar = document.createElement('div');
    bar.className = 'deep-return';
    bar.innerHTML = `<button type="button" data-deep-return>← ST01の続きに戻る</button><span>${currentIndex + 1}/${steps.length}</span>`;
    panel.prepend(bar);
  }

  function enter() {
    active = true;
    document.body.classList.add('deep-story-mode');
    renderStep(0);
  }

  function leave() {
    active = false;
    document.body.classList.remove('deep-story-mode');
    document.querySelectorAll('.node').forEach(el => el.classList.remove('deep-current-node'));
    document.querySelectorAll('.link-visible').forEach(el => el.classList.remove('deep-current-link'));
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width:1041px) {
        body.deep-story-mode .workspace { grid-template-columns:minmax(0,1fr) 470px; }
      }
      body.deep-story-mode .detail-panel { padding:20px; }
      .deep-summary-head { display:flex; gap:16px; justify-content:space-between; align-items:flex-start; }
      .deep-summary-head h2 { margin:4px 0 6px; }
      .deep-summary-head p { margin:0; }
      .deep-beta { flex:0 0 auto; font-size:10px; font-weight:800; padding:4px 8px; border-radius:999px; border:1px solid #d7d2c8; color:#68737d; background:#fff; }
      .deep-progress { margin-top:13px; padding-top:12px; border-top:1px solid #ebe7df; display:flex; align-items:center; gap:5px; overflow:auto; scrollbar-width:thin; }
      .deep-progress > i { color:#b4ada3; font-style:normal; font-size:10px; }
      .deep-progress-step { flex:0 0 auto; width:112px; min-height:50px; border:1px solid #ddd7cd; background:#fff; border-radius:10px; padding:6px 7px; text-align:left; cursor:pointer; display:grid; grid-template-columns:22px 1fr; gap:4px 6px; align-items:center; }
      .deep-progress-step > span { grid-row:1/3; width:22px; height:22px; border-radius:50%; display:grid; place-items:center; background:#eef1f4; font-size:10px; font-weight:900; }
      .deep-progress-step small { font-size:9px; line-height:1.25; color:#68737d; }
      .deep-progress-step.active { border-color:#273b55; box-shadow:0 0 0 2px rgba(39,59,85,.10); }
      .deep-progress-step.active > span { background:#273b55; color:#fff; }
      .deep-reader-top { display:flex; justify-content:space-between; align-items:center; gap:12px; }
      .deep-year { font-size:11px; color:#68737d; font-weight:800; }
      .deep-reader h2 { font-size:23px; line-height:1.4; margin:7px 0 14px; }
      .deep-body p { font-size:14.5px; line-height:1.85; margin:0 0 12px; }
      .deep-ooh { margin:18px 0; padding:14px 15px; background:#fff6d9; border:1px solid #ead89a; border-radius:14px; }
      .deep-ooh-label { font-size:12px; font-weight:900; margin-bottom:5px; }
      .deep-ooh p { margin:0; font-size:14px; line-height:1.7; font-weight:700; }
      .deep-transition { margin:14px 0 18px; display:grid; grid-template-columns:22px 1fr; gap:8px; align-items:start; color:#56616d; }
      .deep-transition > span { font-size:20px; line-height:1; }
      .deep-transition p { margin:0; font-size:13px; line-height:1.65; }
      .deep-map-box { margin:16px 0; padding:11px 12px; border:1px solid #dcd6cc; border-radius:12px; display:flex; gap:10px; justify-content:space-between; align-items:center; background:#fbfaf6; }
      .deep-map-box div { display:grid; gap:2px; min-width:0; }
      .deep-map-box b { font-size:11px; }
      .deep-map-box small { color:#68737d; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .deep-map-box button { border:0; background:#273b55; color:#fff; border-radius:999px; padding:7px 10px; cursor:pointer; font-size:11px; font-weight:800; white-space:nowrap; }
      .deep-source-details { margin:14px 0 18px; border-top:1px solid #ebe7df; padding-top:12px; }
      .deep-source-details summary { cursor:pointer; font-size:11px; color:#68737d; font-weight:800; }
      .deep-sources { display:grid; gap:6px; margin-top:8px; }
      .deep-sources a { font-size:10.5px; color:#315a7d; line-height:1.4; }
      .deep-nav { position:sticky; bottom:-20px; margin:18px -20px -20px; padding:12px 16px; border-top:1px solid #e5dfd6; background:rgba(255,253,248,.96); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .deep-nav button { border:1px solid #d7d2c8; background:#fff; border-radius:999px; padding:8px 12px; cursor:pointer; font-size:12px; font-weight:800; }
      .deep-nav button.primary { background:#273b55; color:#fff; border-color:#273b55; }
      .deep-nav button:disabled { opacity:.35; cursor:default; }
      .deep-nav span { font-size:11px; color:#68737d; }
      .deep-current-node { opacity:1 !important; z-index:8 !important; box-shadow:0 0 0 4px #e5a93f, 0 8px 24px rgba(25,30,35,.22) !important; }
      .deep-current-link { opacity:1 !important; stroke:#e0922f !important; stroke-width:5.5 !important; filter:drop-shadow(0 2px 2px rgba(0,0,0,.20)); }
      .deep-return { margin:-4px -4px 14px; padding:8px 10px; border-radius:10px; background:#f1efe9; display:flex; justify-content:space-between; align-items:center; gap:10px; }
      .deep-return button { border:0; background:transparent; color:#273b55; cursor:pointer; font-size:11px; font-weight:900; }
      .deep-return span { font-size:10px; color:#68737d; }
      @media (max-width:1040px) {
        body.deep-story-mode .detail-panel { order:-1; }
        body.deep-story-mode .workspace { display:flex; flex-direction:column; }
        body.deep-story-mode .detail-panel, body.deep-story-mode .graph-shell { width:100%; }
      }
      @media (max-width:720px) {
        body.deep-story-mode .detail-panel { padding:16px; }
        .deep-reader h2 { font-size:21px; }
        .deep-body p { font-size:14px; }
        .deep-nav { bottom:-16px; margin-left:-16px; margin-right:-16px; margin-bottom:-16px; }
        .deep-progress-step { width:96px; }
        .deep-map-box { align-items:flex-start; flex-direction:column; }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', (e) => {
    const storyBtn = e.target.closest?.('.story-button');
    if (storyBtn) {
      const id = storyBtn.dataset.storyId || null;
      if (id === 'ST01') queueMicrotask(enter);
      else if (active) queueMicrotask(leave);
      return;
    }

    if (e.target.closest?.('[data-deep-next]')) {
      e.preventDefault(); e.stopPropagation(); renderStep(currentIndex + 1); return;
    }
    if (e.target.closest?.('[data-deep-prev]')) {
      e.preventDefault(); e.stopPropagation(); renderStep(currentIndex - 1); return;
    }
    const stepBtn = e.target.closest?.('[data-deep-step]');
    if (stepBtn) {
      e.preventDefault(); e.stopPropagation(); renderStep(Number(stepBtn.dataset.deepStep)); return;
    }
    if (e.target.closest?.('[data-deep-map]')) {
      e.preventDefault(); e.stopPropagation(); scrollMapToCurrent(); return;
    }
    if (e.target.closest?.('[data-deep-return]')) {
      e.preventDefault(); e.stopPropagation(); renderStep(currentIndex); return;
    }
    const nextStory = e.target.closest?.('[data-deep-next-story]');
    if (nextStory) {
      e.preventDefault(); e.stopPropagation();
      const target = document.querySelector(`.story-button[data-story-id="${CSS.escape(nextStory.dataset.deepNextStory)}"]`);
      target?.click();
      return;
    }

    if (active && (e.target.closest?.('.node') || e.target.closest?.('.link-hit'))) {
      queueMicrotask(addReturnBar);
    }
  });

  installStyles();
})();
