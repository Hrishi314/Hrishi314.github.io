/* ═══════════════════════════════════════════
   NEON//CORP — MAIN JAVASCRIPT
   ═══════════════════════════════════════════ */

// ── GRID CANVAS (Hero Background) ──────────
const canvas = document.getElementById('gridCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const GRID_SIZE = 50;
  let offsetY = 0;
  let mouseX = -9999, mouseY = -9999;

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width / GRID_SIZE) + 1;
    const rows = Math.ceil(canvas.height / GRID_SIZE) + 2;
    const yOff = offsetY % GRID_SIZE;

    for (let row = -1; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * GRID_SIZE;
        const y = row * GRID_SIZE - yOff;

        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = Math.max(0, 1 - dist / 200);

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + GRID_SIZE);
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.04 + glow * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(x - GRID_SIZE, y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.04 + glow * 0.15})`;
        ctx.stroke();

        // Dots at intersections
        if (glow > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, 2 * glow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 255, ${glow})`;
          ctx.fill();
        }
      }
    }

    // Perspective fade at bottom
    const fadeGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fadeGrad.addColorStop(0, 'rgba(5,5,8,0)');
    fadeGrad.addColorStop(1, 'rgba(5,5,8,1)');
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    offsetY += 0.4;
    requestAnimationFrame(drawGrid);
  }
  drawGrid();
}


// ── NAVBAR SCROLL ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});


// ── HAMBURGER MENU ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('active', menuOpen);

  if (menuOpen) {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(5,5,8,0.98)';
    navLinks.style.padding = '1rem 1.5rem';
    navLinks.style.borderBottom = '1px solid rgba(0,245,255,0.2)';
    navLinks.style.gap = '0.5rem';
    navLinks.style.zIndex = '999';
  } else {
    navLinks.style.display = '';
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (menuOpen && !navbar.contains(e.target)) {
    menuOpen = false;
    hamburger.classList.remove('active');
    navLinks.style.display = '';
  }
});


// ── HERO STAT COUNTER ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const heroStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      heroStatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => heroStatObserver.observe(el));


// ── SPECS COUNTER ──────────────────────────
const specObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      specObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.specs-grid').forEach(el => specObserver.observe(el));


// ── FEATURE SCROLL REVEAL ──────────────────
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.feature-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
  featureObserver.observe(el);
});


// ── PRODUCT CARD TILT ─────────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `
      translateY(-8px)
      rotateX(${-y * 8}deg)
      rotateY(${x * 8}deg)
    `;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});


// ── PRODUCT CARD BUTTONS ──────────────────
document.querySelectorAll('.btn-card').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = btn.closest('.product-card');
    const productName = card.querySelector('.card-name').textContent;

    // Ripple effect
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: 10px; height: 10px;
      background: rgba(0,245,255,0.6);
      transform: scale(0);
      left: ${e.clientX - rect.left - 5}px;
      top: ${e.clientY - rect.top - 5}px;
      animation: rippleOut 0.5s ease forwards;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    // Inject animation if not already present
    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id = 'rippleStyle';
      style.textContent = `@keyframes rippleOut {
        to { transform: scale(20); opacity: 0; }
      }`;
      document.head.appendChild(style);
    }

    setTimeout(() => ripple.remove(), 600);

    // Notify user (replace with real cart/routing logic)
    showToast(`${productName} — SYSTEM INITIALIZING...`);
  });
});


// ── TOAST NOTIFICATION ────────────────────
function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById('cyberToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cyberToast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem; right: 2rem;
    background: rgba(5,5,8,0.95);
    border: 1px solid rgba(0,245,255,0.5);
    color: #00f5ff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    padding: 0.85rem 1.5rem;
    z-index: 9999;
    box-shadow: 0 0 20px rgba(0,245,255,0.2), inset 0 0 10px rgba(0,245,255,0.05);
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
    max-width: 320px;
  `;

  // Top accent line
  const accent = document.createElement('div');
  accent.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #00f5ff, transparent);
  `;
  toast.prepend(accent);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}


// ── CTA EMAIL FORM ────────────────────────
const cyberInput = document.querySelector('.cyber-input');
const initBtn = document.querySelector('.cta-form .btn-primary-cyber');

if (initBtn && cyberInput) {
  initBtn.addEventListener('click', () => {
    const email = cyberInput.value.trim();

    if (!email) {
      cyberInput.style.borderColor = 'rgba(255,0,144,0.8)';
      cyberInput.style.boxShadow = '0 0 15px rgba(255,0,144,0.3)';
      cyberInput.placeholder = 'NEURAL ADDRESS REQUIRED';
      setTimeout(() => {
        cyberInput.style.borderColor = '';
        cyberInput.style.boxShadow = '';
        cyberInput.placeholder = 'ENTER YOUR NEURAL ADDRESS';
      }, 2000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      cyberInput.style.borderColor = 'rgba(255,0,144,0.8)';
      cyberInput.style.boxShadow = '0 0 15px rgba(255,0,144,0.3)';
      showToast('INVALID NEURAL ADDRESS — RETRY');
      setTimeout(() => {
        cyberInput.style.borderColor = '';
        cyberInput.style.boxShadow = '';
      }, 2000);
      return;
    }

    // Success state
    cyberInput.value = '';
    cyberInput.style.borderColor = 'rgba(0,245,255,0.8)';
    cyberInput.style.boxShadow = '0 0 20px rgba(0,245,255,0.3)';
    cyberInput.placeholder = 'ACCESS GRANTED — WELCOME, RUNNER';
    initBtn.textContent = 'INITIALIZED ✓';
    initBtn.style.background = 'rgba(0,245,255,0.15)';

    triggerGlitch();
    showToast('NEURAL LINK ESTABLISHED — WELCOME TO THE GRID');

    setTimeout(() => {
      cyberInput.style.borderColor = '';
      cyberInput.style.boxShadow = '';
      cyberInput.placeholder = 'ENTER YOUR NEURAL ADDRESS';
      initBtn.textContent = 'INITIALIZE';
      initBtn.style.background = '';
    }, 4000);
  });

  // Allow Enter key to submit
  cyberInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') initBtn.click();
  });

  // Remove error styling on input
  cyberInput.addEventListener('input', () => {
    cyberInput.style.borderColor = '';
    cyberInput.style.boxShadow = '';
  });
}


// ── GLITCH TRIGGER (NAV BUTTON) ────────────
function triggerGlitch() {
  document.body.classList.add('glitching');
  setTimeout(() => document.body.classList.remove('glitching'), 500);
  createGlitchFlash();
}

function createGlitchFlash() {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; inset: 0; z-index: 9990;
    pointer-events: none;
    background: rgba(0,245,255,0.05);
    animation: flashOut 0.5s ease forwards;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes flashOut { 0% { opacity:1; } 100% { opacity:0; } }`;
  document.head.appendChild(style);
  document.body.appendChild(flash);
  setTimeout(() => { flash.remove(); style.remove(); }, 600);

  // Glitch horizontal slices
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const slice = document.createElement('div');
      const top = Math.random() * 100;
      const height = Math.random() * 8 + 2;
      const offset = (Math.random() - 0.5) * 30;
      slice.style.cssText = `
        position: fixed;
        top: ${top}vh; left: 0; right: 0;
        height: ${height}px; z-index: 9991;
        pointer-events: none;
        transform: translateX(${offset}px);
        background: rgba(255,0,144,0.15);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(slice);
      setTimeout(() => slice.remove(), 100 + Math.random() * 100);
    }, i * 40);
  }
}


// ── SMOOTH SCROLL ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      if (window.innerWidth <= 900 && menuOpen) {
        menuOpen = false;
        hamburger.classList.remove('active');
        navLinks.style.display = '';
      }
    }
  });
});


// ── CURSOR TRAIL ──────────────────────────
const trail = [];
const TRAIL_LENGTH = 12;

// Only enable on non-touch devices
if (window.matchMedia('(pointer: fine)').matches) {
  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9997;
      width: ${4 - i * 0.2}px; height: ${4 - i * 0.2}px;
      border-radius: 50%;
      background: rgba(0,245,255,${0.6 - i * 0.05});
      transform: translate(-50%, -50%);
      transition: left ${i * 20 + 20}ms linear, top ${i * 20 + 20}ms linear;
      box-shadow: 0 0 ${6 - i * 0.4}px rgba(0,245,255,0.8);
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', (e) => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });
}


// ── RANDOM GLITCH (AMBIENT) ────────────────
function ambientGlitch() {
  const texts = document.querySelectorAll('.glitch-text, .logo-glitch');
  const target = texts[Math.floor(Math.random() * texts.length)];
  if (target) {
    target.style.animation = 'none';
    requestAnimationFrame(() => {
      target.style.animation = '';
    });
  }
}
setInterval(ambientGlitch, 5000 + Math.random() * 5000);


// ── HERO BUTTONS ──────────────────────────
const exploreBtn = document.querySelector('.btn-primary-cyber');
const revealBtn  = document.querySelector('.btn-ghost-cyber');

if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    const products = document.getElementById('products');
    if (products) {
      products.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = 'projects.html';
    }
  });
}

if (revealBtn) {
  revealBtn.addEventListener('click', () => {
    triggerGlitch();
    showToast('REVEAL TRANSMISSION LOADING... STAND BY');
  });
}


// ── SECTION REVEAL ON SCROLL ──────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(sec => {
  sectionObserver.observe(sec);
});


// ── ACTIVE NAV LINK ────────────────────────
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


// ── CONSOLE EASTER EGG ─────────────────────
console.log('%c\n██╗  ██╗███████╗ ██████╗ ███╗  ██╗\n████████║██╔════╝██╔═══██╗████╗ ██║\n██╔██╔██║█████╗  ██║   ██║██╔██╗██║\n██║╚═╝██║██╔══╝  ██║   ██║██║╚████║\n██║   ██║███████╗╚██████╔╝██║ ╚███║\n╚═╝   ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚══╝', 'color: #00f5ff; font-family: monospace;');
console.log('%c// NEON//CORP — BUILD 2077.1 — SYSTEM ONLINE', 'color: #ff0090; font-family: monospace;');
console.log('%c// You found the grid. Welcome, runner.', 'color: #f5e642; font-family: monospace;');