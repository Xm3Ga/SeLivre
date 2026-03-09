/* ═══════════════════════════════════════════════════════════════
   SeLivre, scripts.js
   Nav · Cursor · Lenis · GSAP Animations · Audio · Modal · Quiz
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════
   CURSOR PERSONALIZADO
   ═══════════════════════════════════════ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
(function loopRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(loopRing);
})();

/* ═══════════════════════════════════════
   NAV  SCROLL AWARE + MOBILE TOGGLE
   ═══════════════════════════════════════ */
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

const onNavScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  navToggle.textContent = open ? '✕' : '☰';
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// Active section highlight
const navAnchors  = navLinksEl.querySelectorAll('a[href^="#"]');
const allSections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
allSections.forEach(s => navObserver.observe(s));

/* ═══════════════════════════════════════
   LENIS + GSAP
   ═══════════════════════════════════════ */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.5,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
}

/* ═══════════════════════════════════════
   HERO ANIMATIONS
   ═══════════════════════════════════════ */
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  gsap.to('.hero-eyebrow', { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 });
  gsap.to('.hero-title .word', { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power4.out', delay: 0.5 });
  gsap.to('.hero-desc',  { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 1.2 });
  gsap.to('.hero-btns',  { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 1.4 });
});

/* ═══════════════════════════════════════
   SCROLL REVEAL  GSAP BATCH
   ═══════════════════════════════════════ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  function makeReveal(selector, props, start = 'top 88%') {
    ScrollTrigger.batch(selector, {
      onEnter: els => gsap.to(els, { ...props, stagger: 0.1, duration: 0.85, ease: 'power3.out' }),
      start,
    });
  }

  makeReveal('.reveal-up',     { opacity: 1, y: 0 });
  makeReveal('.reveal-down',   { opacity: 1, y: 0 });
  makeReveal('.reveal-left',   { opacity: 1, x: 0 });
  makeReveal('.reveal-right',  { opacity: 1, x: 0 });
  makeReveal('.reveal-scale',  { opacity: 1, scale: 1 });
  makeReveal('.reveal-blur',   { opacity: 1, filter: 'blur(0px)' });
  makeReveal('.reveal-rotate', { opacity: 1, rotate: 0, scale: 1 });
  makeReveal('.reveal-skew',   { opacity: 1, y: 0, skewY: 0 });

  ScrollTrigger.batch('.reveal-clip', {
    onEnter: els => gsap.to(els, { clipPath: 'inset(0 0 0% 0)', stagger: 0.08, duration: 0.9, ease: 'power4.out' }),
    start: 'top 88%',
  });
}

/* ═══════════════════════════════════════
   MODAL VÍDEO
   ═══════════════════════════════════════ */
const modalTitles = {
  v1: 'Cómo funciona un ataque de phishing  paso a paso',
  v2: 'Estafas reales: cómo engañaron a personas como tú',
};
const modalHints = {
  v1: '// Vídeo 1: Fundamentos del phishing (8 min)',
  v2: '// Vídeo 2: Casos reales documentados (12 min)',
};
function openModal(id) {
  document.getElementById('modalTitle').textContent = modalTitles[id] || '';
  document.getElementById('modalHint').textContent  = modalHints[id] || '';
  document.getElementById('videoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('videoModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('videoModal').addEventListener('click', e => {
  if (e.target === document.getElementById('videoModal')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ═══════════════════════════════════════
   REPRODUCTOR DE AUDIO
   ═══════════════════════════════════════ */
let isPlaying = false, curSec = 0, totSec = 323, speedIdx = 0;
const speeds = [1, 1.25, 1.5, 2];
const audio  = document.getElementById('mainAudio');
let audioInt;

function togglePlay() {
  isPlaying = !isPlaying;
  const btn  = document.getElementById('playPauseBtn');
  const eq   = document.getElementById('eqBars');
  btn.textContent = isPlaying ? '⏸' : '▶';
  if (eq) eq.classList.toggle('paused', !isPlaying);
  if (isPlaying) {
    audio.play().catch(() => {});
    audioInt = setInterval(() => {
      curSec = Math.min(curSec + 1, totSec);
      updateProg();
      if (curSec >= totSec) {
        isPlaying = false; btn.textContent = '▶';
        if (eq) eq.classList.add('paused');
        clearInterval(audioInt);
      }
    }, 1000);
  } else {
    audio.pause();
    clearInterval(audioInt);
  }
}
function skipBack()      { curSec = Math.max(0, curSec - 15); audio.currentTime = curSec; updateProg(); }
function skipFwd()       { curSec = Math.min(totSec, curSec + 30); audio.currentTime = curSec; updateProg(); }
function seekAudio(v)    { curSec = (v / 100) * totSec; audio.currentTime = curSec; updateProg(); }
function setVol(v)       { audio.volume = v / 100; }
function cycleSpeed() {
  speedIdx = (speedIdx + 1) % speeds.length;
  const s = speeds[speedIdx];
  audio.playbackRate = s;
  const b = document.getElementById('speedBtn');
  b.textContent = s + '×';
  b.classList.toggle('on', s !== 1);
}
function updateProg() {
  document.getElementById('prog').value = (curSec / totSec) * 100;
  const m = Math.floor(curSec / 60);
  const s = Math.floor(curSec % 60).toString().padStart(2, '0');
  document.getElementById('curTime').textContent = m + ':' + s;
}

/* ═══════════════════════════════════════
   QUIZ  PREGUNTAS + MOCKS DE INTERFAZ
   ═══════════════════════════════════════ */
const questions = [
  {
    type: '📧 Correo Electrónico',
    q: '¿Es este correo legítimo o una estafa?',
    mock: 'email',
    mockData: {
      from_name: 'Netflix Soporte',
      from_addr: 'netflix-billing@nflx-support-update.com',
      subject: '⚠ Tu cuenta Netflix ha sido suspendida',
      body: `<p>Estimado <span class="warn-txt">cliente valioso</span>,</p><br>
<p>Tu cuenta Netflix ha sido <span class="warn-txt">suspendida por un problema de facturación</span>. Tienes <strong>2 horas</strong> para actualizar tus datos de pago o tu cuenta será eliminada permanentemente.</p><br>
<p>Haz clic en el enlace a continuación para restaurar el acceso:</p>`,
      cta: '🔒 Restaurar mi cuenta ahora',
      flags: ['El dominio "nflx-support-update.com" NO es netflix.com', 'Urgencia artificial: "2 horas o eliminaremos tu cuenta"', 'Netflix no pide datos de pago por correo no solicitado'],
    },
    opts: ['Es legítimo, debo hacer clic en el enlace', 'Es phishing, el dominio del remitente no es de Netflix', 'Puede ser real, primero llamaré a Netflix', 'Está bien si el enlace empieza por https://'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> El dominio "nflx-support-update.com" no es el dominio real de Netflix. La amenaza de las "2 horas" es una táctica de urgencia clásica. Accede siempre escribiendo la URL directamente en el navegador.',
      ko: '❌ <strong>Esto es phishing.</strong> El dominio del remitente "nflx-support-update.com" NO es el dominio real de Netflix. La amenaza de las "2 horas" es una táctica de urgencia para desactivar tu juicio crítico.',
    },
  },
  {
    type: '💬 SMS',
    q: '¿Este SMS es de Correos o es un intento de smishing?',
    mock: 'sms',
    mockData: {
      sender: 'Correos',
      msg: 'Su paquete (ES847291) está retenido en la aduana. Pague las tasas de 1,99€ en: correos-entrega-es.net/pago para recibirlo hoy.',
      flags: ['El dominio "correos-entrega-es.net" NO es correos.es', 'Correos nunca pide pagos por SMS con enlaces externos', 'La urgencia ("recibirlo hoy") presiona a actuar sin pensar'],
    },
    opts: ['Es de Correos, pagaré las tasas', 'Es smishing, el dominio es falso', 'Lo ignoraré pero el paquete podría perderse', 'Llamaré al número del SMS para confirmar'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> El dominio "correos-entrega-es.net" no es el oficial correos.es. Los organismos oficiales nunca piden pagos por SMS. Ante la duda, accede directamente a correos.es.',
      ko: '❌ <strong>Es smishing.</strong> Correos usa exclusivamente correos.es. Cualquier SMS con un dominio diferente que pida un pago es un fraude. Nunca hagas clic ni llames a los números del SMS.',
    },
  },
  {
    type: '📞 Llamada',
    q: 'Recibes esta llamada. ¿Qué haces?',
    mock: 'call',
    mockData: {
      caller: 'Microsoft Soporte',
      number: '+34 91 000 4839',
      msg: '"Hemos detectado que su ordenador tiene un virus peligroso y está enviando datos. Necesitamos acceso remoto ahora para solucionarlo o sus datos serán robados."',
      flags: ['Microsoft nunca llama de forma no solicitada', 'Pedir acceso remoto es una señal de alarma crítica', 'El número no corresponde a Microsoft España'],
    },
    opts: ['Doy acceso remoto, podría ser real', 'Cuelgo inmediatamente, es una estafa de soporte técnico', 'Pregunto más detalles antes de decidir', 'Les doy mi nombre pero no el acceso'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> Microsoft, Apple, Google y cualquier empresa tecnológica legítima NUNCA llama de forma no solicitada para decirte que tienes un virus. Si alguien te pide acceso remoto a tu ordenador, siempre es una estafa.',
      ko: '❌ <strong>Es una estafa de soporte técnico.</strong> Ninguna empresa tecnológica llama sin que tú hayas contactado primero. Pedir acceso remoto es siempre un fraude. Cuelga inmediatamente.',
    },
  },
  {
    type: '🌐 URL del Navegador',
    q: 'Vas a hacer una transferencia bancaria. ¿Cuál de estas URLs es segura?',
    mock: 'browser',
    mockData: {
      domain: 'bbva-acceso-seguro.com',
      bankName: 'BBVA',
      bankColor: '#004A96',
      domainSafe: false,
    },
    opts: ['Es segura, tiene el candado verde 🔒', 'Es phishing, el dominio no es bbva.es', 'Depende de si tiene certificado https://', 'Es segura si la encontré buscando en Google'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> El dominio legítimo de BBVA es bbva.es. "bbva-acceso-seguro.com" es un dominio falso diseñado para confundir. El candado HTTPS solo certifica que la conexión está cifrada, no que el sitio sea legítimo.',
      ko: '❌ <strong>Es una web de phishing.</strong> El candado 🔒 no garantiza que el sitio sea legítimo. Solo confirma que la conexión está cifrada. Siempre verifica que el dominio sea el oficial (bbva.es, santander.es, etc.).',
    },
  },
  {
    type: '📱 Red Social',
    q: '¿Este mensaje en Instagram es legítimo?',
    mock: 'twitter',
    mockData: {
      name: 'Elon Musk',
      user: '@ElonMusk_Crypto2024',
      verified: false,
      time: 'hace 2h',
      text: '🚀 ANUNCIO ESPECIAL: Estoy duplicando todas las criptomonedas enviadas a esta cartera durante las próximas 24 horas. ¡Envía 0.1 BTC y recibe 0.2 BTC de vuelta! Sólo hoy.',
      profit: '×2 CRYPTO',
      profitLabel: 'Garantizado en 24h',
      replies: '8.2K', reposts: '22K', likes: '41K',
    },
    opts: ['Es real, Elon Musk hace estos sorteos a veces', 'Es una estafa, nadie duplica criptomonedas', 'Lo haré pero enviaré solo una cantidad pequeña', 'Puede ser verdad si tiene muchos likes'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> Las estafas de "duplicación de criptomonedas" son extremadamente comunes. Nadie, ni Elon Musk ni ninguna otra persona, duplica criptomonedas. Los altos números de interacción son comprados o falsos.',
      ko: '❌ <strong>Es una estafa clásica de criptomonedas.</strong> Nadie duplica criptos. Las cuentas falsas compran likes y seguidores. El handle "@ElonMusk_Crypto2024" no es la cuenta real.',
    },
  },
  {
    type: '🛒 Tienda Online',
    q: '¿Esta tienda online es legítima?',
    mock: 'shop',
    mockData: {
      brand: 'Nike', product: 'Air Max 270',
      emoji: '👟', url: 'nike-outlet-es-2024.shop',
      rating: '⭐⭐⭐⭐⭐ (4.9/5)',
      priceNow: '29,99€', priceWas: '150,00€', discount: '-80%',
      stock: '⚡ ¡Solo quedan 2 unidades!',
    },
    opts: ['Parece legítima, el precio es una oferta especial', 'Es una tienda falsa, el dominio y descuento son sospechosos', 'Compraré con PayPal para estar protegido', 'Buscaré opiniones antes de comprar'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> El dominio "nike-outlet-es-2024.shop" no es nike.com. Un descuento del 80% en productos de marca es una señal de alerta clara. Las tiendas falsas suelen tener URLs con el nombre de la marca más palabras como "outlet", "sale" o "descuento".',
      ko: '❌ <strong>Es una tienda falsa.</strong> Nike vende en nike.com. El 80% de descuento en artículos premium y la urgencia ("solo 2 unidades") son tácticas de fraude. Aunque usaras PayPal, podrías recibir un producto falso o nada.',
    },
  },
  {
    type: '📧 Correo Electrónico',
    q: '¿Es legítimo este correo de tu banco?',
    mock: 'email',
    mockData: {
      from_name: 'Banco Santander',
      from_addr: 'no-reply@santander.es',
      subject: 'Resumen mensual de tu cuenta, Febrero 2026',
      body: `<p>Hola,</p><br><p>Te enviamos el resumen de movimientos de tu cuenta correspondiente al mes de febrero de 2026.</p><br><p>Puedes consultarlo iniciando sesión en tu banca online o en la app Santander.</p>`,
      cta: 'Ver resumen en banca online',
      flags: [],
    },
    opts: ['Es phishing, todos los correos del banco son sospechosos', 'Es legítimo, el dominio es santander.es y no pide datos sensibles', 'Debo ignorarlo por seguridad', 'Llamaré al banco para confirmar'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> El dominio santander.es es el oficial. El correo no crea urgencia, no pide datos sensibles y te redirige a la app oficial, no a un enlace externo. Saber distinguir lo legítimo es tan importante como detectar el fraude.',
      ko: '❌ <strong>Este correo es legítimo.</strong> El dominio santander.es es oficial, el mensaje no crea urgencia y no pide datos sensibles. No todos los correos bancarios son phishing, saber distinguir evita desconfiar de comunicaciones importantes.',
    },
  },
  {
    type: '💬 SMS',
    q: '¿Este SMS de la Agencia Tributaria es real o es phishing?',
    mock: 'sms',
    mockData: {
      sender: 'AEAT',
      msg: '⚠ URGENTE: Tiene una devolución pendiente de 347€. Para recibirla, acceda a: aeat-devolucion2026.com e introduzca sus datos bancarios en las próximas 48h.',
      flags: ['La AEAT nunca pide datos bancarios por SMS', 'El dominio "aeat-devolucion2026.com" no es sede.agenciatributaria.gob.es', 'La urgencia de "48 horas" es una táctica de presión'],
    },
    opts: ['Es real, la AEAT hace devoluciones por SMS', 'Es phishing, la AEAT nunca pide datos por SMS', 'Lo consultaré en el dominio del SMS para confirmar', 'Puede ser real si el importe parece correcto'],
    correct: 1,
    fb: {
      ok: '✅ <strong>¡Correcto!</strong> La Agencia Tributaria (AEAT) NUNCA solicita datos bancarios por SMS, email o teléfono. Las devoluciones se gestionan a través de la sede electrónica oficial: sede.agenciatributaria.gob.es.',
      ko: '❌ <strong>Es phishing.</strong> La AEAT nunca pide datos bancarios por SMS. La URL oficial es sede.agenciatributaria.gob.es. Este tipo de estafa se conoce como "smishing tributario" y es muy común en época de declaración de la renta.',
    },
  },
];

let qIdx = 0, score = 0, answered = false;

/* ── Mock builders (corregido para SMS y llamada) ── */
function buildMock(q) {
  const d = q.mockData;
  if (q.mock === 'email') {
    const hasFl = d.flags && d.flags.length > 0;
    return `<div class="mock-email">
      <div class="me-chrome">
        <div class="me-dot r"></div><div class="me-dot y"></div><div class="me-dot g"></div>
        <div class="me-app">Correo · Vista previa</div>
      </div>
      <div class="me-body">
        <div class="me-field">
          <div class="me-label">De</div>
          <div class="me-value">
            <div class="email-from-name">${d.from_name}</div>
            <div class="email-from-addr">${d.from_addr} ${hasFl ? '⚠' : '✓'}</div>
          </div>
        </div>
        <div class="me-field">
          <div class="me-label">Asunto</div>
          <div class="me-value subject">${d.subject}</div>
        </div>
        <div class="me-body-content">${d.body}<a href="#" class="email-cta" onclick="return false">${d.cta}</a></div>
        ${hasFl ? `<div class="email-flags-panel"><div class="efp-title">⚠ Indicadores a verificar</div>${d.flags.map(f => `<div class="efp-item">${f}</div>`).join('')}</div>` : ''}
      </div>
    </div>`;
  }
  if (q.mock === 'sms') {
    const messageText = d.msg || d.message || '';
    const timeText = d.time || '';
    const messageHtml = messageText.replace(/(https?:\/\/\S+|\S+\.\w{2,}\/[\S]*)/g, '<span class="sb-link">$1</span>');
    return `<div class="mock-sms">
      <div class="sms-notch"><div class="sms-notch-pill"></div></div>
      <div class="sms-topbar">
        <div class="sms-sender-info">
          <div class="sms-avatar">📱</div>
          <div>
            <div class="sms-name">${d.sender}</div>
            <div class="sms-num">${d.number || ''}</div>
          </div>
        </div>
        <div class="sms-time">${timeText}</div>
      </div>
      <div class="sms-bubbles">
        <div class="sms-bubble">${messageHtml}</div>
      </div>
      <div class="sms-bottombar">
        <div class="sms-input-box">Escribe un mensaje...</div>
        <div class="sms-send-btn">➤</div>
      </div>
    </div>`;
  }
  if (q.mock === 'call') {
    const nameText = d.name || d.caller || 'Desconocido';
    const numberText = d.number || '';
    const claimText = d.claim || d.msg || '';
    return `<div class="mock-call">
      <div class="call-label">LLAMADA ENTRANTE</div>
      <div class="call-avatar">📞</div>
      <div class="call-name">${nameText}</div>
      <div class="call-num">${numberText}</div>
      <div class="call-company">${d.company || ''}</div>
      <div class="call-claim">${claimText}</div>
      <div class="call-btns">
        <div class="call-btn-reject">📵</div>
        <div class="call-btn-accept">📞</div>
      </div>
      <div class="call-warning">⚠ Número no verificado en tu agenda</div>
    </div>`;
  }
  if (q.mock === 'twitter') {
    return `<div class="mock-twitter">
      <div class="tw-bar">
        <div class="tw-bar-logo">𝕏</div>
        <div class="tw-bar-label">Red Social · Publicación</div>
      </div>
      <div class="tw-post">
        <div class="tw-post-header">
          <div class="tw-avatar">💸</div>
          <div>
            <div class="tw-name">${d.name} ${d.verified ? '<span class="tw-badge">✓</span>' : ''}</div>
            <div class="tw-handle">${d.user} · <span class="tw-timestamp">${d.time}</span></div>
          </div>
        </div>
        <div class="tw-body">${d.text}</div>
        <div class="tw-img">
          <div class="profit-num">${d.profit}</div>
          <div class="profit-label">${d.profitLabel} 💰 Solo trabajando 2h/día</div>
        </div>
        <div class="tw-actions">
          <div class="tw-action">💬 ${d.replies}</div>
          <div class="tw-action">🔁 ${d.reposts}</div>
          <div class="tw-action">❤️ ${d.likes}</div>
        </div>
      </div>
      <div class="tw-scam-chip">⚠ Esta cuenta tiene 3 días de antigüedad · Sin verificación</div>
    </div>`;
  }
  if (q.mock === 'browser') {
    const isDanger = !d.domainSafe;
    return `<div class="mock-browser">
      <div class="browser-chrome">
        <div class="browser-dots">
          <div class="browser-dot r"></div><div class="browser-dot y"></div><div class="browser-dot g"></div>
        </div>
        <div class="browser-nav">
          <div class="browser-nav-btn">←</div>
          <div class="browser-nav-btn">→</div>
          <div class="browser-nav-btn">↺</div>
        </div>
        <div class="url-bar">
          <span class="url-lock ${isDanger ? 'warn' : 'safe'}">${isDanger ? '🔒' : '✅'}</span>
          <span class="url-text">https://<span class="url-domain ${isDanger ? 'danger' : 'safe'}">${d.domain}</span>/acceso/cuenta</span>
          <span class="url-refresh">⋯</span>
        </div>
      </div>
      <div class="browser-content">
        <div class="bank-page">
          <div class="bank-header" style="background:${d.bankColor}">🏦 ${d.bankName}, Acceso Seguro</div>
          <div class="bank-body">
            <div class="bank-form-field"><label class="bank-form-label">DNI / NIF</label><div class="bank-form-input">Introduce tu DNI...</div></div>
            <div class="bank-form-field"><label class="bank-form-label">Contraseña</label><div class="bank-form-input">••••••••</div></div>
            <div class="bank-submit">Acceder</div>
          </div>
        </div>
      </div>
      ${isDanger ? `<div class="browser-warning-bar">⚠ El dominio "${d.domain}" no coincide con el banco oficial · Posible sitio de phishing</div>` : ''}
    </div>`;
  }
  if (q.mock === 'shop') {
    return `<div class="mock-shop">
      <div class="browser-chrome">
        <div class="browser-dots">
          <div class="browser-dot r"></div><div class="browser-dot y"></div><div class="browser-dot g"></div>
        </div>
        <div class="url-bar" style="flex:1">
          <span class="url-lock warn">🔒</span>
          <span class="url-text">https://<span class="url-domain danger">${d.url}</span></span>
        </div>
      </div>
      <div class="shop-body">
        <div class="shop-img">${d.emoji}</div>
        <div class="shop-info">
          <div class="shop-brand">${d.brand}</div>
          <div class="shop-name">${d.product}</div>
          <div class="shop-rating">${d.rating}</div>
          <div class="shop-prices">
            <span class="shop-price-now">${d.priceNow}</span>
            <span class="shop-price-was">${d.priceWas}</span>
            <span class="shop-discount">${d.discount}</span>
          </div>
          <div class="shop-stock">${d.stock}</div>
          <button class="shop-btn">🛒 Añadir al carrito</button>
        </div>
      </div>
      <div class="shop-flag">⚠ Dominio no oficial · Precio muy por debajo del mercado</div>
    </div>`;
  }
  return '';
}

function loadQ() {
  const q = questions[qIdx];
  document.getElementById('qpFill').style.width = (qIdx / questions.length * 100) + '%';
  document.getElementById('qCounter').textContent = `Pregunta ${qIdx + 1} de ${questions.length}`;
  document.getElementById('qTypeTag').textContent = q.type;
  document.getElementById('qQuestion').textContent = q.q;
  document.getElementById('qMock').innerHTML = buildMock(q);
  document.getElementById('qFeedback').className = 'q-feedback';
  document.getElementById('qFeedback').innerHTML = '';
  document.getElementById('qNext').className = 'q-next';

  const letters = ['A', 'B', 'C', 'D'];
  const optEl = document.getElementById('qOptions');
  optEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.innerHTML = `<span class="opt-let">${letters[i]}</span>${opt}`;
    btn.onclick = () => selectOpt(i);
    optEl.appendChild(btn);
  });
  answered = false;
}

function selectOpt(idx) {
  if (answered) return;
  answered = true;
  const q    = questions[qIdx];
  const opts = document.querySelectorAll('.q-opt');
  opts.forEach(o => o.disabled = true);
  const isOk = idx === q.correct;
  opts[idx].classList.add(isOk ? 'correct' : 'wrong');
  if (!isOk) opts[q.correct].classList.add('correct');
  if (isOk) score++;
  document.getElementById('qScore').textContent = 'Puntuación: ' + score;
  const fb = document.getElementById('qFeedback');
  fb.className = 'q-feedback show ' + (isOk ? 'good' : 'bad');
  fb.innerHTML = isOk ? q.fb.ok : q.fb.ko;
  const nextBtn = document.getElementById('qNext');
  nextBtn.className = 'q-next show';
  nextBtn.textContent = qIdx === questions.length - 1 ? 'Ver resultados →' : 'Siguiente pregunta →';
}

function nextQ() {
  qIdx++;
  if (qIdx >= questions.length) { showResults(); return; }
  loadQ();
}

function showResults() {
  document.getElementById('quizBody').style.display = 'none';
  document.querySelector('.quiz-footer').style.display = 'none';
  document.querySelector('.quiz-top-bar').style.display = 'none';
  const res = document.getElementById('quizResults');
  res.classList.add('show');
  const pct    = score / questions.length;
  const circ   = 364.4;
  const offset = circ - (pct * circ);
  let color, title, msg;
  if (pct >= 0.875) {
    color = 'var(--success)'; title = '🏆 ¡Experto en seguridad!';
    msg = '¡Sobresaliente! Tienes un ojo muy agudo para detectar estafas. Comparte este test con amigos y familiares para ayudarles a protegerse también.';
  } else if (pct >= 0.625) {
    color = 'var(--warn)'; title = '👍 ¡Bastante bien!';
    msg = 'Buen resultado. Detectaste la mayoría de las estafas, pero algunas se te escaparon. Revisa las que fallaste, esas tácticas son las que los atacantes saben que la gente pasa por alto.';
  } else {
    color = 'var(--accent2)'; title = '⚠ Mantente alerta';
    msg = 'Los estafadores son sofisticados y no eres el único al que le resultan difíciles. Repasa las explicaciones de las preguntas que fallaste, ese conocimiento podría ahorrarte mucho dinero real.';
  }
  document.getElementById('resFill').style.stroke = color;
  document.getElementById('resNum').style.color   = color;
  setTimeout(() => { document.getElementById('resFill').style.strokeDashoffset = offset; }, 200);
  document.getElementById('resNum').textContent  = score;
  document.getElementById('resTitle').textContent = title;
  document.getElementById('resMsg').textContent   = msg;
  const badges = document.getElementById('resBadges');
  badges.innerHTML = '';
  if (score >= 1) badges.innerHTML += '<span class="res-badge c">Test completado</span>';
  if (score >= 5) badges.innerHTML += '<span class="res-badge v">Detector de estafas</span>';
  if (score >= 7) badges.innerHTML += '<span class="res-badge g">Experto en seguridad</span>';
  document.getElementById('qpFill').style.width = '100%';
}

function restartQuiz() {
  qIdx = 0; score = 0; answered = false;
  document.getElementById('quizResults').classList.remove('show');
  document.getElementById('quizBody').style.display = 'block';
  document.querySelector('.quiz-footer').style.display = 'flex';
  document.querySelector('.quiz-top-bar').style.display = 'flex';
  document.getElementById('qScore').textContent = 'Puntuación: 0';
  document.getElementById('resFill').style.strokeDashoffset = 364.4;
  loadQ();
}

loadQ();

/* ═══════════════════════════════════════
   HOVER MAGNÉTICO EN BOTONES
   ═══════════════════════════════════════ */
document.querySelectorAll('.btn-main, .btn-outline, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
