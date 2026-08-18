(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  const extra = window.CASE00A_DEEP_EXTRA_SOURCES = window.CASE00A_DEEP_EXTRA_SOURCES || {};
  Object.assign(extra, {
    V05_PRINT_CAM:{name:'Cambridge - Print and the Reformation: A Drama in Three Acts',url:'https://www.cambridge.org/core/journals/church-history/article/print-and-the-reformation-a-drama-in-three-acts/123C0401F52B07F6E2B91221E4D89E38'},
    V05_PRINT_DNB:{name:'German National Library - Book printing and reformation',url:'https://mediengeschichte.dnb.de/DBSMZBN/Content/EN/Printing/04-buchdruck-und-reformation-en.html'},
    V05_PRINT_READ:{name:'Cambridge - Poets, Peasants, and Pamphlets',url:'https://www.cambridge.org/core/product/identifier/S0424208400003946/type/journal_article'},
    V05_AUGSBURG:{name:'German History in Documents and Images - Religious Peace of Augsburg',url:'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi%3Adocument-4386'},
    V05_DEFEN:{name:'Cambridge - Persecution and Toleration / Defenestration of Prague',url:'https://www.cambridge.org/core/books/persecution-and-toleration/from-confessionalization-to-toleration-and-then-to-religious-liberty/89AFFE52007BF3717AB171A1BD9E0C2F'},
    V05_FRANCE_TYW:{name:'Encyclopædia Universalis - Thirty Years War and French intervention',url:'https://www.universalis.fr/encyclopedie/guerres-de-religion/4-la-guerre-de-trente-ans-1618-1648/'},
    V05_WESTPHALIA:{name:'Cambridge - The Westphalian myth and external sovereignty',url:'https://www.cambridge.org/core/books/abs/sovereignty-in-fragments/westphalian-myth-and-the-idea-of-external-sovereignty/894BD9AF4AAA7112F870084F05AFC8C4'},
    V05_PARL_FIN:{name:'UK Parliament - The Financial Revolution',url:'https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/revolution/overview/financialrevolution/'},
    V05_BOE:{name:'Bank of England - History',url:'https://www.bankofengland.co.uk/about/history?level=1'},
    V05_RS_TRANS:{name:'Royal Society - History of Philosophical Transactions',url:'https://royalsociety.org/journals/publishing-activities/publishing350/history-philosophical-transactions/'},
    V05_RS_MAKING:{name:'Royal Society - Behind the scenes of Philosophical Transactions',url:'https://makingscience.royalsociety.org/in-focus/focus-on-360-years-of-philosophical-transactions'},
    V05_WATT_PERSON:{name:'Science Museum Group - James Watt',url:'https://collection.sciencemuseumgroup.org.uk/people/ap24508/watt-james'},
    V05_WATT_COND:{name:'Science Museum - James Watt and the separate condenser',url:'https://blog.sciencemuseum.org.uk/james-watt-and-the-separate-condenser/'},
    V05_WATT_ROT:{name:'Science Museum Group - Rotative Steam Engine by Boulton and Watt, 1788',url:'https://collection.sciencemuseumgroup.org.uk/objects/co50948/rotative-steam-engine-by-boulton-and-watt-1788'},
    V05_ALLEN:{name:'Cambridge - The cheap energy economy (Robert C. Allen)',url:'https://www.cambridge.org/core/books/abs/british-industrial-revolution-in-global-perspective/cheap-energy-economy/6E488B5C4BECA8F3E0C78020510B391E'},
    V05_CONSUMER:{name:'Cambridge - The Consumer Revolution, 1650–1800',url:'https://www.cambridge.org/core/books/consumer-revolution-16501800/consumer-revolution/B0D100FAB19EE5302524F738EEF3BB98'},
    V05_SLAVE11:{name:'Cambridge - Economic importance of the slave plantation complex',url:'https://www.cambridge.org/core/journals/journal-of-global-history/article/on-the-economic-importance-of-the-slave-plantation-complex-to-the-british-economy-during-the-eighteenth-century-a-valueadded-approach/DBB1225FF928C09689B3EEFCA8F66C55'},
    V05_SLAVE_DEBATE:{name:'Cambridge - Slavery and the new history of capitalism',url:'https://www.cambridge.org/core/journals/journal-of-global-history/article/slavery-and-the-new-history-of-capitalism/6885E5697E7151B50FDEFC65ED96C79E'},
    V05_ARKWRIGHT:{name:'Science and Industry Museum - Richard Arkwright',url:'https://www.scienceandindustrymuseum.org.uk/objects-and-stories/richard-arkwright'}
  });

  const cards = {
    ST01:[
      {match:'印刷は最初から',kind:'twist',title:'実は、印刷業の「古参顧客」は宗教だった',text:'1450〜1520年に出版された本の約半分は、聖書・説教・典礼書・信心書など宗教関係だったとAndrew Pettegreeは整理しています。つまり宗教改革が突然「印刷を宗教化した」のではなく、もともと宗教は印刷市場のど真ん中にいました。',sources:['V05_PRINT_CAM']},
      {match:'宗教論争が「売れるコンテンツ」',kind:'number',title:'ウィッテンベルクの出版量、ほぼ別の街レベルに跳ねた',text:'Pettegreeによると、1502〜1516年のウィッテンベルクは計123点、年平均約8点。それが1517〜1546年には少なくとも2,721点、年平均約90点、約300万部規模へ。宗教改革は思想だけでなく、出版産業そのものを作り変えました。',sources:['V05_PRINT_CAM']},
      {match:'ルターが火をつけた',kind:'number',title:'1521年のヴォルムス帝国議会までに、ルター本は615版',text:'ルターがヴォルムス帝国議会に現れた1521年4月までに、彼の著作はすでに615版も出ていたとされます。「有名になってから本が売れた」というより、印刷が有名人ルターを作った面もかなり大きい。',sources:['V05_PRINT_CAM']},
      {match:'文字が読めない人',kind:'scale',title:'「識字率が低いのに？」を数字で見ると、さらに不思議',text:'研究では1518〜1526年に約600万部のパンフレットが刷られたという推計もあります。当時の神聖ローマ帝国の人口規模と比べても巨大です。だからこそ、個人で黙読する人だけでなく、朗読・説教・画像などを通じた二次拡散が重要になります。',sources:['V05_PRINT_READ']},
      {match:'宗教論争が「売れるコンテンツ」',kind:'scale',title:'1524年だけで約240万部という推計もある',text:'ドイツ国立図書館の展示解説では、1524年だけで約2,400種類の大衆向け印刷物が出て、合計約240万部に達したという推計が紹介されています。パンフレットは「補助メディア」ではなく、かなり巨大な情報市場でした。',sources:['V05_PRINT_DNB']}
    ],
    ST02:[
      {match:'アウクスブルクの和議',kind:'twist',title:'「信教の自由」ではない。むしろ“選べる宗派が2つ”',text:'1555年の宗教和議が認めたのは、カトリックとアウクスブルク信仰告白を受け入れるルター派が中心。それ以外の宗派は条文上はっきり除外されました。領主の宗派に従えない臣民には移住という選択肢がありましたが、現代的な信教の自由とはかなり違います。',sources:['V05_AUGSBURG']},
      {match:'役人を窓から投げた',kind:'twist',title:'窓から落とされた3人、約21m下まで落ちて全員生存',text:'1618年のプラハ窓外放出では、皇帝側の3人が約70フィート下へ投げ落とされたのに生き残りました。プロテスタント側は「肥料の山に落ちた」、カトリック側は「天使が救った」と説明したとされ、事件そのものが宗派ごとに別ストーリー化しています。',sources:['V05_DEFEN']},
      {match:'三十年戦争は「カトリック',kind:'twist',title:'カトリックのフランスが、プロテスタント側を支援する',text:'三十年戦争が単純な宗派対決でない象徴がフランスです。カトリック国フランスはハプスブルク家の強大化を警戒し、プロテスタント勢力を支援し、1635年には直接参戦しました。宗教より王朝・国家戦略が前に出る場面です。',sources:['V05_FRANCE_TYW']},
      {match:'ウェストファリアで',kind:'debate',title:'「1648年＝主権国家の誕生日」は、今ではかなり疑われている',text:'ウェストファリア講和を「主権国家システム誕生の日」とする説明は有名ですが、批判的研究では、条約本文は主権や不干渉原則を創設したわけではないと指摘されています。分かりやすい“誕生日”が、後世の物語として強くなった面があります。',sources:['V05_WESTPHALIA']}
    ],
    ST03:[
      {match:'フランスと戦争',kind:'number',title:'戦争代、年550万ポンド → 850万ポンド規模へ',text:'UK Parliamentの解説では、対仏戦争の年間コストは初期の約550万ポンドから終盤には約850万ポンドへ。新税で平均約500万ポンドを集めても足りない規模でした。「もっと借りられる国家」が必要になった理由が、数字で見るとよく分かります。',sources:['V05_PARL_FIN']},
      {match:'イングランド銀行、最初の大仕事',kind:'twist',title:'中央銀行のスタート、スタッフは17人＋門番2人',text:'イングランド銀行は1694年、対仏戦争の資金調達を主目的に始まりました。開業時のスタッフはわずか17人の事務員と2人の門番。いまの巨大中央銀行の原型が、かなり小さな組織から始まっています。',sources:['V05_BOE']},
      {match:'返してくれそう',kind:'system',title:'信用の正体は「議会が返済用の税を握っている」こと',text:'投資家が政府に貸せたのは、王様を信じたからだけではありません。議会が課税と使途を管理し、返済財源を制度として見せられたことが大きかった。金融の“信用”が政治制度から生まれる例です。',sources:['V05_PARL_FIN']},
      {match:'これが「金融革命」',kind:'twist',title:'戦費のための新税には「窓の数で豊かさを測る税」まで登場',text:'この時期の財政革新には、家の窓の数を富の目安として課税するWindow Taxも含まれました。金融革命というと国債や銀行ばかり見ますが、裏では「どうやって税を取るか」の試行錯誤もかなり泥くさい。',sources:['V05_PARL_FIN']}
    ],
    ST04:[
      {match:'科学が「ひとりでやる趣味」',kind:'twist',title:'世界最古級の科学誌、最初は“事務局長の個人事業”に近かった',text:'Philosophical Transactionsは1665年、王立協会書記Henry Oldenburgが編集・出版して始めました。毎月発行、価格は1シリング。王立協会によると、科学を広めつつ「少し儲けられたら」という面もあったようです。科学出版の始まりも、意外と起業っぽい。',sources:['V05_RS_TRANS']},
      {match:'科学が「ひとりでやる趣味」',kind:'twist',title:'しかも王立協会が正式に引き取るのは1752年',text:'今では王立協会の象徴のようなPhilosophical Transactionsですが、長く編集者個人が財政責任を負う形が続き、協会が正式に制度として引き取ったのは1752年でした。科学の制度化も、一気に完成したわけではありません。',sources:['V05_RS_TRANS']},
      {match:'科学が「ひとりでやる趣味」',kind:'detail',title:'初期号はだいたい16ページ、ほぼ毎月。匿名記事も多かった',text:'王立協会のアーカイブ解説では、初期のTransactionsは通常16ページほどで月刊。Oldenburgが手紙を抜粋・翻訳・編集して載せることも多く、現代の「完成した論文誌」とはかなり違う姿でした。',sources:['V05_RS_MAKING']},
      {match:'科学 → 技術は',kind:'debate',title:'「科学者が発見 → 技術者が応用」は、きれいすぎるモデル',text:'18世紀の技術革新は、理論科学だけでなく職人の技能、試作、商業上の必要、ネットワークが混ざって進みました。だから“有用知識が産業革命を押した”という説は重要でも、科学から工場へ一本線を引くのは慎重にしています。',sources:['S25','S33','S34']}
    ],
    ST05:[
      {match:'動く。でも、毎回シリンダー',kind:'number',title:'ワットが見たムダ、熱の約80%という説明も',text:'Science Museum Groupの解説では、ワットが修理したニューコメン機関の模型では、蒸気の熱の約80%がシリンダーを毎回温め直すために使われていたと説明されています。「ちょっと効率が悪い」ではなく、かなり大きなムダでした。',sources:['V05_WATT_PERSON']},
      {match:'ワットの分離凝縮器',kind:'number',title:'石炭消費を約3分の1以下にした',text:'Science Museumの解説では、分離凝縮器つきワット機関はニューコメン型に比べて石炭消費を約3分の1以下へ。改善幅が大きかったからこそ、炭鉱以外でも「燃料代を払って使う価値」が出てきました。',sources:['V05_WATT_COND','V05_WATT_ROT']},
      {match:'発明を“売れる機械”',kind:'twist',title:'アイデア完成から商用機まで、ざっくり11年',text:'ワットが分離凝縮器の実用モデルに到達したのは1765年ごろ。しかし最初の商用機が動くのは1776年。特許、資金、製造精度、熟練工、パートナー探しまで含めると、発明から普及までの“谷”はかなり長い。',sources:['V05_WATT_PERSON']},
      {match:'蒸気機関は一夜で',kind:'scale',title:'1800年までにBoulton & Wattは451基。うち268基が回転動力',text:'Science Museum Groupによると、Boulton & Wattの提携が終わる1800年までに451基が製造され、そのうち268基は回転運動を取り出すタイプでした。排水ポンプから、工場機械を回す動力へ用途が広がったことが数字でも見えます。',sources:['V05_WATT_ROT']}
    ],
    ST06:[
      {match:'人件費が高く、石炭が安い',kind:'scale',title:'Allen説では、英国は「高賃金」だけでなく“世界で最も安いエネルギー”',text:'Robert Allenは、18世紀英国の特徴を高賃金だけでなく、早くから発達した石炭産業による非常に安いエネルギー価格に求めます。人は高い、エネルギーは安い。この価格差が、省力機械を「発明するだけでなく使う」採算を作ったという説です。',sources:['V05_ALLEN']},
      {match:'人口が増え、モノを買う市場',kind:'twist',title:'「消費革命」といっても、みんなが豊かになったわけではない',text:'Cambridgeの研究では、消費拡大の中心は貴族・ジェントリ・専門職・熟練職人・比較的裕福な農民など。貧しい農民や非熟練労働者、移民、奴隷化された人々の多くは消費ブームから外れていました。「需要拡大＝全員の生活向上」ではありません。',sources:['V05_CONSUMER']},
      {match:'帝国と大西洋経済',kind:'number',title:'ある推計では、奴隷制プランテーション複合体が英国経済の約11%規模へ',text:'2018年のJournal of Global History論文は、奴隷制プランテーションに結びつく交易・活動が成長し、19世紀初頭には英国経済の約11%に相当する規模に達したと推計しています。帝国・奴隷制を「周辺の話」で済ませにくい数字です。',sources:['V05_SLAVE11']},
      {match:'帝国と大西洋経済',kind:'debate',title:'でも逆の因果もある。「工業化が大西洋市場を育てた」説',text:'別のCambridge論文は、18世紀後半の大西洋交易拡大のタイミングを見ると、初期の機械化が先に進み、安価な英国製品が植民地市場を拡大させた面も大きいと論じます。同論文では西インド諸島・北米向け輸出が海外貿易の11%（1700年）から56%（1800年）へ伸びたと紹介。因果の向きそのものが論争です。',sources:['V05_SLAVE_DEBATE']},
      {match:'水力紡績機が、人と機械',kind:'twist',title:'アークライトも「孤独な天才」ではない',text:'Science and Industry Museumは、同じ原理の機械を他の製作者も試しており、アークライトの独創性は生前から争われたと説明しています。大事だったのは機械だけでなく、特許・共同出資・大工場・運営まで組み合わせたことでした。',sources:['V05_ARKWRIGHT']}
    ]
  };

  Object.entries(cards).forEach(([storyId, items]) => {
    const story = stories[storyId];
    if (!story?.steps) return;
    items.forEach(card => {
      const step = story.steps.find(s => (s.title || '').includes(card.match));
      if (!step) return;
      step.v05cards = step.v05cards || [];
      const {match, ...payload} = card;
      step.v05cards.push(payload);
    });
  });
})();