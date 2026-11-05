// Havolalar shu yerda. O'zgartirish kerak bo'lsa, faqat shu qatorni tahrirlang.
const LINKS = {
  bot: 'https://t.me/Qryptex_bot',
  channel: 'https://t.me/Qryptex_lab',
  insta: 'https://www.instagram.com/qryptex_lab'
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

$$('[data-link]').forEach(a => { a.href = LINKS[a.dataset.link]; });

// Xabar (toast)
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 3500);
}

// Nusxa olish (clipboard)
function copy(text) {
  const fallback = () => {
    const a = document.createElement('textarea');
    a.value = text; a.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(a); a.select();
    try { document.execCommand('copy'); } catch (e) {}
    a.remove();
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(fallback);
  } else fallback();
}

// Fon: 0 va 1 yomg'iri (videodagidek)
(function () {
  if (RM) return;
  const c = $('#rain'), x = c.getContext('2d'), fs = 16;
  let cols, drops, last = 0;
  function size() {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.ceil(c.width / fs);
    drops = Array.from({ length: cols }, () => Math.random() * c.height / fs);
  }
  size(); addEventListener('resize', size);
  function draw(ts) {
    if (ts - last > 60) {
      last = ts;
      x.fillStyle = 'rgba(5,8,10,.15)'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#39ff6a'; x.font = fs + 'px monospace';
      for (let i = 0; i < cols; i++) {
        x.fillText(Math.random() < .5 ? '0' : '1', i * fs, drops[i] * fs);
        if (drops[i] * fs > c.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

// 3-2-1 sanoq: bo'lim ko'ringanda boshlanadi
const num = $('#num'), fill = $('#fill'), gone = $('#gone'), idle = gone.textContent;
let ct;
function run() {
  clearTimeout(ct);
  let n = 3;
  num.textContent = n; gone.textContent = idle;
  fill.style.transition = 'none'; fill.style.width = '100%';
  void fill.offsetWidth;
  fill.style.transition = 'width 3s linear'; fill.style.width = '0';
  (function step() {
    ct = setTimeout(() => {
      n--; num.textContent = n;
      if (n > 0) step();
      else { gone.textContent = 'Клиент ушёл к конкурентам.'; ct = setTimeout(run, 2500); }
    }, 1000);
  })();
}
if (!RM) new IntersectionObserver(([e]) => e.isIntersecting ? run() : clearTimeout(ct), { threshold: .6 }).observe($('#count'));

// Tezkor tekshiruv
const boxes = $$('.ck input');
const VERDICTS = [
  'Сайт в порядке, но взгляд со стороны не помешает',
  'Мелочи, которые стоит поправить',
  'Есть что улучшить',
  'Сайт теряет клиентов',
  'Нужен срочный разбор'
];
function update() {
  const n = boxes.filter(b => b.checked).length, s = 100 - n * 25, r = $('#ring');
  $('#score').textContent = s;
  $('#verdict').textContent = VERDICTS[n];
  r.style.setProperty('--s', s);
  r.style.setProperty('--c', s >= 75 ? '#39ff6a' : s >= 50 ? '#ffd166' : '#ff5064');
}
boxes.forEach(b => b.addEventListener('change', update));
update();

$('#send').addEventListener('click', () => {
  const problems = boxes.filter(b => b.checked).map(b => b.value);
  const url = $('#siteUrl').value.trim();
  const msg = 'АУДИТ\nСайт: ' + (url || 'ссылку отправлю позже') +
              '\nПроблемы: ' + (problems.length ? problems.join(', ') : 'не отмечены');
  copy(msg);
  toast('Текст скопирован. Вставьте его в чат с ботом.');
  window.open(LINKS.bot, '_blank', 'noopener');
});

// ===== Konstruktor: sayt yoki bot tanlash va buyurtma =====
const S = { mode: 'site', type: 'visit', ckey: 'green', color: '#39ff6a', cname: 'зелёный', style: 'modern', bg: 'dark', bot: 'orders', name: '' };
const TYPES = { visit: 'Сайт-визитка', landing: 'Лендинг', shop: 'Интернет-магазин', portfolio: 'Портфолио' };
const STY = { strict: 'Строгий', modern: 'Современный', bright: 'Яркий' };
const BGN = { dark: 'Тёмный', light: 'Светлый' };
const BOTS = { orders: 'Приём заказов', booking: 'Запись на услуги', faq: 'Ответы на вопросы', catalog: 'Каталог товаров' };
const KB = {
  orders: ['Сделать заказ', 'Меню', 'Мои заказы'], booking: ['Записаться', 'Услуги', 'Мои записи'],
  faq: ['Частые вопросы', 'Связаться с оператором', 'О нас'], catalog: ['Каталог', 'Корзина', 'Контакты']
};
const OPT = { pay: 'оплата в боте', mail: 'рассылка клиентам', admin: 'панель администратора' };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let MSG = '', PAYLOAD = '';

function render() {
  const nm = S.name.trim(), shown = esc(nm || 'Ваш бизнес');
  $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  $$('.grp').forEach(g => { g.hidden = g.dataset.for !== S.mode; });
  $$('#colors button').forEach(b => b.classList.toggle('on', b.dataset.k === S.ckey));
  $$('#styles button').forEach(b => b.classList.toggle('on', b.dataset.v === S.style));
  $$('#bgs button').forEach(b => b.classList.toggle('on', b.dataset.v === S.bg));
  const opts = $$('.opt').filter(o => o.checked).map(o => o.value);
  const chips = (a) => '<div class="row">' + a.map(x => '<span class="chip">' + x + '</span>').join('') + '</div>';
  let pv, lines;
  if (S.mode === 'site') {
    const bodies = {
      visit: '<h4>' + shown + '</h4><p>Коротко о нас и о том, чем мы можем помочь.</p><span class="fbtn">Связаться</span>' + chips(['Услуги', 'О нас', 'Контакты']),
      landing: '<h4>Главное предложение для вашего клиента</h4><p>' + shown + ': одна понятная цель и одна кнопка.</p><span class="fbtn">Оставить заявку</span>' + chips(['Быстро', 'Удобно', 'Надёжно']),
      shop: '<h4>' + shown + '</h4><div class="pg">' + '<div class="pc"><i></i><span>Товар</span></div>'.repeat(4) + '</div><span class="fbtn">В корзину</span>',
      portfolio: '<h4>Наши работы</h4><div class="pg">' + '<div class="pc"><span>Работа</span></div>'.repeat(6) + '</div><span class="fbtn">Обсудить проект</span>'
    };
    pv = '<div class="frame" data-s="' + S.style + '" data-bg="' + S.bg + '" style="--ac:' + S.color + '"><div class="fh"><b>' + shown + '</b><span>≡</span></div><div class="fb">' + bodies[S.type] + '</div></div>';
    lines = ['Заказ: сайт', 'Бизнес: ' + (nm || 'не указан'), 'Тип: ' + TYPES[S.type], 'Цвет: ' + S.cname, 'Стиль: ' + STY[S.style], 'Фон: ' + BGN[S.bg]];
    PAYLOAD = ['site', S.type, S.ckey, S.style, S.bg].join('_');
  } else {
    const btns = KB[S.bot].slice();
    if (opts.includes('pay')) btns.push('Оплатить');
    pv = '<div class="chat"><div class="ch">' + shown + '</div><div class="cb"><div class="msg">Здравствуйте! Это бот «' + shown + '». Чем помочь?</div><div class="kb">' +
      btns.map(b => '<span>' + b + '</span>').join('') + '</div><div class="msg me">' + btns[0] + '</div></div></div>';
    lines = ['Заказ: Telegram-бот', 'Бизнес: ' + (nm || 'не указан'), 'Задача: ' + BOTS[S.bot], 'Дополнительно: ' + (opts.map(o => OPT[o]).join(', ') || 'нет')];
    PAYLOAD = 'bot_' + S.bot + opts.map(o => '_' + o).join('');
  }
  PAYLOAD = PAYLOAD.slice(0, 64);
  MSG = lines.join('\n');
  $('#pv').innerHTML = pv;
  $('#sum').textContent = MSG;
}

$('#builder').addEventListener('click', e => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.mode) S.mode = t.dataset.mode;
  else if (t.dataset.k) { S.ckey = t.dataset.k; S.color = t.dataset.c; S.cname = t.dataset.n; }
  else if (t.closest('#styles')) S.style = t.dataset.v;
  else if (t.closest('#bgs')) S.bg = t.dataset.v;
  render();
});
$('#builder').addEventListener('input', e => {
  if (e.target.id === 'bizName') S.name = e.target.value;
  else if (e.target.id === 'siteType') S.type = e.target.value;
  else if (e.target.id === 'botType') S.bot = e.target.value;
  render();
});
$('#orderBtn').addEventListener('click', () => {
  copy(MSG);
  toast('Выбор скопирован. Вставьте его в чат с ботом.');
  window.open(LINKS.bot + '?start=' + encodeURIComponent(PAYLOAD), '_blank', 'noopener');
});
render();
