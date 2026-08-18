(() => {
  const labels = {
    ST01:'ST01 印刷で宗教が爆速？',
    ST02:'ST02 宗教で国が変わる？',
    ST03:'ST03 戦争代、どう払う？',
    ST04:'ST04 科学は工場につながる？',
    ST05:'ST05 炭鉱の水 → 蒸気',
    ST06:'ST06 産業革命、結局なに？'
  };
  Object.entries(labels).forEach(([id,label]) => {
    const btn = document.querySelector(`.story-button[data-story-id="${id}"]`);
    if (btn) btn.textContent = label;
  });
  const all = document.querySelector('.story-button[data-story-id=""]');
  if (all) all.textContent = '全体を眺める';
})();