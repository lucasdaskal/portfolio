/* ═══════════════════════════════════════════════
   Portfolio — script.js
   - Nav scroll behavior
   - Mobile menu
   - Scroll reveal (IntersectionObserver)
   - Hero stagger animation
   ═══════════════════════════════════════════════ */

'use strict';

// ─── NAV: add .scrolled class on scroll ──────────────────────────────────────
const nav = document.getElementById('nav');

function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load


// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && navLinks.classList.contains('is-open')) {
    navLinks.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});


// ─── SCROLL REVEAL ───────────────────────────────────────────────────────────
// Uses IntersectionObserver so animations only fire when elements enter viewport.

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

// Observe all .reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Stagger: observe groups of .reveal-stagger elements together,
// applying a delay based on their position within their parent.
document.querySelectorAll('.reveal-stagger').forEach((el, i) => {
  // Stagger siblings within the same parent
  const siblings = Array.from(el.parentElement.children).filter(
    c => c.classList.contains('reveal-stagger')
  );
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 80}ms`;
  revealObserver.observe(el);
});


// ─── HERO STAGGER ANIMATION ──────────────────────────────────────────────────
// Fires immediately on page load, staggering each .fade-up child.

const fadeUps = document.querySelectorAll('.fade-up');

// Small initial delay so the browser has painted before animating
setTimeout(() => {
  fadeUps.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120 + 100}ms`;
    el.classList.add('is-visible');
  });
}, 50);


// ─── ACTIVE NAV LINK on scroll ───────────────────────────────────────────────
// Highlights the nav link matching the current visible section.

const sections   = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchorLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  },
  {
    rootMargin: `-${getNavHeight()}px 0px -60% 0px`,
    threshold: 0,
  }
);

sections.forEach(section => activeObserver.observe(section));

function getNavHeight() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
}


// ─── SMOOTH CURSOR GLOW (optional, desktop only) ─────────────────────────────
// Adds a subtle warm glow that follows the cursor on the hero section.

const hero = document.querySelector('.hero');
const glow1 = document.querySelector('.hero__glow--1');

if (hero && glow1 && window.matchMedia('(hover: hover)').matches) {
  let raf;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = e.clientX - rect.left - 300;
    targetY = e.clientY - rect.top  - 300;

    cancelAnimationFrame(raf);
    function lerp() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      glow1.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.3}px)`;
      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        raf = requestAnimationFrame(lerp);
      }
    }
    lerp();
  });
}
