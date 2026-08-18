(() => {
  'use strict';

  const stories = window.CASE00A_DEEP_STORIES;
  if (!stories) return;

  const storyMeta = {
    ST01: {
      label: '印刷で宗教が爆速？',
      question: 'ルターがすごかっただけなら、なぜここまで広がった？',
      takeaway: ['印刷は「原因」より「増幅器」', '宗教改革も印刷市場を大きくした', 'メディアは紙だけでなく、声・絵・歌にも乗った']
    },
    ST02: {
      label: '宗教で国が変わる？',
      question: '信仰の違いが、どうして税・軍隊・国づくりの話になる？',
      takeaway: ['宗派分裂は統治の問題になった', '和平はゴールではなく暫定ルール', '「宗教戦争→近代国家」は一本線ではない']
    },
    ST03: {
      label: '戦争代、どう払う？',
      question: '銀行や国債の話なのに、スタートが戦争なのはなぜ？',
      takeaway: ['戦争は「信用」を必要とした', '議会・税・借金・銀行がセットで育った', '金融革命＝産業革命の直接原因、とは限らない']
    },
    ST04: {
      label: '科学は工場につながる？',
      question: 'コペルニクスやニュートンから、どうやって工場の話まで行く？',
      takeaway: ['科学革命→産業革命は直通ではない', '印刷・観測・学会・出版が知識の回路を作った', '「役に立つ知識」がどこまで効いたかは議論中']
    },
    ST05: {
      label: '炭鉱の水 → 蒸気',
      question: '世界を変えた蒸気機関、最初の目的が「水抜き」って本当？',
      takeaway: ['発明の出発点は現場の困りごと', 'ニューコメン→ワットは改良の連続', '発明だけでなく商業化で広がった']
    },
    ST06: {
      label: '産業革命、結局なに？',
      question: '石炭？賃金？帝国？科学？銀行？――1個に決めなくていい？',
      takeaway: ['産業革命は「合流点」として見る', '強い因果と議論中の因果を分ける', '単独原因探しより、条件の組み合わせを見る']
    }
  };

  let activeStoryId = null;
  let lastKey = '';

  const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function currentStoryId() {
    const active = document.querySelector('.story-button.active');
    return active?.dataset.storyId || activeStoryId || null;
  }

  function currentStepIndex() {
    const kicker = document.querySelector('#detailPanel .story-kicker')?.textContent || '';
    const m = kicker.match(/ST\d+\s*[·・]\s*(\d+)\s*\//);
    return m ? Math.max(0, Number(m[1]) - 1) : 0;
  }

  function addSummaryGuide() {
    const storyId = currentStoryId();
    const meta = storyMeta[storyId];
    const box = document.getElementById('storySummary');
    if (!storyId || !meta || !box || box.querySelector('.v04-story-guide')) return;

    const guide = document.createElement('div');
    guide.className = 'v04-story-guide';
    guide.innerHTML = `
      <div class="v04-guide-question"><span>🤔</span><b>${esc(meta.question)}</b></div>
      <div class="v04-guide-hint">答えを先に覚えるより、「どこで話が曲がる？」を探しながら読むと面白いです。</div>`;
    box.appendChild(guide);
  }

  function addReaderPolish() {
    const panel = document.getElementById('detailPanel');
    const reader = panel?.querySelector('.deep-reader');
    if (!reader) return;

    const storyId = currentStoryId();
    const story = stories[storyId];
    const meta = storyMeta[storyId];
    if (!story || !meta) return;

    const idx = currentStepIndex();
    const step = story.steps?.[idx];
    if (!step) return;

    const key = `${storyId}:${idx}:${reader.querySelector('h2')?.textContent || ''}`;
    if (key === lastKey && reader.querySelector('.v04-step-extra')) return;
    lastKey = key;

    reader.querySelectorAll('.v04-step-extra,.v04-three-lines').forEach(el => el.remove());

    const oohLabel = reader.querySelector('.deep-ooh-label');
    if (oohLabel) oohLabel.textContent = '👀 ここ、ちょっと面白い';

    const detailsSummary = reader.querySelector('.deep-source-details summary');
    if (detailsSummary) detailsSummary.textContent = 'ほんと？ 出典を見る';

    const mapBox = reader.querySelector('.deep-map-box');
    if (mapBox) {
      const b = mapBox.querySelector('b');
      if (b) b.textContent = '左の地図だとここ';
      const btn = mapBox.querySelector('button');
      if (btn) btn.textContent = '地図で確認 👀';
    }

    const navButtons = reader.querySelectorAll('.deep-nav button');
    navButtons.forEach(btn => {
      const t = btn.textContent.trim();
      if (t.includes('前へ')) btn.textContent = '← ひとつ戻る';
      if (t === '次へ →') btn.textContent = 'つぎ →';
    });

    const extra = document.createElement('div');
    extra.className = 'v04-step-extra';

    if (!step.links || step.links.length === 0) {
      extra.innerHTML = `
        <div class="v04-bridge">
          <div class="v04-mini-label">🧩 地図に矢印がないけど？</div>
          <p>ミスではありません。ここは<strong>「間を埋める話」</strong>です。直接の原因とまでは言い切れないので線は引かず、右の読み物で橋をかけています。</p>
        </div>`;
    } else if (step.links.length >= 3) {
      extra.innerHTML = `
        <div class="v04-bridge v04-branch">
          <div class="v04-mini-label">🛣️ ここ、一本道じゃない</div>
          <p>矢印が何本も集まっています。こういう場所は「原因を1個に決める」より、<strong>何が同時に効いているか</strong>を見るのがコツです。</p>
        </div>`;
    } else {
      extra.innerHTML = `
        <div class="v04-pause">
          <span>💭</span><p><b>ちょっとだけ考える：</b> この矢印、逆向きの影響や別ルートもありそう？</p>
        </div>`;
    }

    const transition = reader.querySelector('.deep-transition');
    if (transition) transition.insertAdjacentElement('afterend', extra);

    if (idx === story.steps.length - 1) {
      const recap = document.createElement('div');
      recap.className = 'v04-three-lines';
      recap.innerHTML = `
        <div class="v04-mini-label">☕ この話、3行で持ち帰るなら</div>
        <ol>${meta.takeaway.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <p>これだけ覚えておけばOK。細かい年号は、必要になったら地図に戻れば大丈夫です。</p>`;
      const nav = reader.querySelector('.deep-nav');
      if (nav) nav.insertAdjacentElement('beforebegin', recap);
      else reader.appendChild(recap);
    }

    const progress = document.querySelectorAll('.deep-progress-step');
    progress.forEach((el, i) => el.classList.toggle('v04-done', i < idx));
  }

  function casualStaticCopy() {
    const header = document.querySelector('.app-header p');
    if (header) header.textContent = '年号を覚えるより、「なんで次につながった？」を追うほうが面白くない？';

    const footer = document.querySelector('footer p');
    if (footer) footer.textContent = '「原因はこれ！」と決めすぎないのが、この年表のルール。寄り道しながらどうぞ。';
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width:1041px) {
        body.deep-story-mode .workspace { grid-template-columns:minmax(430px,.86fr) minmax(520px,1.14fr) !important; }
        body.deep-story-mode .detail-panel { min-width:0; }
      }
      .v04-story-guide { margin-top:12px; padding-top:11px; border-top:1px dashed #ddd6ca; display:grid; gap:5px; }
      .v04-guide-question { display:flex; gap:8px; align-items:flex-start; font-size:13px; line-height:1.5; }
      .v04-guide-question span { font-size:16px; }
      .v04-guide-hint { color:#777067; font-size:11px; padding-left:24px; }
      .v04-step-extra { margin:10px 0 16px; }
      .v04-bridge { padding:12px 13px; border-radius:12px; background:#eef5f7; border:1px solid #cbdde1; }
      .v04-bridge.v04-branch { background:#f1f0fa; border-color:#d6d1ea; }
      .v04-mini-label { font-size:11px; font-weight:900; margin-bottom:5px; letter-spacing:.02em; }
      .v04-bridge p,.v04-pause p { margin:0; font-size:12.5px; line-height:1.65; }
      .v04-pause { display:flex; gap:8px; align-items:flex-start; color:#635f59; padding:5px 2px; }
      .v04-pause span { font-size:16px; }
      .v04-three-lines { margin:22px 0 14px; padding:15px 16px; border-radius:14px; background:#f5efe4; border:1px solid #e2d5c0; }
      .v04-three-lines ol { margin:8px 0 10px; padding-left:22px; }
      .v04-three-lines li { margin:5px 0; font-size:13px; line-height:1.55; font-weight:700; }
      .v04-three-lines p { margin:0; font-size:11px; color:#756d63; }
      .deep-progress-step.v04-done { background:#f7f8f6; border-color:#cfd7ce; }
      .deep-progress-step.v04-done > span { background:#6f8a70; color:#fff; }
      .deep-progress-step.v04-done > span::after { content:'✓'; }
      .deep-progress-step.v04-done > span { font-size:0; }
      .deep-progress-step.v04-done > span::after { font-size:10px; }
      @media (max-width:720px) {
        .v04-guide-hint { padding-left:0; }
        .v04-three-lines { padding:13px; }
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', e => {
    const storyButton = e.target.closest?.('.story-button');
    if (storyButton) activeStoryId = storyButton.dataset.storyId || null;
    setTimeout(() => { addSummaryGuide(); addReaderPolish(); }, 0);
  }, true);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => { addSummaryGuide(); addReaderPolish(); });
  });
  observer.observe(document.body, { childList:true, subtree:true });

  casualStaticCopy();
  installStyles();
})();
