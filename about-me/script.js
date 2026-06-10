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

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.vault;
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    panels.forEach(panel => panel.classList.toggle('active', panel.id === target));
  });
});
