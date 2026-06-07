/* ==========================================================
   Рома & Ксю — главная логика
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeartCursor();
  initHeader();
  initRevealOnScroll();
  initParallax();
  initCounter();
  renderMeet();
  initTimeline();
  renderCards();
  initMyth();
  initQuotes();
  renderGallery();
  initLightbox();
  initWheel();
  renderPlaylist();
  renderWishes();
  initEasterEgg();
  initScrollSpy();
});


/* ================ БЛОКИРОВКА СКРОЛЛА БЕЗ ПРЫЖКА СТРАНИЦЫ ================ */
// Используется лайтбоксом, модалкой свидания, пасхалкой и мобильным меню.
// Благодаря CSS-правилу `html { scrollbar-gutter: stable; }` место под скроллбар
// зарезервировано постоянно, поэтому страница не дрожит при overflow:hidden.
let _scrollLockCount = 0;
function lockScroll() {
  _scrollLockCount++;
  if (_scrollLockCount > 1) return;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}
function unlockScroll() {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount > 0) return;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}


/* ================ КУРСОР-СЕРДЕЧКО ================ */
function initHeartCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = document.getElementById('heartCursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!cursor.classList.contains('is-active')) cursor.classList.add('is-active');
  });

  document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('is-click'));
  document.addEventListener('mouseleave',() => cursor.classList.remove('is-active'));
  document.addEventListener('mouseenter',() => cursor.classList.add('is-active'));

  const animate = () => {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  };
  animate();
}


/* ================ ШАПКА ================ */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      if (isOpen) lockScroll(); else unlockScroll();
    });

    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        unlockScroll();
      });
    });
  }
}


/* ================ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ================ */
function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        // Лёгкая шахматная задержка для нескольких элементов одной секции
        const delay = (e.target.dataset.delay) ? Number(e.target.dataset.delay) : idx * 60;
        setTimeout(() => e.target.classList.add('is-visible'), Math.min(delay, 300));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}


/* ================ ПАРАЛЛАКС ================ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const rect = el.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (inView) {
        el.style.transform = `${getBaseTransform(el)} translate3d(0, ${y * speed}px, 0)`;
      }
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}
function getBaseTransform(el) {
  // сохраняем поворот hero-photo
  if (el.classList.contains('hero-photo-left'))  return 'rotate(-4deg)';
  if (el.classList.contains('hero-photo-right')) return 'rotate(4deg)';
  return '';
}


/* ================ СЧЁТЧИК ================ */
function initCounter() {
  const startMs = new Date(START_DATE_ISO).getTime();
  const elD = document.getElementById('cntDays');
  const elH = document.getElementById('cntHours');
  const elM = document.getElementById('cntMinutes');
  const elS = document.getElementById('cntSeconds');
  if (!elD) return;

  const tick = () => {
    const diff = Math.max(0, Date.now() - startMs);
    const totalSec = Math.floor(diff / 1000);
    const days    = Math.floor(totalSec / 86400);
    const hours   = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    elD.textContent = days;
    elH.textContent = String(hours).padStart(2, '0');
    elM.textContent = String(minutes).padStart(2, '0');
    elS.textContent = String(seconds).padStart(2, '0');
  };
  tick();
  setInterval(tick, 1000);
}


/* ================ КАК МЫ ВСТРЕТИЛИСЬ ================ */
function renderMeet() {
  const root = document.getElementById('meetList');
  if (!root) return;

  MEET_STORY.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'meet-row reveal' + (idx % 2 === 1 ? ' is-reversed' : '');

    row.innerHTML = `
      <div class="meet-photo">
        <img src="${item.photo}" alt="" onerror="this.classList.add('img-placeholder')" />
      </div>
      <div class="meet-text">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    `;
    root.appendChild(row);
  });

  // обновляем reveal-наблюдатель для новых блоков
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  root.querySelectorAll('.reveal').forEach(el => io.observe(el));
}


/* ================ ТАЙМЛАЙН ================ */
function initTimeline() {
  const track = document.getElementById('tlTrack');
  const dotsBox = document.getElementById('tlDots');
  const prevBtn = document.getElementById('tlPrev');
  const nextBtn = document.getElementById('tlNext');
  if (!track) return;

  // Слайды
  track.innerHTML = TIMELINE.map(ev => `
    <div class="timeline-slide">
      <div class="timeline-photos n-${Math.min(ev.photos.length, 3)}">
        ${ev.photos.slice(0, 3).map(p => `<img src="${p}" alt="" onerror="this.classList.add('img-placeholder')" />`).join('')}
      </div>
      <div class="timeline-info">
        <p class="timeline-date">${ev.date}</p>
        <h3 class="timeline-title">${ev.title}</h3>
        <p class="timeline-desc">${ev.desc}</p>
      </div>
    </div>
  `).join('');

  // Точки временной линии
  dotsBox.innerHTML = TIMELINE.map((ev, i) => `
    <button class="timeline-dot" data-idx="${i}" aria-label="${ev.shortLabel}">
      <span class="timeline-dot-label">${ev.shortLabel}</span>
    </button>
  `).join('');

  let idx = 0;
  const total = TIMELINE.length;
  const update = () => {
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsBox.querySelectorAll('.timeline-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
    });
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === total - 1;
  };
  update();

  prevBtn.addEventListener('click', () => { if (idx > 0) { idx--; update(); } });
  nextBtn.addEventListener('click', () => { if (idx < total - 1) { idx++; update(); } });
  dotsBox.querySelectorAll('.timeline-dot').forEach(d => {
    d.addEventListener('click', () => { idx = Number(d.dataset.idx); update(); });
  });
}


/* ================ КАРТОЧКИ Р vs К ================ */
function renderCards() {
  const renderTraits = (traits) => traits.map(t => `
    <li>
      <span class="trait-icon">${t.icon}</span>
      <div style="flex:1; min-width:0;">
        <div class="trait-label">${t.label}</div>
        <div class="trait-value">${t.value}</div>
      </div>
    </li>
  `).join('');

  const ksyuDesc = document.getElementById('ksyuDesc');
  const ksyuTraits = document.getElementById('ksyuTraits');
  if (ksyuDesc) ksyuDesc.textContent = KSYU.description;
  if (ksyuTraits) ksyuTraits.innerHTML = renderTraits(KSYU.traits);

  const romaDesc = document.getElementById('romaDesc');
  const romaTraits = document.getElementById('romaTraits');
  if (romaDesc) romaDesc.textContent = ROMA.description;
  if (romaTraits) romaTraits.innerHTML = renderTraits(ROMA.traits);
}


/* ================ ПРАВДА ИЛИ МИФ ================ */
function initMyth() {
  const card = document.getElementById('mythCard');
  const stmt = document.getElementById('mythStatement');
  const btnBox = document.getElementById('mythButtons');
  const result = document.getElementById('mythResult');
  const next = document.getElementById('mythNext');
  if (!card) return;

  let current = null;
  let answered = false;

  const pickRandom = () => {
    let pick;
    do { pick = MYTH_FACTS[Math.floor(Math.random() * MYTH_FACTS.length)]; }
    while (MYTH_FACTS.length > 1 && pick === current);
    current = pick;
  };

  const show = () => {
    pickRandom();
    stmt.textContent = current.text;
    card.classList.remove('is-correct', 'is-wrong');
    result.classList.remove('is-visible');
    next.classList.remove('is-visible');
    result.textContent = '';
    answered = false;
    btnBox.querySelectorAll('.game-btn').forEach(b => { b.disabled = false; b.classList.remove('is-chosen'); });
  };

  btnBox.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const userAnswer = btn.dataset.answer === 'true';
      const correct = userAnswer === current.isTrue;

      card.classList.add(correct ? 'is-correct' : 'is-wrong');
      btn.classList.add('is-chosen');
      btnBox.querySelectorAll('.game-btn').forEach(b => b.disabled = true);

      result.textContent = (correct ? 'Точно! ' : 'А вот и нет. ') +
        (current.isTrue ? 'Это правда. ' : 'Это миф. ') +
        (current.hint || '');
      result.classList.add('is-visible');
      next.classList.add('is-visible');
    });
  });

  next.addEventListener('click', show);
  show();
}


/* ================ УГАДАЙ, КТО СКАЗАЛ ================ */
function initQuotes() {
  const card = document.getElementById('quoteCard');
  const text = document.getElementById('quoteText');
  const btnBox = document.getElementById('quoteButtons');
  const result = document.getElementById('quoteResult');
  const next = document.getElementById('quoteNext');
  if (!card) return;

  let current = null;
  let answered = false;

  const pickRandom = () => {
    let pick;
    do { pick = QUOTES[Math.floor(Math.random() * QUOTES.length)]; }
    while (QUOTES.length > 1 && pick === current);
    current = pick;
  };

  const show = () => {
    pickRandom();
    text.textContent = current.text;
    card.classList.remove('is-correct', 'is-wrong');
    result.classList.remove('is-visible');
    next.classList.remove('is-visible');
    result.textContent = '';
    answered = false;
    btnBox.querySelectorAll('.game-btn').forEach(b => { b.disabled = false; b.classList.remove('is-chosen'); });
  };

  btnBox.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = btn.dataset.answer === current.author;
      card.classList.add(correct ? 'is-correct' : 'is-wrong');
      btn.classList.add('is-chosen');
      btnBox.querySelectorAll('.game-btn').forEach(b => b.disabled = true);

      const who = current.author === 'roma' ? 'Рома' : 'Ксю';
      result.textContent = correct ? `В точку — это сказал${current.author === 'ksyu' ? 'а' : ''} ${who}.`
                                    : `Ну почти. На самом деле это ${who}.`;
      result.classList.add('is-visible');
      next.classList.add('is-visible');
    });
  });

  next.addEventListener('click', show);
  show();
}


/* ================ ФОТОГАЛЕРЕЯ ================ */
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = GALLERY.map((src, i) => `
    <div class="gallery-item" data-idx="${i}">
      <img src="${src}" alt="Фото ${i + 1}" loading="lazy" onerror="this.classList.add('img-placeholder')" />
    </div>
  `).join('');
}


/* ================ ЛАЙТБОКС ================ */
function initLightbox() {
  const grid = document.getElementById('galleryGrid');
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lbImage');
  const closeBtn = document.getElementById('lbClose');
  const prevBtn = document.getElementById('lbPrev');
  const nextBtn = document.getElementById('lbNext');
  const counter = document.getElementById('lbCounter');
  if (!grid || !box) return;

  let cur = 0;

  const open = (i) => {
    cur = i;
    update();
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    lockScroll();
  };
  const close = () => {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    unlockScroll();
  };
  const update = () => {
    img.src = GALLERY[cur];
    img.alt = `Фото ${cur + 1} из ${GALLERY.length}`;
    counter.textContent = `${cur + 1} / ${GALLERY.length}`;
  };
  const next = () => { cur = (cur + 1) % GALLERY.length; update(); };
  const prev = () => { cur = (cur - 1 + GALLERY.length) % GALLERY.length; update(); };

  grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) open(Number(item.dataset.idx));
  });
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  box.addEventListener('click', e => {
    if (e.target === box) close();
  });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });
}


/* ================ КОЛЕСО СВИДАНИЙ ================ */
function initWheel() {
  const svg = document.getElementById('wheelSvg');
  const g   = document.getElementById('wheelG');
  const btn = document.getElementById('wheelBtn');
  const modal = document.getElementById('dateModal');
  const dateTitle = document.getElementById('dateTitle');
  const dateDesc = document.getElementById('dateDesc');
  const spinAgain = document.getElementById('dateSpinAgain');
  if (!svg || !g) return;

  const N = DATES.length;
  const colors = [
    '#EA9CAF', '#C2DC80', '#D56989', '#F3EEF1',
  ];
  const segAngle = 360 / N;

  // Рисуем сегменты как pie-кусочки
  const r = 200;
  for (let i = 0; i < N; i++) {
    const a1 = (i * segAngle - 90) * Math.PI / 180;
    const a2 = ((i + 1) * segAngle - 90) * Math.PI / 180;
    const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
    const x2 = r * Math.cos(a2), y2 = r * Math.sin(a2);
    const large = segAngle > 180 ? 1 : 0;
    const path = `M 0 0 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

    const segEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    segEl.setAttribute('d', path);
    segEl.setAttribute('fill', colors[i % colors.length]);
    segEl.setAttribute('stroke', '#fff');
    segEl.setAttribute('stroke-width', '2');
    g.appendChild(segEl);

    // Текст в сегменте — по центру сегмента, радиально (на 90° от тангенциального)
    const tA = ((i + 0.5) * segAngle - 90) * Math.PI / 180;
    const tr = r * 0.62;
    const tx = tr * Math.cos(tA);
    const ty = tr * Math.sin(tA);
    // Угол поворота: радиальный = центральный угол сегмента (0° = вверх).
    // Если получается, что текст будет читаться вверх ногами — разворачиваем на 180°.
    let deg = (i + 0.5) * segAngle - 90;
    const norm = ((deg % 360) + 360) % 360;
    if (norm > 90 && norm < 270) deg += 180;

    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', tx.toFixed(2));
    t.setAttribute('y', ty.toFixed(2));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'middle');
    t.setAttribute('class', 'wheel-segment-text');
    t.setAttribute('transform', `rotate(${deg.toFixed(2)}, ${tx.toFixed(2)}, ${ty.toFixed(2)})`);
    t.textContent = DATES[i].short;
    g.appendChild(t);
  }

  let currentRotation = 0;
  let spinning = false;

  const spin = () => {
    if (spinning) return;
    spinning = true;
    btn.disabled = true;

    // случайный сегмент
    const winner = Math.floor(Math.random() * N);
    // углы возрастают по часовой стрелке от верха (где указатель)
    // сегмент i центрирован под углом (i + 0.5) * segAngle
    // чтобы он попал под указатель сверху — нужно вращение,
    // которое приводит этот сегмент в позицию 0
    const targetDeg = -((winner + 0.5) * segAngle);
    const fullSpins = 5; // 5 полных оборотов для драматизма
    const finalRotation = currentRotation + fullSpins * 360 + ((targetDeg - (currentRotation % 360)) + 720) % 360;

    svg.style.transform = `rotate(${finalRotation}deg)`;
    currentRotation = finalRotation;

    setTimeout(() => {
      openDateModal(DATES[winner]);
      spinning = false;
      btn.disabled = false;
    }, 5100);
  };

  const openDateModal = (date) => {
    dateTitle.textContent = date.title;
    dateDesc.textContent = date.desc;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    unlockScroll();
  };

  btn.addEventListener('click', spin);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  spinAgain.addEventListener('click', () => {
    closeModal();
    setTimeout(spin, 350);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}


/* ================ ПЛЕЙЛИСТ ================ */
function renderPlaylist() {
  const renderTracks = (tracks) => tracks.map(t => `
    <li class="track-item">
      <div class="track-cover">
        <img src="${t.cover}" alt="" onerror="this.classList.add('img-placeholder')" />
      </div>
      <div class="track-info">
        <div class="track-title">${t.title}</div>
        <div class="track-artist">${t.artist}</div>
      </div>
      <a class="track-link" href="${t.link}" target="_blank" rel="noopener" aria-label="Слушать в Яндекс.Музыке">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </a>
    </li>
  `).join('');

  const k = document.getElementById('ksyuTracks');
  const r = document.getElementById('romaTracks');
  if (k) k.innerHTML = renderTracks(KSYU_TRACKS);
  if (r) r.innerHTML = renderTracks(ROMA_TRACKS);
}


/* ================ ДОСКА ЖЕЛАНИЙ ================ */
function renderWishes() {
  const grid = document.getElementById('wishesGrid');
  if (!grid) return;
  grid.innerHTML = WISHES.map(w => `
    <article class="wish-card">
      <div class="wish-photo">
        <img src="${w.photo}" alt="" loading="lazy" onerror="this.classList.add('img-placeholder')" />
      </div>
      <div class="wish-body">
        <h3 class="wish-title">${w.title}</h3>
        <p class="wish-desc">${w.desc}</p>
      </div>
    </article>
  `).join('');
}


/* ================ ПАСХАЛКА: 5 КЛИКОВ ПО ЛОГОТИПУ ================ */
function initEasterEgg() {
  const logo = document.getElementById('logoBtn');
  const overlay = document.getElementById('easterOverlay');
  const closeBtn = document.getElementById('easterClose');
  if (!logo || !overlay) return;

  let clicks = 0;
  let timer = null;

  logo.addEventListener('click', (e) => {
    // позволим скроллу-сверху сработать только если меньше 5 кликов
    clicks++;
    logo.classList.add('is-easter');
    setTimeout(() => logo.classList.remove('is-easter'), 400);

    clearTimeout(timer);
    timer = setTimeout(() => clicks = 0, 2000); // сбрасываем счётчик через 2с

    if (clicks >= 5) {
      e.preventDefault();
      clicks = 0;
      open();
    }
  });

  const open = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    lockScroll();
  };
  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    unlockScroll();
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(); });
}


/* ================ ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА В НАВИГАЦИИ ================ */
function initScrollSpy() {
  const links = document.querySelectorAll('.nav-desktop [data-nav]');
  if (!links.length) return;
  const sections = Array.from(links).map(a => {
    const id = a.getAttribute('href').slice(1);
    return { id, el: document.getElementById(id), link: a };
  }).filter(s => s.el);

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s.el));
}
