
(() => {
  history.scrollRestoration = 'manual';
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 36));
  document.querySelector('.nav-toggle')?.addEventListener('click', () => header?.classList.toggle('nav-open'));
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  function activateTab(id, push=true){
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === id));
    panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
    if(push) history.replaceState(null, '', '#' + id.replace('-panel',''));
    window.scrollTo({top:0, behavior:'smooth'});
  }
  tabs.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
  const hash = window.location.hash.replace('#','');
  if(hash && document.getElementById(hash + '-panel')) activateTab(hash + '-panel', false);
  document.querySelectorAll('.accordion-trigger').forEach(trigger => trigger.addEventListener('click', () => trigger.closest('.edu-accordion')?.classList.toggle('open')));
  function ensureZoomModal(){
    let modal = document.getElementById('zoomModal');
    if(!modal){
      modal = document.createElement('div');
      modal.id = 'zoomModal';
      modal.className = 'zoom-modal dynamic-zoom';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '<button class="zoom-close" type="button" aria-label="Close preview"><i class="fa-solid fa-xmark"></i></button><div class="zoom-content"><img alt="Preview"/><h3></h3></div>';
      document.body.appendChild(modal);
    }
    return modal;
  }
  const modal = ensureZoomModal();
  const modalImg = modal?.querySelector('img');
  const modalTitle = modal?.querySelector('h3');
  function openZoom(src, title){
    if(!modal || !modalImg || !src) return;
    modalImg.src = src;
    modalImg.alt = title || 'Preview';
    if(modalTitle) modalTitle.textContent = title || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('zoom-open');
  }
  function closeModal(){
    if(!modal || !modalImg) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    modalImg.src='';
    document.body.classList.remove('zoom-open');
  }
  document.querySelectorAll('[data-zoom-src]').forEach(card => card.addEventListener('click', () => {
    openZoom(card.dataset.zoomSrc, card.dataset.zoomTitle || card.getAttribute('aria-label') || 'Preview');
  }));
  document.querySelectorAll('.milestone-page .media-card img, .milestone-page .detail-cover img').forEach(img => {
    if(!img.src) return;
    img.classList.add('zoomable-media');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('title', 'Click to zoom');
    const title = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || img.alt || 'Milestone image';
    img.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openZoom(img.currentSrc || img.src, title);
    });
    img.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        openZoom(img.currentSrc || img.src, title);
      }
    });
  });
  document.querySelector('.zoom-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  window.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

  // milestone-card-clickable: let the full milestone card open its first milestone link.
  document.querySelectorAll('.milestone-card').forEach(card => {
    const link = card.querySelector('a.text-link, a.milestone-thumb');
    if(!link || !link.href) return;
    card.classList.add('is-clickable');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', event => {
      if(event.target.closest('a, button, audio, video')) return;
      window.location.href = link.href;
    });
    card.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        window.location.href = link.href;
      }
    });
  });
  const obs = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); obs.unobserve(entry.target); } }), { threshold:.1, rootMargin:'0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();
