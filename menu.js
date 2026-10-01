// Меню разделов на узком экране: кнопка «Меню» открывает табличку под шапкой.

(() => {
  const header = document.querySelector('.site-header');
  const btn = header.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  const page = [document.querySelector('main'), document.querySelector('.site-footer')];
  const narrow = matchMedia('(max-width: 960px)');

  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';

  function set(open, returnFocus = true) {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    // Пока меню открыто, страница под ним недоступна с клавиатуры
    page.forEach((el) => { if (el) el.inert = open; });
    if (open) {
      menu.style.setProperty('--menu-top', `${header.getBoundingClientRect().bottom}px`);
      menu.querySelector('a').focus({ preventScroll: true });
    } else if (returnFocus) {
      btn.focus();
    }
  }

  btn.addEventListener('click', () => set(!isOpen()));

  // Переход по разделу или по логотипу закрывает меню, страница прокручивается как обычно
  header.addEventListener('click', (e) => {
    if (isOpen() && e.target.closest('a')) set(false, false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) set(false);
  });

  narrow.addEventListener('change', (e) => {
    if (!e.matches && isOpen()) set(false, false);
  });
})();
