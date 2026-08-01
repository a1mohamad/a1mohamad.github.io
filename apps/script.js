const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + (target === 3 || target === 4 || target === 5 || target === 2 ? '+' : '');
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const signalStrip = document.querySelector('.signal-strip');
if (signalStrip) countObserver.observe(signalStrip);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const focusTabs = document.querySelectorAll('.focus-tab');
const focusPanels = document.querySelectorAll('.focus-panel');

focusTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.focusTarget;

    focusTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    focusPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  });
});

/* --------------------------------------------------------------------------
   Split action buttons
   Only wires groups that actually exist, so cards with a single destination
   stay plain links. Click, click-outside, Escape and arrow keys.
   -------------------------------------------------------------------------- */

document.querySelectorAll('.app-action-group').forEach((group) => {
  const trigger = group.querySelector('.app-action');
  const menu = group.querySelector('.app-action-menu');
  if (!trigger || !menu) return;
  const items = [...menu.querySelectorAll('a')];

  const close = () => {
    group.classList.remove('open');
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    document.querySelectorAll('.app-action-group.open').forEach((other) => {
      if (other === group) return;
      other.classList.remove('open');
      other.querySelector('.app-action-menu').hidden = true;
      other.querySelector('.app-action').setAttribute('aria-expanded', 'false');
    });
    group.classList.add('open');
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  };

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.hidden ? open() : close();
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open();
      items[0].focus();
    }
  });

  menu.addEventListener('keydown', (event) => {
    const index = items.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      trigger.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(index + 1) % items.length].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!group.contains(event.target)) close();
  });
});
