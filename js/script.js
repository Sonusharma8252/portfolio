/* =========================================================
   MODERN DARK DEVELOPER PORTFOLIO — SCRIPT.JS
   All vanilla JS interactions. No inline JS in HTML.
   ========================================================= */

'use strict';

/* =========================================================
   1. NAVBAR — scroll effect + active section highlighting
   ========================================================= */
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = document.querySelectorAll('main section[id], section[id]');

function onNavbarScroll() {
  if (window.scrollY > 50) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  onNavbarScroll();
  updateActiveNav();
}, { passive: true });

onNavbarScroll();
updateActiveNav();

/* =========================================================
   2. MOBILE MENU — close on link click
   ========================================================= */
const navMenu = document.getElementById('navMenu');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* =========================================================
   3. TYPING ANIMATION — hero role rotator
   ========================================================= */
const roles = [
  'Full Stack Developer',
  'Java Developer',
  'UI/UX Enthusiast',
  'Software Developer',
  'JavaScript Engineer',
];

const typedEl = document.getElementById('typedRole');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeRole() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  typingTimeout = setTimeout(typeRole, delay);
}

// Respect reduced-motion preference
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typeRole();
} else {
  if (typedEl) typedEl.textContent = roles[0];
}

/* =========================================================
   4. SCROLL REVEAL — IntersectionObserver
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* =========================================================
   5. ANIMATED COUNTERS — About section stats
   ========================================================= */
const counterEls = document.querySelectorAll('.stat-number[data-count]');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1400;
  const step = Math.ceil(duration / target);
  let current = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}

const aboutSection = document.getElementById('about');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el));
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

if (aboutSection) counterObserver.observe(aboutSection);

/* =========================================================
   6. SKILL PROGRESS BARS — animate on scroll into view
   ========================================================= */
const progressFills = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const percent = fill.getAttribute('data-percent');
      fill.style.width = percent + '%';
      progressObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

progressFills.forEach(fill => progressObserver.observe(fill));

/* =========================================================
   7. SKILLS TABS — show/hide skill categories
   ========================================================= */
const skillsTabs = document.querySelectorAll('.skills-tab');
const skillItems = document.querySelectorAll('.skill-item');

skillsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    skillsTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const category = tab.getAttribute('data-category');

    skillItems.forEach(item => {
      if (item.getAttribute('data-category') === category) {
        item.classList.remove('d-none');
        // Re-trigger reveal for newly shown items
        item.querySelectorAll('.reveal').forEach(r => {
          r.classList.remove('in-view');
          setTimeout(() => r.classList.add('in-view'), 50);
        });
        // Re-trigger progress bars
        item.querySelectorAll('.progress-fill').forEach(fill => {
          fill.style.width = '0%';
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-percent') + '%';
          }, 100);
        });
      } else {
        item.classList.add('d-none');
      }
    });
  });
});

// Init: show frontend on load
skillItems.forEach(item => {
  if (item.getAttribute('data-category') !== 'frontend') {
    item.classList.add('d-none');
  }
});

/* =========================================================
   8. PROJECT FILTERING
   ========================================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');
const noResults = document.getElementById('noResults');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    let visibleCount = 0;

    projectItems.forEach(item => {
      const categories = item.getAttribute('data-category') || '';
      const matches = filter === 'all' || categories.includes(filter);

      if (matches) {
        item.classList.remove('hide');
        visibleCount++;
      } else {
        item.classList.add('hide');
      }
    });

    if (noResults) {
      noResults.classList.toggle('d-none', visibleCount > 0);
    }
  });
});

/* =========================================================
   9. CONTACT FORM VALIDATION
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function validateField(input) {
  const value = input.value.trim();
  let valid = true;
  let message = '';

  if (input.id === 'name') {
    if (!value) { valid = false; message = 'Please enter your name.'; }
    else if (value.length < 2) { valid = false; message = 'Name must be at least 2 characters.'; }
  }

  if (input.id === 'email') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!value) { valid = false; message = 'Please enter your email.'; }
    else if (!emailRe.test(value)) { valid = false; message = 'Please enter a valid email address.'; }
  }

  if (input.id === 'subject') {
    if (!value) { valid = false; message = 'Please enter a subject.'; }
    else if (value.length < 3) { valid = false; message = 'Subject must be at least 3 characters.'; }
  }

  if (input.id === 'message') {
    if (!value) { valid = false; message = 'Please enter a message.'; }
    else if (value.length < 10) { valid = false; message = 'Message must contain at least 10 characters.'; }
  }

  // Update UI
  if (valid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.textContent = message;
  }

  return valid;
}

// Real-time validation feedback (on blur)
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      // Clear invalid state while user is fixing it
      if (el.classList.contains('is-invalid')) {
        validateField(el);
      }
    });
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = ['name', 'email', 'subject', 'message'].map(id => document.getElementById(id));
    const allValid = fields.every(field => validateField(field));

    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = fields.find(f => f.classList.contains('is-invalid'));
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoUrl = `mailto:ksonu843327@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = 'Your email app is opening. Press Send there to deliver the message.';
    formStatus.className = 'form-status success';
    window.location.href = mailtoUrl;
  });
}

/* =========================================================
   10. BACK TO TOP BUTTON
   ========================================================= */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   11. FOOTER YEAR
   ========================================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   12. SMOOTH SCROLL for all anchor links
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
