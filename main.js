/* ============================================================
   PINTÓ EL MUNDIAL — main.js
   ============================================================ */
'use strict';

/* ---------- NAVBAR scroll effect ---------- */
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.querySelector('.navbar-links');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Scroll Reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 60}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ---------- Registration Form ---------- */
const registroForm = document.getElementById('registroForm');

registroForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre   = document.getElementById('nombre').value.trim();
  const sucursal = document.getElementById('sucursal').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const submitBtn = document.getElementById('submitRegistro');

  if (!nombre || !sucursal || !whatsapp) {
    showFormMessage('Por favor completá todos los campos.', 'error');
    return;
  }

  // Simulate submission
  submitBtn.disabled = true;
  submitBtn.textContent = '¡Registrando...';

  setTimeout(() => {
    submitBtn.textContent = '✅ ¡Ya estás anotado!';
    submitBtn.style.background = 'linear-gradient(135deg, #00a651, #007a3d)';
    showFormMessage('¡Gracias! Tu registro fue recibido. Pronto te llegará info por WhatsApp.', 'success');
    registroForm.reset();
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '¡Me apunto al Prode!';
      submitBtn.style.background = '';
    }, 5000);
  }, 1200);
});

function showFormMessage(msg, type) {
  const existing = document.getElementById('formMessage');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.id = 'formMessage';
  el.textContent = msg;
  el.style.cssText = `
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.88rem;
    text-align: center;
    background: ${type === 'success' ? 'rgba(0,166,81,0.15)' : 'rgba(232,0,28,0.15)'};
    border: 1px solid ${type === 'success' ? 'rgba(0,166,81,0.4)' : 'rgba(232,0,28,0.4)'};
    color: ${type === 'success' ? '#5fd9a0' : '#ff7a8a'};
  `;
  registroForm.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

/* ---------- Animated counter for hero stats ---------- */
function animateCounter(el, target, suffix = '') {
  const isFloat = String(target).includes('.');
  let start = 0;
  const duration = 1400;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = eased * target;
    el.textContent = (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const rawText = el.textContent;
        const match = rawText.match(/([\d,.]+)/);
        if (match) {
          const num = parseFloat(match[1].replace(',', '.'));
          const suffix = rawText.replace(match[1], '');
          animateCounter(el, num, suffix);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.navbar-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(sec => sectionObserver.observe(sec));
