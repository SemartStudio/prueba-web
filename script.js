/* ============================================
   SEMART STUDIO — JS 3.0
   ============================================ */

/* ----- CURSOR GLOW — efecto ambiente decorativo ----- */
const cursor = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  curX += (mouseX - curX) * 0.04;
  curY += (mouseY - curY) * 0.04;
  if (cursor) {
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ----- SCROLL PROGRESS ----- */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ----- NAVBAR SCROLL ----- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ----- HAMBURGER ----- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ----- INTERSECTION OBSERVER: reveal elements ----- */
const revealItems = document.querySelectorAll(
  '.svc-card, .price-card, .blog-card, .sector-item, .proc-step, .faq-item, .pack-card, .hero-stats-bar, .demo-card, .garantia-item'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(revealItems).indexOf(entry.target) % 6;
      setTimeout(() => entry.target.classList.add('visible'), idx * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealItems.forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ----- PROBLEM ITEMS stagger ----- */
const probItems = document.querySelectorAll('.prob-item');
const probObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      probObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
probItems.forEach(el => probObserver.observe(el));

/* ----- STAT COUNTERS ----- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterEls = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

/* ----- FAQ ACCORDION ----- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) answer.classList.add('open');
    }
  });
});

/* ----- PRICE TOGGLE ----- */
const tabOnce    = document.getElementById('tabOnce');
const tabMensual = document.getElementById('tabMensual');
const oncePrices  = document.querySelectorAll('.once-price');
const monthPrices = document.querySelectorAll('.month-price');

if (tabOnce && tabMensual) {
  tabOnce.addEventListener('click', () => {
    tabOnce.classList.add('active');
    tabMensual.classList.remove('active');
    tabOnce.setAttribute('aria-pressed', 'true');
    tabMensual.setAttribute('aria-pressed', 'false');
    oncePrices.forEach(el => el.style.display = 'flex');
    monthPrices.forEach(el => el.style.display = 'none');
  });

  tabMensual.addEventListener('click', () => {
    tabMensual.classList.add('active');
    tabOnce.classList.remove('active');
    tabMensual.setAttribute('aria-pressed', 'true');
    tabOnce.setAttribute('aria-pressed', 'false');
    oncePrices.forEach(el => el.style.display = 'none');
    monthPrices.forEach(el => el.style.display = 'flex');
  });
}

/* ----- CARD TILT ----- */
document.querySelectorAll('.svc-card, .blog-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* ----- PARALLAX HERO ----- */
const heroBgImg = document.querySelector('.hero-bg-img');
window.addEventListener('scroll', () => {
  if (!heroBgImg) return;
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroBgImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ----- ACTIVE NAV ----- */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links .nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${entry.target.id}`) {
          a.style.color = '#F2F6FF';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ----- CHATBOT DEMO ANIMATION ----- */
const chatMessages = [
  { type: 'client', text: '¿Tenéis disponibilidad mañana?' },
  { type: 'bot',    text: 'Sí. Tenemos disponibilidad a las 10:00 y a las 17:00. ¿Qué horario prefieres?' },
  { type: 'client', text: '17:00, perfecto.' },
  { type: 'bot',    text: 'Reservado. Recibirás confirmación en breve. ¡Hasta mañana!' },
];

function runChatDemo(chatBody) {
  let idx = 0;

  function showNext() {
    if (idx >= chatMessages.length) {
      setTimeout(() => {
        chatBody.innerHTML = '';
        idx = 0;
        setTimeout(showNext, 600);
      }, 3500);
      return;
    }

    const msg = chatMessages[idx];
    const el = document.createElement('div');
    el.className = `chat-msg chat-msg-${msg.type}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = msg.text;
    el.appendChild(bubble);
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });

    idx++;
    const delay = msg.type === 'bot' ? 2200 : 1400;
    setTimeout(showNext, delay);
  }

  setTimeout(showNext, 800);
}

const chatBody = document.getElementById('chatBody');
if (chatBody) {
  const chatObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runChatDemo(chatBody);
        chatObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  chatObserver.observe(chatBody);
}

/* ----- AUTOMATION FLOW ANIMATION ----- */
const autoFlow = document.getElementById('autoFlow');
if (autoFlow) {
  const afElements = autoFlow.querySelectorAll('.af-step, .af-arrow');
  const afObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        afElements.forEach((el, i) => {
          setTimeout(() => el.classList.add('af-visible'), i * 180);
        });
        afObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  afObserver.observe(autoFlow);
}
