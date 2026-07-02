const topbar = document.querySelector('.topbar');
const aura = document.getElementById('cursor-aura');

window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 30);
});

window.addEventListener('pointermove', event => {
  if (!aura) return;
  aura.style.left = `${event.clientX}px`;
  aura.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const tabs = document.querySelectorAll('.vault-tab');
const panels = document.querySelectorAll('.vault-panel');

function focusVaultPanelOnMobile(tab, target) {
  if (!window.matchMedia('(max-width: 840px)').matches) return;

  const tabBar = tab.closest('.vault-tabs');
  if (!tabBar) return;

  tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.vault;
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
    focusVaultPanelOnMobile(tab, target);
  });
});

const countValues = document.querySelectorAll('.count-value');
let countsStarted = false;

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }

  requestAnimationFrame(tick);
}

function startCounts() {
  if (countsStarted) return;
  countsStarted = true;
  countValues.forEach(animateCount);
}

if (countValues.length) {
  const metrics = document.querySelector('.hero-metrics');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startCounts();
    });
  }, { threshold: 0.35 });

  if (metrics) countObserver.observe(metrics);
  window.addEventListener('load', () => setTimeout(startCounts, 450), { once: true });
}
