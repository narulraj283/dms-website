/* âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   DENTAL MARKETING SOCIETY â Main JavaScript
   âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

document.addEventListener('DOMContentLoaded', () => {
  // ââ Mobile Navigation Toggle ââ
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // ââ Smooth Scroll for Anchor Links ââ
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav) nav.classList.remove('open');
      }
    });
  });

  // ââ Header Scroll Effect ââ
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 2px 20px rgba(0,0,0,0.12)'
        : '0 2px 20px rgba(0,0,0,0.08)';
    });
  }

  // ââ Animate Numbers on Scroll ââ
  const animateNumbers = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && !el.classList.contains('counted')) {
        el.classList.add('counted');
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
        }, 30);
      }
    });
  };
  window.addEventListener('scroll', animateNumbers);
  animateNumbers();

  // ââ FAQ Accordion ââ
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ââ Tab Switching ââ
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.tabs');
      if (!group) return;
      group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      const panels = group.parentElement.querySelectorAll('.tab-panel');
      panels.forEach(p => {
        p.style.display = p.id === target ? 'block' : 'none';
      });
    });
  });

  // ââ Newsletter Form ââ
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = form.querySelector('.btn');
        const origText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.style.background = '#2D8A4E';
        input.value = '';
        setTimeout(() => { btn.textContent = origText; btn.style.background = ''; }, 3000);
      }
    });
  });

  // ââ Scroll Reveal Animation ââ
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('revealed');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
});
