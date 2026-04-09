/* ============================================================
   TradixIA - script.js
   Interacciones y animaciones del sitio
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — scroll effect + hamburger menu
============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll: agrega clase .scrolled después de 50px
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // ejecuta al cargar por si ya hay scroll

  // Hamburger toggle
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú al hacer click en cualquier link
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   2. SCROLL REVEAL — IntersectionObserver
============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // una sola vez
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   3. COUNTER ANIMATION — números en hero stats
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (!counters.length) return;

  const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Observamos cuando el hero-stats sea visible
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.6 }
  );

  observer.observe(statsSection);
})();

/* ============================================================
   4. BACK TO TOP — botón visible después de 400px
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    },
    { passive: true }
  );

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   5. CONTACT FORM — validación + simulación de envío
============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  // Validación visual en tiempo real
  form.querySelectorAll('input[required], textarea[required]').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(field);
    });
    field.addEventListener('input', function () {
      // Quita el error mientras el usuario escribe
      field.style.borderColor = '';
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;

    if (!value) {
      valid = false;
    } else if (field.type === 'email') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    field.style.borderColor = valid
      ? 'rgba(34, 197, 94, 0.4)'
      : 'rgba(239, 68, 68, 0.5)';

    return valid;
  }

  function validateForm() {
    let allValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    return allValid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      // Shake animation en el botón si hay errores
      submitBtn.style.animation = 'shake 0.4s ease';
      submitBtn.addEventListener('animationend', function () {
        submitBtn.style.animation = '';
      }, { once: true });
      return;
    }

    // Simula envío con loading
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enviando…';

    // Simulación de petición (reemplazar por fetch real)
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar consulta gratuita';

      // Muestra el mensaje de éxito
      successMsg.classList.add('show');
      form.reset();

      // Reinicia colores de campos
      form.querySelectorAll('input, textarea, select').forEach(function (f) {
        f.style.borderColor = '';
      });

      // Oculta el éxito después de 6 segundos
      setTimeout(function () {
        successMsg.classList.remove('show');
      }, 6000);
    }, 1600);
  });
})();

/* ============================================================
   6. SMOOTH ANCHOR SCROLL para links internos
============================================================ */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ============================================================
   7. CSS INJECTION — animaciones que requieren JS
============================================================ */
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    .spin {
      animation: spin-anim 0.9s linear infinite;
    }
    @keyframes spin-anim {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   8. ACTIVE NAV LINK — resalta el link de la sección actual
============================================================ */
(function initActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navAnchors.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            const isActive = a.getAttribute('href') === '#' + id;
            a.style.color = isActive ? 'var(--text-primary)' : '';
            a.style.fontWeight = isActive ? '600' : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ============================================================
   9. MOCKUP BAR ANIMATION — simula actividad en el dashboard
============================================================ */
(function initMockupActivity() {
  const bars = document.querySelectorAll('.mock-bar');
  if (!bars.length) return;

  // Cada 3 segundos, cambia aleatoriamente una barra
  setInterval(function () {
    const randomBar = bars[Math.floor(Math.random() * bars.length)];
    const newHeight = Math.floor(Math.random() * 70 + 20) + '%';
    randomBar.style.transition = 'height 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    randomBar.style.height = newHeight;
  }, 2000);
})();

/* ============================================================
   10. SERVICE CARDS — efecto de cursor/highlight
============================================================ */
(function initCardHighlight() {
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
})();

/* ============================================================
   FIN DEL SCRIPT
   Para producción real, integrar:
   - fetch() al backend / formulario de email (ej. EmailJS, Formspree)
   - Google Analytics / Pixel de Facebook
   - WhatsApp Business API
============================================================ */
