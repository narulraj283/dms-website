/* ──────────────────────────────────────────────────────────────────
   DENTAL MARKETING SOCIETY – Main JavaScript
   ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // ── Mobile Navigation Toggle ──
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ── Mobile Dropdown Touch Support ──
  document.querySelectorAll('.nav-dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Only intercept on mobile (when nav is in column layout)
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = trigger.parentElement;
        const content = dropdown.querySelector('.nav-dropdown-content');
        const isVisible = content.style.display === 'block';
        // Close all other dropdowns
        document.querySelectorAll('.nav-dropdown-content').forEach(d => d.style.display = '');
        document.querySelectorAll('.nav-dropdown > a[aria-expanded]').forEach(a => a.setAttribute('aria-expanded', 'false'));
        if (!isVisible) {
          content.style.display = 'block';
          trigger.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // ── Desktop Dropdown Aria Toggle ──
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
      const trigger = dropdown.querySelector('a[aria-expanded]');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    });
    dropdown.addEventListener('mouseleave', () => {
      const trigger = dropdown.querySelector('a[aria-expanded]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Smooth Scroll for Anchor Links ──
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

  // ── Header Scroll Effect ──
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 2px 20px rgba(0,0,0,0.12)'
        : '0 2px 20px rgba(0,0,0,0.08)';
    });
  }

  // ── Animate Numbers on Scroll ──
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

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Tab Switching ──
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

  // ── Scroll Reveal Animation ──
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

// ── Lead Capture System ──
window.handleLeadCapture = function(event, resourceName) {
  event.preventDefault();
  const form = event.target;
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    phone: form.phone.value || '',
    resource: resourceName,
    date: new Date().toISOString(),
    source: window.location.pathname
  };
  let leads = JSON.parse(localStorage.getItem('dms_leads') || '[]');
  leads.push(data);
  localStorage.setItem('dms_leads', JSON.stringify(leads));
  form.innerHTML = '<div style="padding:2rem;text-align:center;"><h3 style="color:#2D8A4E;margin-bottom:0.5rem;">✓ Download Starting!</h3><p style="color:#666;">Check your email for the resource. Thank you!</p></div>';
  return false;
};

// ── Enhanced Newsletter Form ──
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.removeEventListener('submit', function(){});
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      let subs = JSON.parse(localStorage.getItem('dms_newsletter_subscribers') || '[]');
      subs.push({email: input.value, date: new Date().toISOString(), source: window.location.pathname});
      localStorage.setItem('dms_newsletter_subscribers', JSON.stringify(subs));
      const btn = form.querySelector('.btn');
      const origText = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#2D8A4E';
      input.value = '';
      setTimeout(() => { btn.textContent = origText; btn.style.background = ''; }, 3000);
    }
  });
});

// ── Page View Tracking ──
(function(){
  let views = JSON.parse(localStorage.getItem('dms_pageviews') || '[]');
  views.push({page: window.location.pathname, timestamp: new Date().toISOString(), referrer: document.referrer});
  if(views.length > 10000) views = views.slice(-5000);
  localStorage.setItem('dms_pageviews', JSON.stringify(views));
})();
