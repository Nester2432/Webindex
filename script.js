/**
 * InDEX · script.js
 * Interacciones: navbar scroll, reveal animation,
 * formulario de contacto, contador de stats, hamburger menu.
 */

(function () {
  'use strict';

  /* ── 1. Navbar: cambio de estilo al hacer scroll ─────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Ejecutar al cargar por si la página ya está scrolleada


  /* ── 2. Menú hamburguesa (mobile) ───────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar al hacer click en un link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }


  /* ── 3. Scroll reveal con IntersectionObserver ──────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // Solo anima una vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ── 4. Animación de números en stats del hero ──────── */
  const stats = [
    { selector: '.hero__stats .stat:nth-child(1) .stat__num', target: 80, prefix: '+', suffix: '' },
    { selector: '.hero__stats .stat:nth-child(3) .stat__num', target: 40, prefix: '+', suffix: '' },
  ];

  function animateCounter(el, target, prefix, suffix, duration) {
    const start     = performance.now();
    const startVal  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing ease-out cuadrático
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Activar counters cuando el hero sea visible
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          stats.forEach(function (s) {
            const el = document.querySelector(s.selector);
            if (el) animateCounter(el, s.target, s.prefix, s.suffix, 1800);
          });
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStats);
  }


  /* ── 5. Formulario de contacto ──────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica
      const nombre  = form.querySelector('#nombre');
      const email   = form.querySelector('#email');
      const mensaje = form.querySelector('#mensaje');

      let valid = true;

      [nombre, email, mensaje].forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        }
      });

      // Validación de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value && !emailRegex.test(email.value)) {
        email.style.borderColor = '#ef4444';
        valid = false;
      }

      if (!valid) return;

      // Simular envío (reemplazar con fetch() real cuando haya backend)
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';
      submitBtn.disabled  = true;

      setTimeout(function () {
        // Mostrar mensaje de éxito
        if (formSuccess) {
          formSuccess.classList.add('visible');
        }
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;

        // Ocultar el mensaje después de 6 segundos
        setTimeout(function () {
          if (formSuccess) formSuccess.classList.remove('visible');
        }, 6000);
      }, 1200);
    });

    // Limpiar borde rojo al escribir
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }


  /* ── 6. Smooth scroll para links de ancla ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 7. Animación de barras del gráfico del mockup ─── */
  const chartBars = document.querySelectorAll('.mockup__chart-bar');
  if (chartBars.length) {
    // Pequeña animación pulsante en la barra activa
    setInterval(function () {
      const active = document.querySelector('.mockup__chart-bar--active');
      if (!active) return;
      const currentH = parseFloat(active.style.getPropertyValue('--h')) || 85;
      const newH     = 75 + Math.random() * 20; // fluctúa entre 75% y 95%
      active.style.setProperty('--h', newH.toFixed(0) + '%');
    }, 2500);
  }


  /* ── 8. Highlight de link activo en la navbar ───────── */
  const sections      = document.querySelectorAll('section[id]');
  const navbarAnchors = document.querySelectorAll('.navbar__links a[href^="#"]');

  function setActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight + 20 : 100);
      if (window.scrollY >= sectionTop) {
        current = '#' + section.id;
      }
    });

    navbarAnchors.forEach(function (link) {
      link.style.color = '';
      if (link.getAttribute('href') === current) {
        link.style.color = '#fff';
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });


  /* ── 9. Resize: cerrar menú móvil si se amplía ventana ── */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navLinks) {
      navLinks.classList.remove('open');
    }
  });


  /* ── Init ────────────────────────────────────────────── */
  console.log('%c[InDEX] Sitio inicializado correctamente ✔', 'color: #84cc16; font-weight: bold;');

})();
