// Галерея техник: фильтр по услугам и просмотр фото на весь экран.
// Фото подгружаются с CDN Unsplash (бесплатная лицензия), размер задаётся параметрами URL.

(() => {
  const CDN = 'https://images.unsplash.com/photo-';
  const thumbUrl = (id, w) => `${CDN}${id}?w=${w}&h=${Math.round(w * 1.25)}&fit=crop&crop=faces,entropy&auto=format&q=70`;
  const fullUrl = (id) => `${CDN}${id}?w=1600&auto=format&q=80`;

  const grid = document.querySelector('.gallery-grid');
  const chips = [...document.querySelectorAll('.gallery-filters .chip')];
  const items = [...grid.querySelectorAll('li')];
  const dialog = document.querySelector('.lightbox');
  const lbImg = dialog.querySelector('.lightbox-img');
  const lbTitle = dialog.querySelector('.lightbox-title');
  const lbCount = dialog.querySelector('.lightbox-count');
  const lbCredit = dialog.querySelector('.lightbox-credit');

  // Превью: 400 px для обычных экранов, 800 px для плотных
  items.forEach((li) => {
    const btn = li.querySelector('.shot');
    const img = btn.querySelector('img');
    const id = btn.dataset.photo;
    img.src = thumbUrl(id, 400);
    img.srcset = `${thumbUrl(id, 400)} 400w, ${thumbUrl(id, 800)} 800w`;
    img.sizes = '(max-width: 640px) 50vw, 33vw';
    img.width = 400;
    img.height = 500;
    btn.setAttribute('aria-label', `${img.alt} - открыть фото`);
  });

  // Фильтр
  const visibleItems = () => items.filter((li) => !li.hidden);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      items.forEach((li) => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
    });
  });

  // Просмотр
  let current = 0;
  let opener = null;

  function show(index) {
    const list = visibleItems();
    current = (index + list.length) % list.length;
    const btn = list[current].querySelector('.shot');
    const alt = btn.querySelector('img').alt;
    lbImg.src = fullUrl(btn.dataset.photo);
    lbImg.alt = alt;
    lbTitle.textContent = alt;
    lbCount.textContent = `${current + 1} из ${list.length}`;
    lbCredit.textContent = `Фото: ${btn.dataset.credit}, Unsplash`;
    // Заранее грузим соседние фото, чтобы листание было без задержки
    [current - 1, current + 1].forEach((i) => {
      const n = list[(i + list.length) % list.length];
      new Image().src = fullUrl(n.querySelector('.shot').dataset.photo);
    });
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.shot');
    if (!btn) return;
    opener = btn;
    show(visibleItems().indexOf(btn.closest('li')));
    dialog.showModal();
  });

  dialog.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());

  // Клик по тёмному фону закрывает просмотр
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { opener?.focus(); });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    if (e.key === 'Escape') { e.preventDefault(); dialog.close(); }
  });

  // Свайп на телефоне
  let startX = null;
  dialog.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  dialog.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
})();
