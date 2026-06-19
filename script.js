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
  { type: 'bot',    text: '¡Hola! Soy el asistente de Estudio Pelo. ¿En qué puedo ayudarte?' },
  { type: 'client', text: '¿Tenéis hueco el sábado por la mañana?' },
  { type: 'bot',    text: 'Sí, tenemos disponibilidad a las 10:00, 11:30 y 12:15. ¿Cuál te viene mejor?' },
  { type: 'client', text: '11:30 perfecto' },
  { type: 'bot',    text: 'Reservado ✅ Sábado a las 11:30. Recibirás confirmación en WhatsApp ahora mismo.' },
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

/* ============================================================
   FLOATING CHATBOT WIDGET — Asistente Semart Studio
   ============================================================ */

const botKB = [
  {
    match: /^(hola|hey|buenos|buenas|ola|hi|hello|qué tal|que tal|saludos)(\s.*)?$/i,
    reply: `¡Hola! 👋 Soy el asistente de Semart Studio.\n\nPuedo ayudarte con información sobre servicios, precios y cómo podemos hacer crecer tu negocio. ¿Por dónde empezamos?`
  },
  {
    match: /precio|cuánto|cuanto|coste|presupuest|cuota|tarifa|pagar|cobr|vale\?|cuest/i,
    reply: `Nuestros precios orientativos son:\n\n💻 Web Profesional — desde 450€ (único) o 80€/mes\n⚡ Automatizaciones — desde 150€/mes\n🤖 Chatbot IA — desde 250€/mes\n🚀 Pack Completo — desde 2.500€ o 300€/mes\n\nSiempre hacemos un presupuesto adaptado a tu negocio antes de empezar. ¿Quieres una consulta gratuita sin compromiso?`
  },
  {
    match: /web|pág|diseño web|website|página|pagina web/i,
    reply: `Nuestra Web Profesional incluye:\n\n✓ Diseño único a medida (sin plantillas)\n✓ Optimizada para aparecer en Google\n✓ Perfecta en móvil y ordenador\n✓ Botón WhatsApp siempre visible\n✓ Sistema de reservas integrado\n✓ Google Maps + reseñas integradas\n✓ Lista en 2–4 semanas\n\n¿Para qué tipo de negocio la necesitas?`
  },
  {
    match: /automatiz|reserva|cita|recordatorio|whatsapp business|confirmaci/i,
    reply: `Las automatizaciones trabajan por ti 24h:\n\n⚡ Confirmación automática al instante al reservar\n⚡ Recordatorio 24h antes (reduce cancelaciones un 60%)\n⚡ Seguimiento de clientes que no confirmaron\n⚡ Solicitud de reseña automática tras la visita\n⚡ Reactivación de clientes inactivos\n\nTodo funciona sin que tengas que hacer nada. ¿Para qué sector es?`
  },
  {
    match: /chatbot|bot|asistente virtual|inteligencia artificial|ia|24h|24 hora/i,
    reply: `El Chatbot IA es como tener un empleado 24h:\n\n✓ Responde preguntas al instante (precios, horarios, servicios)\n✓ Agenda citas sin intervención humana\n✓ Funciona en tu web, WhatsApp e Instagram\n✓ Entrenado con los datos REALES de tu negocio\n✓ Disponible 24h, 7 días a la semana\n\nEste mismo chat que estás usando ahora es un ejemplo de cómo funcionaría el tuyo. ¿Te interesa?`
  },
  {
    match: /pack|completo|todo|combo|bundle/i,
    reply: `El Pack Completo es nuestra solución más potente:\n\n🚀 Web Profesional a medida\n🚀 Automatizaciones IA (reservas, recordatorios, reseñas)\n🚀 Chatbot IA 24h integrado\n🚀 Soporte prioritario directo con Sergio\n\nDesde 2.500€ (único) o 300€/mes. Es lo que más negocios eligen porque todo está integrado desde el primer día. ¿Hablamos?`
  },
  {
    match: /tiempo|plazo|tarda|cuando|cuándo|cuanto tiempo|entrega|semana/i,
    reply: `Los plazos habituales son:\n\n📅 Web Profesional: 2–4 semanas\n📅 Automatizaciones: 1–2 semanas\n📅 Chatbot IA: 1–2 semanas\n📅 Pack Completo: 3–5 semanas\n\nEn cada fase recibes avances para revisar y aprobar. Nada se publica sin tu visto bueno.`
  },
  {
    match: /sergio|quién|quien|fundador|sobre|equipo|quien eres/i,
    reply: `Hola, soy Sergio Martínez, fundador de Semart Studio 👋\n\nVengo del mundo de la hostelería y la logística. Sé lo que es un negocio real — con clientes, urgencias y márgenes ajustados.\n\nMi enfoque: primero entiendo tu negocio, luego busco la solución que más sentido tiene para ti. Sin tecnicismos ni sorpresas.`
  },
  {
    match: /cancel|permanencia|contrato|obligat|salir|baja|vincul/i,
    reply: `Sin permanencias. Sin contratos de larga duración.\n\nPuedes cancelar el mantenimiento cuando quieras con solo avisarme. Tu web y tus automatizaciones siempre son tuyas — no dependen de nosotros para seguir funcionando.\n\nQueremos que sigas porque estás satisfecho, no por obligación.`
  },
  {
    match: /valencia|donde|dónde|localiz|presencial|españa|ciudad|ubicaci/i,
    reply: `Trabajamos con negocios de toda España — y también fuera — de forma 100% online.\n\nSi estás en Valencia o alrededores, también podemos colaborar presencialmente si lo prefieres. No hay límite geográfico.`
  },
  {
    match: /contacto|hablar|llamada|reunión|reunion|empezar|empezamos|quiero|interesa|consulta/i,
    reply: `Perfecto, me alegra que te interese 😊\n\nTienes tres formas de contactar:\n\n📅 Llamada gratuita (20 min) → calendly.com/semartestudio\n💬 WhatsApp directo → botón verde en la página\n📧 Email → sergio.m.r.2000@gmail.com\n\nRespondo en menos de 24h, normalmente mucho antes.`
  },
  {
    match: /garantía|garantia|seguro|confianza|fiable|riesgo/i,
    reply: `Trabajamos con total transparencia:\n\n✓ Presupuesto claro antes de empezar\n✓ Sin costes ocultos ni sorpresas\n✓ Comunicación directa conmigo en todo momento\n✓ Apruebas cada fase antes de publicar\n✓ Sin permanencias obligatorias\n✓ Acompañamiento completo hasta el lanzamiento\n\nNada se publica sin tu aprobación.`
  },
  {
    match: /sector|restaurante|peluquer|clinica|clínica|gimnasio|academia|taller|inmobi|comerc/i,
    reply: `Trabajamos con todo tipo de negocios locales:\n\n🍽️ Restaurantes · 💅 Peluquerías · 🏋️ Gimnasios\n🏥 Clínicas · 🏠 Inmobiliarias · 📦 Comercios\n🔧 Reformas y construcción · 📚 Academias · 🚗 Talleres\n\n¿No ves el tuyo? Escríbeme — seguro puedo ayudarte.`
  },
  {
    match: /google|seo|posicion|búsqueda|busqueda|aparecer|redes|instagram|facebook/i,
    reply: `El posicionamiento en Google es clave para cualquier negocio local.\n\nNuestra web incluye SEO local optimizado: apareces cuando alguien busca tu servicio en tu ciudad. También configuramos tu perfil de Google Business, que multiplica tus visitas locales.\n\n¿Quieres saber cómo estás posicionado ahora mismo?`
  },
  {
    match: /gracias|genial|perfecto|buenísimo|interesante|bien|ok|vale/i,
    reply: `¡Me alegra que te haya resultado útil! 😊\n\nSi tienes más preguntas o quieres dar el primer paso, escríbeme cuando quieras. Estoy para ayudarte.`
  },
];

function botFindReply(text) {
  const clean = text.trim();
  for (const entry of botKB) {
    if (entry.match.test(clean)) return entry.reply;
  }
  return `Entendido 👍 Para darte una respuesta más precisa, lo mejor es una llamada rápida de 20 minutos.\n\nPuedes reservarla gratis en: calendly.com/semartestudio\n\nO si prefieres, escríbeme directamente por WhatsApp (botón verde en la página) y respondo enseguida.`;
}

function botAddMsg(container, type, text) {
  const msg = document.createElement('div');
  msg.className = `bot-msg ${type}`;
  const bubble = document.createElement('div');
  bubble.className = 'bot-msg-text';
  bubble.textContent = text;
  msg.appendChild(bubble);
  msg.style.opacity = '0';
  msg.style.transform = 'translateY(6px)';
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    msg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    msg.style.opacity = '1';
    msg.style.transform = 'translateY(0)';
  }));
  return msg;
}

function botShowTyping(container) {
  const typing = document.createElement('div');
  typing.className = 'bot-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing;
}

(function initBotWidget() {
  const trigger  = document.getElementById('botTrigger');
  const window_  = document.getElementById('botWindow');
  const closeBtn = document.getElementById('botClose');
  const body_    = document.getElementById('botWinBody');
  const input    = document.getElementById('botInput');
  const send     = document.getElementById('botSend');
  const badge    = document.getElementById('botBadge');
  if (!trigger || !window_) return;

  let opened = false;

  function openBot() {
    opened = true;
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    window_.classList.add('open');
    window_.setAttribute('aria-hidden', 'false');
    if (badge) badge.style.opacity = '0';
    if (!body_.hasChildNodes()) {
      setTimeout(() => {
        botAddMsg(body_, 'bot', '¡Hola! 👋 Soy el asistente de Semart Studio.\n\n¿Tienes alguna pregunta sobre nuestros servicios o precios? Estoy aquí para ayudarte.');
      }, 300);
    }
    setTimeout(() => { if (input) input.focus(); }, 350);
  }

  function closeBot() {
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    window_.classList.remove('open');
    window_.setAttribute('aria-hidden', 'true');
  }

  trigger.addEventListener('click', () => {
    if (trigger.classList.contains('open')) closeBot();
    else openBot();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeBot);

  function handleSend() {
    const text = input ? input.value.trim() : '';
    if (!text) return;
    input.value = '';
    botAddMsg(body_, 'user', text);
    const typing = botShowTyping(body_);
    body_.scrollTop = body_.scrollHeight;
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      typing.remove();
      const reply = botFindReply(text);
      botAddMsg(body_, 'bot', reply);
    }, delay);
  }

  if (send) send.addEventListener('click', handleSend);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
  }
})();
