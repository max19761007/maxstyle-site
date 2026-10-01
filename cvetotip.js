// Тест «Определите свой сезон»: 5 признаков тёплый/холодный + светлые или тёмные волосы.

(() => {
  const form = document.querySelector('.quiz');
  const progress = form.querySelector('.quiz-progress');
  const answer = form.querySelector('.quiz-answer');
  const seasonEl = form.querySelector('.quiz-season');
  const whyEl = form.querySelector('.quiz-why');
  const link = form.querySelector('.quiz-link');
  const total = form.querySelectorAll('.q').length;

  const pick = { warm: { light: 'vesna', dark: 'osen' }, cold: { light: 'leto', dark: 'zima' } };
  const plural = (n) => (n === 1 ? 'признак' : n < 5 ? 'признака' : 'признаков');

  function update() {
    const checked = [...form.querySelectorAll('input:checked')];
    const left = total - checked.length;
    if (left > 0) {
      progress.hidden = false;
      answer.hidden = true;
      progress.textContent = checked.length ? `Осталось ответить: ${left} из ${total}` : `Ответьте на все ${total} вопросов`;
      return;
    }
    const temp = checked.filter((i) => i.closest('[data-kind="temp"]'));
    const warm = temp.filter((i) => i.value === 'warm').length;
    const isWarm = warm > temp.length / 2;
    const depth = checked.find((i) => i.closest('[data-kind="depth"]')).value;
    const id = pick[isWarm ? 'warm' : 'cold'][depth];
    const s = window.SEASONS[id];
    const main = isWarm ? warm : temp.length - warm;

    seasonEl.textContent = s.name;
    whyEl.textContent = `${main} ${plural(main)} из ${temp.length} ${isWarm ? 'тёплые' : 'холодные'}, волосы от природы ${depth === 'light' ? 'светлые' : 'тёмные'} - это ${s.name.toLowerCase()}, ${s.tag}. Посмотрите три подтипа и выберите, где узнаёте себя.`;
    link.href = `#${id}`;
    link.setAttribute('aria-label', `Смотреть оттенки: ${s.name}`);
    progress.hidden = true;
    answer.hidden = false;
  }

  form.addEventListener('change', update);
  form.addEventListener('reset', () => setTimeout(update, 0));
  form.addEventListener('submit', (e) => e.preventDefault());
})();
