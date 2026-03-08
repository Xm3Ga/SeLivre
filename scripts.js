/* ═══════════════════════════════════════════════════════════════
   SeLivre — Interactive Scripts
   Phishing Simulator · Quiz · Scroll Animations · Navigation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navigation ──────────────────────────────────────────
  const nav = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll-aware nav background
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.textContent = isOpen ? '✕' : '☰';
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observerNav.observe(s));

  // ─── Scroll Reveal Animations ────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  const observerReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observerReveal.observe(el));

  // ─── Audio Waveform (decorative) ─────────────────────────
  const waveformContainer = document.getElementById('audioWaveform');
  if (waveformContainer) {
    const barCount = 60;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'waveform-bar';
      const h = Math.random() * 70 + 10;
      bar.style.height = `${h}%`;
      waveformContainer.appendChild(bar);
    }

    // Click to "play" (decorative animation)
    const playBtn = document.getElementById('podcastPlayBtn');
    let isPlaying = false;
    let waveInterval;

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '❚❚' : '▶';

      if (isPlaying) {
        let barIndex = 0;
        const bars = waveformContainer.querySelectorAll('.waveform-bar');
        waveInterval = setInterval(() => {
          if (barIndex < bars.length) {
            bars[barIndex].classList.add('active');
            barIndex++;
          } else {
            clearInterval(waveInterval);
            isPlaying = false;
            playBtn.textContent = '▶';
          }
        }, 80);
      } else {
        clearInterval(waveInterval);
      }
    });
  }

  // ─── Phishing Simulator ──────────────────────────────────
  const emails = [
    {
      sender: 'Banco Santander',
      address: 'alertas@santander-seguridad.xyz',
      subject: '⚠️ Actividad sospechosa detectada — Verifique su cuenta inmediatamente',
      avatar: '🏦',
      isPhishing: true,
      hint: 'El dominio "santander-seguridad.xyz" no es oficial. Los bancos nunca piden datos por email con urgencia.'
    },
    {
      sender: 'Google',
      address: 'no-reply@accounts.google.com',
      subject: 'Revisión de seguridad: nuevo inicio de sesión en tu cuenta',
      avatar: '🔵',
      isPhishing: false,
      hint: 'El dominio accounts.google.com es legítimo. Google notifica inicios de sesión por seguridad.'
    },
    {
      sender: 'Amazon Prime',
      address: 'renovacion@amazon-prime-es.com',
      subject: 'Tu suscripción ha caducado. Renueva ahora para no perder tus beneficios',
      avatar: '📦',
      isPhishing: true,
      hint: 'El dominio "amazon-prime-es.com" no es de Amazon. El dominio oficial es amazon.es. Cuidado con las urgencias.'
    },
    {
      sender: 'Universidad',
      address: 'secretaria@universidad.edu',
      subject: 'Publicación de notas del segundo cuatrimestre — Accede al campus virtual',
      avatar: '🎓',
      isPhishing: false,
      hint: 'El dominio .edu es institucional. El asunto es coherente con comunicaciones académicas normales.'
    },
    {
      sender: 'Correos',
      address: 'envios@correos-entrega.net',
      subject: 'Su paquete está retenido. Pague 1,99€ de tasas para recibirlo',
      avatar: '📮',
      isPhishing: true,
      hint: 'El dominio "correos-entrega.net" es falso. Correos usa correos.es. Pedir pagos por email es un red flag clásico.'
    },
    {
      sender: 'Spotify',
      address: 'noreply@spotify.com',
      subject: 'Tu Wrapped 2025 está listo — Descubre tus estadísticas del año',
      avatar: '🎵',
      isPhishing: false,
      hint: 'El dominio spotify.com es oficial. Spotify envía este tipo de comunicaciones de forma habitual.'
    }
  ];

  const emailList = document.getElementById('emailList');
  const simScore = document.getElementById('simScore');
  const simResults = document.getElementById('simResults');
  const simResetBtn = document.getElementById('simResetBtn');
  let simCorrect = 0;
  let simAnswered = 0;

  function renderEmails() {
    emailList.innerHTML = '';
    simCorrect = 0;
    simAnswered = 0;
    simScore.textContent = `0 / ${emails.length}`;
    simResults.classList.remove('visible');

    emails.forEach((email, idx) => {
      const li = document.createElement('li');
      li.className = 'email-item';
      li.innerHTML = `
        <div class="email-avatar">${email.avatar}</div>
        <div class="email-content">
          <div class="email-sender">
            ${email.sender}
            <span class="email-sender-address">&lt;${email.address}&gt;</span>
          </div>
          <div class="email-subject">${email.subject}</div>
        </div>
        <div class="email-actions">
          <button class="email-btn safe" data-idx="${idx}" data-choice="safe">✓ Seguro</button>
          <button class="email-btn phishing" data-idx="${idx}" data-choice="phishing">⚠ Phishing</button>
        </div>
      `;
      emailList.appendChild(li);
    });

    // Attach event listeners
    emailList.querySelectorAll('.email-btn').forEach(btn => {
      btn.addEventListener('click', handleEmailChoice);
    });
  }

  function handleEmailChoice(e) {
    const idx = parseInt(e.target.dataset.idx);
    const choice = e.target.dataset.choice;
    const email = emails[idx];
    const li = e.target.closest('.email-item');

    if (li.classList.contains('answered')) return;

    const isCorrect = (choice === 'phishing' && email.isPhishing) || 
                      (choice === 'safe' && !email.isPhishing);

    li.classList.add('answered', isCorrect ? 'correct' : 'wrong');

    // Add hint
    const hintEl = document.createElement('div');
    hintEl.style.cssText = `
      grid-column: 1 / -1; 
      font-size: 0.8rem; 
      padding: 0.6rem 1rem; 
      color: var(--text-secondary);
      font-family: var(--font-code);
      border-top: 1px solid var(--border-subtle);
      margin-top: 0.5rem;
    `;
    hintEl.textContent = (isCorrect ? '✓ ' : '✗ ') + email.hint;
    li.appendChild(hintEl);

    if (isCorrect) simCorrect++;
    simAnswered++;
    simScore.textContent = `${simCorrect} / ${emails.length}`;

    if (simAnswered === emails.length) {
      showSimResults();
    }
  }

  function showSimResults() {
    setTimeout(() => {
      simResults.classList.add('visible');
      document.getElementById('resultScore').textContent = `${simCorrect}/${emails.length}`;
      document.getElementById('resultCorrect').textContent = simCorrect;
      document.getElementById('resultWrong').textContent = emails.length - simCorrect;

      const pct = simCorrect / emails.length;
      let msg;
      if (pct === 1) msg = '🏆 ¡Perfecto! Tienes ojo clínico para el phishing. ¡Compártelo!';
      else if (pct >= 0.8) msg = '👏 ¡Muy bien! Casi infalible. Solo un pequeño despiste.';
      else if (pct >= 0.5) msg = '🤔 No está mal, pero hay margen de mejora. ¡Revisa los consejos!';
      else msg = '⚠️ ¡Cuidado! Necesitas reforzar tu detección de phishing. ¡Sigue aprendiendo!';
      
      document.getElementById('resultMessage').textContent = msg;
    }, 600);
  }

  simResetBtn.addEventListener('click', renderEmails);
  renderEmails();

  // ─── Participation Quiz ──────────────────────────────────
  const quizQuestions = [
    {
      question: '¿Cuál es la forma más segura de crear una contraseña?',
      options: [
        'Usar tu fecha de nacimiento',
        'Una combinación larga de palabras aleatorias con números y símbolos',
        'El nombre de tu mascota seguido de "123"',
        'La misma contraseña para todo, así no la olvidas'
      ],
      correct: 1,
      explanation: 'Las contraseñas largas con combinaciones de palabras aleatorias, números y símbolos son mucho más difíciles de crackear. Se recomienda usar un gestor de contraseñas.'
    },
    {
      question: 'Recibes un SMS de "tu banco" pidiendo que hagas clic en un enlace para verificar tu cuenta. ¿Qué haces?',
      options: [
        'Hago clic inmediatamente, podría ser importante',
        'Lo ignoro y contacto directamente al banco por sus canales oficiales',
        'Reenvío el SMS a mis contactos para que estén alerta',
        'Respondo al SMS pidiendo más información'
      ],
      correct: 1,
      explanation: 'Nunca hagas clic en enlaces de SMS sospechosos. Los bancos nunca piden datos por SMS. Siempre contacta directamente a tu banco por los canales oficiales.'
    },
    {
      question: 'Te conectas a la WiFi gratuita de una cafetería. ¿Cuál de estas acciones es la más peligrosa?',
      options: [
        'Leer las noticias',
        'Acceder a tu banca online',
        'Consultar el tiempo',
        'Buscar direcciones en el mapa'
      ],
      correct: 1,
      explanation: 'Las WiFi públicas pueden ser interceptadas. Nunca accedas a datos sensibles (banca online, contraseñas) en redes públicas sin usar una VPN.'
    },
    {
      question: 'Una aplicación de linterna pide acceso a tus contactos, cámara y micrófono. ¿Qué debería preocuparte?',
      options: [
        'Nada, es normal que las apps pidan permisos',
        'Solo me preocupa el acceso a la cámara',
        'Que una app tan simple pida tantos permisos es sospechoso',
        'Es seguro si la descargué de la tienda oficial'
      ],
      correct: 2,
      explanation: 'Una app de linterna no necesita acceder a contactos ni micrófono. Los permisos excesivos son una señal de alerta de que la app podría recopilar datos sin tu consentimiento.'
    },
    {
      question: '¿Qué es la autenticación de dos factores (2FA)?',
      options: [
        'Tener dos contraseñas diferentes',
        'Un sistema que requiere algo que sabes (contraseña) + algo que tienes (teléfono, llave)',
        'Iniciar sesión desde dos dispositivos a la vez',
        'Una contraseña que cambia cada dos días'
      ],
      correct: 1,
      explanation: 'La 2FA añade una capa extra de seguridad: además de tu contraseña, necesitas un segundo factor como un código en tu teléfono. Actívala en todas tus cuentas importantes.'
    }
  ];

  const quizContainer = document.getElementById('quizQuestions');
  const quizProgress = document.getElementById('quizProgress');
  const quizResults = document.getElementById('quizResults');
  const quizResetBtn = document.getElementById('quizResetBtn');
  let quizScore = 0;
  let quizCurrent = 0;

  function renderQuiz() {
    quizScore = 0;
    quizCurrent = 0;
    quizContainer.innerHTML = '';
    quizResults.classList.remove('visible');
    
    // Reset progress dots
    const dots = quizProgress.querySelectorAll('.quiz-progress-dot');
    dots.forEach((dot, i) => {
      dot.className = 'quiz-progress-dot' + (i === 0 ? ' current' : '');
    });

    quizQuestions.forEach((q, idx) => {
      const div = document.createElement('div');
      div.className = 'quiz-question' + (idx === 0 ? ' active' : '');
      div.dataset.idx = idx;
      div.innerHTML = `
        <div class="quiz-question-text">
          <span class="q-number">Pregunta ${idx + 1} de ${quizQuestions.length}</span>
          ${q.question}
        </div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <button class="quiz-option" data-q="${idx}" data-opt="${oi}">${opt}</button>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="quizExpl${idx}">💡 ${q.explanation}</div>
        <button class="quiz-next-btn" id="quizNext${idx}">${idx < quizQuestions.length - 1 ? 'Siguiente →' : 'Ver resultados'}</button>
      `;
      quizContainer.appendChild(div);
    });

    // Attach listeners
    quizContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', handleQuizAnswer);
    });

    quizQuestions.forEach((_, idx) => {
      document.getElementById(`quizNext${idx}`).addEventListener('click', () => nextQuizQuestion(idx));
    });
  }

  function handleQuizAnswer(e) {
    const qIdx = parseInt(e.target.dataset.q);
    const optIdx = parseInt(e.target.dataset.opt);
    const question = quizQuestions[qIdx];
    const questionDiv = e.target.closest('.quiz-question');

    // Disable all options
    questionDiv.querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.classList.add('disabled');
      if (i === question.correct) btn.classList.add('correct');
      if (i === optIdx && i !== question.correct) btn.classList.add('wrong');
    });

    if (optIdx === question.correct) quizScore++;

    // Show explanation and next button
    document.getElementById(`quizExpl${qIdx}`).classList.add('visible');
    document.getElementById(`quizNext${qIdx}`).classList.add('visible');
  }

  function nextQuizQuestion(currentIdx) {
    const dots = quizProgress.querySelectorAll('.quiz-progress-dot');
    dots[currentIdx].classList.remove('current');
    dots[currentIdx].classList.add('completed');

    if (currentIdx < quizQuestions.length - 1) {
      // Show next question
      const questions = quizContainer.querySelectorAll('.quiz-question');
      questions[currentIdx].classList.remove('active');
      questions[currentIdx + 1].classList.add('active');
      dots[currentIdx + 1].classList.add('current');
      quizCurrent = currentIdx + 1;
    } else {
      // Show results
      quizContainer.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
      quizResults.classList.add('visible');
      document.getElementById('quizScore').textContent = `${quizScore}/${quizQuestions.length}`;

      const pct = quizScore / quizQuestions.length;
      let msg;
      if (pct === 1) msg = '🛡️ ¡Imbatible! Eres un experto en ciberseguridad. ¡Desafía a tus amigos!';
      else if (pct >= 0.8) msg = '💪 ¡Gran resultado! Estás muy preparado contra las amenazas digitales.';
      else if (pct >= 0.6) msg = '📚 Vas por buen camino, pero aún hay conceptos por reforzar.';
      else msg = '🚨 ¡Ojo! Tu seguridad digital necesita atención. Revisa nuestro contenido.';
      
      document.getElementById('quizMsg').textContent = msg;
    }
  }

  quizResetBtn.addEventListener('click', renderQuiz);
  renderQuiz();

  // ─── Smooth scroll for anchor links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Parallax effect on hero ─────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  const heroGrid = document.querySelector('.hero-grid');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      const rate = scrolled * 0.3;
      heroContent.style.transform = `translateY(${rate}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      heroGrid.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });

});
