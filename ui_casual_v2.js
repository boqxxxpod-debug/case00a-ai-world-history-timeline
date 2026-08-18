(() => {
  'use strict';

  const data = window.CASE00A_DATA;
  const storyData = window.CASE00A_STORIES;
  if (!data || !storyData) return;

  const nodesById = new Map(data.nodes.map(n => [n.id, n]));
  const linksById = new Map(data.links.map(l => [l.id, l]));
  const storiesById = new Map(storyData.stories.map(s => [s.id, s]));

  const laneNames = { printing:'印刷', reformation:'宗教', state:'国と政治', science:'科学', industry:'産業' };
  const kindNames = { event:'できごと', process:'じわじわ進んだ変化', institution:'しくみ', publication:'本・出版', technology:'新しい技術', condition:'背景にあったこと' };
  const strengthNames = { strong:'かなり強い', medium:'つながりあり', debated:'意見が分かれる' };

  const copy = {
    P01:'本を1冊ずつ手で写す時代から、同じ内容をまとめて刷れる時代へ。印刷所や紙、本の流通が広がって、情報が動くスピードと量が一気に変わっていきます。',
    E02:'ルターが贖宥状を批判したことから、教会のあり方をめぐる大きな論争が始まります。ここでは「宗教改革そのもの」ではなく、その火がついた場面として置いています。',
    P07:'宗教の議論が、学者や聖職者だけのものではなくなっていきます。短くて安いパンフレットが大量に刷られ、論争そのものが大きな市場になりました。',
    P02:'宗教改革は1回の事件ではなく、100年以上続く大きな変化です。カトリック、ルター派、改革派などに分かれ、政治や教育、戦争にも影響が広がっていきます。',
    P08:'同じ文章や図を、離れた場所の人たちが見比べられるようになりました。知識をためる、比べる、間違いを直す。そんな地味だけれど大事なことが、ずっとやりやすくなります。',
    E03:'宗教で割れた神聖ローマ帝国が、とりあえず折り合いをつけようとしたルールです。ただし全員が納得したわけではなく、これで問題が全部解決したわけでもありません。',
    P09:'「国の中で宗教をどうそろえる？」という問題に、教会と政治が一緒に取り組むようになります。学校や規律、行政も巻き込みながら、統治の形そのものが変わっていきました。',
    E04:'三十年戦争は「宗教戦争」の一言では片づきません。宗教に加えて、王家どうしの争い、領土、同盟、帝国のルールまで絡んだ巨大な戦争です。',
    E05:'三十年戦争を終わらせた一連の講和です。よく「近代国家の始まり」と言われますが、実際にはもっと複雑で、ここを国家誕生の一点と見るのは単純すぎます。',
    P03:'戦争を続けるには、お金、人、武器、税、役所が必要です。近世ヨーロッパでは、戦争をこなすために国の集金力や行政力がじわじわ強くなっていきました。',
    E06:'王だけで好きに決めるのではなく、議会の力がぐっと強まった転換点です。税や軍隊、お金の使い方にも議会が深く関わるようになります。',
    P10:'大きな戦争を続けるには、とにかくお金がかかります。イングランド政府は「どうやって長く、たくさん借りるか」という現実的な問題に直面しました。',
    E08:'イングランド銀行は、最初から「産業を育てる銀行」として作られたわけではありません。政府に大金を貸し、戦費を集めるしくみの一部として生まれました。',
    P11:'税、国債、銀行、政府の信用がセットになって、「国がお金を借り続けられる」しくみが整っていきます。これが英国の金融革命と呼ばれる流れです。',
    E09:'コペルニクスは「地球が中心」という常識をひっくり返し、地球も動く惑星として考えました。すぐに全部が変わったわけではありませんが、新しい宇宙観の大きな出発点です。',
    P16:'ティコ・ブラーエは、望遠鏡以前の時代にものすごく細かい天体データを集めました。この大量の観測記録が、あとでケプラーの大仕事につながります。',
    E10:'ケプラーは、ティコの観測データと格闘して、惑星の動きを新しい数学で説明しました。「きれいな円で回るはず」という考えから一歩抜け出したのが大きなポイントです。',
    E11:'ガリレオが望遠鏡で空を見ると、月はデコボコで、木星の周りには衛星が回っていました。「昔からの宇宙観、本当にそのままでいい？」という強烈な材料になります。',
    E12:'ベーコンは、頭の中だけで考えるより、観察や実験を積み重ねようと強く主張しました。自然を知ることを、実際の役に立つ知識にもつなげようとした点が重要です。',
    E13:'科学者たちがバラバラに研究するだけでなく、集まって実験し、議論し、結果を確かめる場ができます。科学が「個人技」だけではなくなっていく流れです。',
    E14:'新しい発見を定期的にみんなへ届ける科学雑誌が始まります。研究成果を早く共有し、他の人が読んで確かめる文化が育っていきます。',
    E15:'ニュートンは、地上の物体の動きと天体の動きを、同じルールで説明しようとしました。自然を数学でまとめて説明できる、という科学のイメージを強くした一冊です。',
    P04:'観測する、数字で表す、実験する、結果を公開する。こうしたやり方が少しずつつながり、科学が「続けられる共同作業」になっていきます。',
    P12:'科学者だけでなく、職人や技術者も含めて「役に立つ知識」を交換するネットワークが広がります。これが産業革命にどれだけ効いたかは、今でも議論があるところです。',
    P14:'英国の工業化は国内だけを見ても分かりません。海外貿易、植民地、奴隷制を含む大西洋経済、綿製品の大きな市場が、需要の側から強く関わっていました。',
    P15:'人口が増え、人々が服や日用品をもっと買うようになると、作る側にも大きな市場が生まれます。これだけで産業革命が起きるわけではありませんが、土台の一つです。',
    E16:'鉄を作る燃料を木炭からコークスへ。これで「木が足りない」という制約をゆるめ、鉄をもっと大量に作れる方向へ進みました。',
    P13:'炭鉱を深く掘るほど、水がたまって作業できなくなります。「この水、どうにかして外へ出せない？」という切実な問題が、蒸気機関の需要を生みました。',
    E17:'ニューコメン機関は、炭鉱の水をくみ出すための実用的な蒸気機関でした。効率はまだ悪かったものの、「蒸気で仕事をさせる」技術が現場で使われ始めます。',
    E18:'飛び杼で布を織るスピードが上がると、今度は糸が足りなくなります。一つの工程が速くなることで、別の工程に新しいボトルネックが生まれました。',
    P05:'英国では「人件費は高め、石炭は安め」だったので、人手を減らして石炭を使う機械が得になりやすかった――という有名な説です。ただし、これだけで全部を説明できるわけではありません。',
    E19:'スピニング・ジェニーは、一人で何本もの糸を同時に紡げるようにしました。家庭や小さな作業場でも、生産量を大きく増やせる技術でした。',
    E20:'アークライトの水力紡績機は、水の力で連続して糸を作ります。大きな設備と水力が必要なので、人と機械を一か所に集める工場制とも相性がよくなりました。',
    E21:'ワットの改良は、蒸気機関のムダな熱を減らして燃料をかなり節約しました。「動くけれど燃費が悪い」機械から、もっと使いやすい動力へ近づきます。',
    E22:'クロムフォード・ミルは、大きな建物に機械と労働者を集めて生産する代表例です。「工場でまとめて作る」というスタイルがはっきり見える場所でした。',
    E23:'ワットの改良技術を、ボールトンと組んで実際のビジネスとして広げていきます。発明が「使える商品」になって、鉱山以外にも広がる段階です。',
    E24:'スピニング・ミュールは、先行する紡績機のいいところを組み合わせました。細くて質のいい糸を大量に作れるようになり、綿工業をさらに押し上げます。',
    P06:'18世紀後半の英国では、繊維、鉄、蒸気、工場、石炭、市場、金融、知識がいっせいにつながり始めます。産業革命は「この発明が原因！」ではなく、いくつもの流れが合流した結果として見るのがポイントです。'
  };

  const storyCopy = {
    ST01:{ title:'印刷がなかったら、宗教改革はここまで広がった？', intro:'ルターの主張がすごかった。それだけではありません。印刷されたパンフレットが、議論をものすごい速さで広げました。', point:'ポイントは「印刷が宗教改革を起こした」ではなく、「印刷が宗教論争を巨大化させた」と見ること。' },
    ST02:{ title:'宗教で割れたヨーロッパ。国はどう変わった？', intro:'宗教改革のあと、宗教と政治はますます切り離せなくなります。妥協したり、統制したり、最後は大戦争になったり。一本道ではありません。', point:'宗教対立は国づくりに影響した。でも「宗教改革→近代国家」と一直線に考えるのはちょっと危ない。' },
    ST03:{ title:'戦争のお金、どうやって集める？', intro:'戦争はとにかく高い。そこで英国は、税だけでなく「国が信用でお金を借りる」しくみを育てていきます。', point:'銀行や国債の発達は、商売だけでなく「戦争代をどう払うか」という問題とも深くつながっていました。' },
    ST04:{ title:'科学革命って、産業革命の役に立ったの？', intro:'科学者の発見がそのまま工場を生んだわけではありません。でも、観測・実験・出版・学会を通じて「使える知識」が回る環境は育っていきました。', point:'科学→産業革命は一本線じゃない。でも、知識が広がるしくみは無視できない。' },
    ST05:{ title:'蒸気機関は、炭鉱の「水が邪魔！」から始まった', intro:'最初から「世界を変えるエンジンを作ろう」としたわけではありません。深い炭鉱に水がたまる。まずは、その困りごとを何とかしたかった。', point:'困りごと→最初の機械→欠点→改良→商売。技術が育つ流れが見えます。' },
    ST06:{ title:'産業革命、結局なにが効いたの？', intro:'石炭？ 高い賃金？ 帝国？ 銀行？ 科学？ 発明？――たぶん、どれか一つではありません。', point:'いろんな条件が同じ時代の英国で重なった。ここでは「原因を一個に決めない」のが大事です。' }
  };

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const detail = () => document.getElementById('detailPanel');

  function sources(ids=[]) {
    if (!ids.length) return '<p class="muted">出典はまだ入っていません。</p>';
    return `<ul class="source-list">${ids.map(id => {
      const s=data.sources[id];
      return s ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name || id)}</a></li>` : `<li>${esc(id)}</li>`;
    }).join('')}</ul>`;
  }

  function relationList(n, incoming) {
    const links = data.links.filter(l => incoming ? l.to===n.id : l.from===n.id);
    if (!links.length) return '<p class="muted">ここから直接つないだ矢印は、今のMVPにはありません。</p>';
    return `<ul class="relation-list">${links.map(l => {
      const otherId = incoming ? l.from : l.to;
      const other = nodesById.get(otherId);
      return `<li><button type="button" class="relation-jump" data-jump-node="${esc(otherId)}">
        <span class="relation-title">${esc(other?.title || otherId)}</span>
        <span class="relation-label">${esc(l.label || '')}</span>
        <span class="relation-strength ${esc(l.strength)}">${esc(strengthNames[l.strength] || l.strength)}</span>
      </button></li>`;
    }).join('')}</ul>`;
  }

  function nodeDetail(id) {
    const n=nodesById.get(id); if(!n || !detail()) return;
    detail().innerHTML=`
      <div class="story-kicker">${esc(n.date_label || n.start_year)} · ${esc(laneNames[n.lane] || n.lane)}</div>
      <h2>${esc(n.title)}</h2>
      <div class="detail-meta"><span class="pill">${esc(kindNames[n.kind] || n.kind)}</span></div>
      <h3>ざっくりいうと</h3><p class="detail-lead">${esc(copy[n.id] || n.summary || '')}</p>
      <h3>どこで？</h3><p>${esc(n.place?.label || 'ヨーロッパ')}</p>
      <h3>その前は？</h3>${relationList(n,true)}
      <h3>で、そのあと？</h3>${relationList(n,false)}
      ${n.historiography ? `<div class="history-note"><h3>ここは意見が分かれる</h3><p>${esc(n.historiography)}</p></div>`:''}
      <details class="source-details"><summary>出典も見る</summary>${sources(n.sources)}</details>`;
  }

  function linkDetail(id) {
    const l=linksById.get(id); if(!l || !detail()) return;
    const from=nodesById.get(l.from), to=nodesById.get(l.to);
    detail().innerHTML=`
      <div class="story-kicker">この2つ、どうつながる？</div>
      <h2>${esc(from?.title || l.from)} → ${esc(to?.title || l.to)}</h2>
      <div class="detail-meta"><span class="pill">${esc(strengthNames[l.strength] || l.strength)}</span></div>
      ${l.strength==='debated'?'<div class="debate-warning">⚠ ここは「そう考える研究もある」というところ。意見が分かれます。</div>':''}
      <h3>ひとことで</h3><p class="detail-lead">${esc(l.label || '')}</p>
      ${l.explanation ? `<details class="more-details" open><summary>もう少し詳しく</summary><p>${esc(l.explanation)}</p></details>`:''}
      ${l.debate_note ? `<div class="history-note"><h3>なにが議論なの？</h3><p>${esc(l.debate_note)}</p></div>`:''}
      <details class="source-details"><summary>出典も見る</summary>${sources(l.sources)}</details>`;
  }

  function storyDetail(id) {
    const box=document.getElementById('storySummary'); if(!box) return;
    if(!id){
      box.innerHTML='<div class="all-mode"><div class="story-kicker">まずは、気になるところから</div><h2>歴史って、結局なにが何につながったの？</h2><p>38のできごとを矢印でつないでいます。最初から順番に見なくてOK。気になる丸をタップして、前後をたどってみてください。</p></div>';
      return;
    }
    const c=storyCopy[id], s=storiesById.get(id); if(!c||!s) return;
    box.innerHTML=`<div class="story-kicker">${esc(id)} · こんな話</div><h2>${esc(c.title)}</h2><p>${esc(c.intro)}</p><p class="story-takeaway"><b>ここだけ覚えるなら：</b> ${esc(c.point)}</p>`;
  }

  function emptyDetail(){
    if(!detail())return;
    detail().innerHTML='<div class="detail-empty"><div class="detail-icon">↗</div><h2>気になる丸をタップ</h2><p>その出来事をざっくり読んで、<b>「その前は？」→「で、そのあと？」</b>とたどれます。</p><p class="muted">矢印をタップすると「なんでこの2つがつながるの？」も見られます。</p></div>';
  }

  function staticCopy(){
    const p=document.querySelector('.app-header p'); if(p)p.textContent='歴史って、結局なにが何につながったの？ 1450〜1800年のヨーロッパを矢印で追ってみます。';
    const labels=document.querySelectorAll('.control-label');
    if(labels[0])labels[0].textContent='どの話から見る？';
    if(labels[1])labels[1].textContent='見たいテーマだけ';
    const legend=document.querySelector('.legend');
    if(legend)legend.innerHTML='<span><i class="legend-line strong"></i> かなり強い</span><span><i class="legend-line medium"></i> つながりあり</span><span><i class="legend-line debated"></i> 意見が分かれる</span>';
    const help=document.querySelector('.graph-help');
    if(help){
      const spans=help.querySelectorAll('span');
      if(spans[0])spans[0].textContent='● 丸をタップ → 前後をたどる';
      if(spans[1])spans[1].textContent='↗ 矢印をタップ → なんで？を見る';
      const reset=help.querySelector('#resetSelection'); if(reset)reset.textContent='選び直す';
    }
    const footer=document.querySelector('footer p'); if(footer)footer.textContent='歴史は「原因はこれ！」で終わらない。強い矢印も、意見が分かれる矢印もあります。';
  }

  const style=document.createElement('style');
  style.textContent=`
    .source-details,.more-details{margin:16px 0;border-top:1px solid rgba(80,90,100,.12);padding-top:10px}
    .source-details summary,.more-details summary{cursor:pointer;font-weight:700;color:#45515c}
    .more-details p{line-height:1.8}
    .detail-panel h3{margin-top:22px;font-size:.95rem;color:#3e4b56}
    .detail-lead{font-size:1.04rem;line-height:1.9}
    .story-takeaway{font-size:1rem;line-height:1.75}
  `;
  document.head.appendChild(style);

  staticCopy(); storyDetail(null); emptyDetail();

  document.addEventListener('click',e=>{
    const node=e.target.closest?.('.node');
    if(node?.dataset.nodeId){queueMicrotask(()=>nodeDetail(node.dataset.nodeId));return;}
    const link=e.target.closest?.('.link-hit');
    if(link?.dataset.linkId){queueMicrotask(()=>linkDetail(link.dataset.linkId));return;}
    const story=e.target.closest?.('.story-button');
    if(story){queueMicrotask(()=>{storyDetail(story.dataset.storyId||null);emptyDetail();});return;}
    if(e.target.id==='resetSelection')queueMicrotask(emptyDetail);
  });
})();
