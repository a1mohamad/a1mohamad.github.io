document.addEventListener("DOMContentLoaded", () => {
    // Counter animation for metric blocks
    const blocks = document.querySelectorAll('.metric-block');
    blocks.forEach(block => {
        const targetEl = block.querySelector('.metric-value');
        const targetVal = parseFloat(block.getAttribute('data-metric-target'));
        let initial = 0;
        const runtime = 1200;
        const steps = 40;
        const intervalVal = targetVal / steps;
        let currentStep = 0;
        const increment = () => {
            currentStep++;
            initial += intervalVal;
            if (currentStep < steps) {
                targetEl.innerText = initial.toFixed(4);
                setTimeout(increment, runtime / steps);
            } else {
                targetEl.innerText = targetVal.toFixed(4);
            }
        };
        increment();
    });

    // Scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    });

    // Switch-based accordion disclosure system
    const collapsibleSections = document.querySelectorAll('.section-collapsible');

    const setBodyHeight = (section) => {
        const body = section.querySelector('.section-body');
        if (!body) return;
        if (section.classList.contains('expanded')) {
            body.style.maxHeight = body.scrollHeight + 'px';
        } else {
            body.style.maxHeight = '0px';
        }
    };

    const syncAccordionUI = (section, idx) => {
        const header = section.querySelector('.section-header');
        const isExpanded = section.classList.contains('expanded');
        header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        setBodyHeight(section);
    };

    const revealSectionChildren = (section) => {
        const children = section.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('revealed');
            }, index * 100);
        });
    };

    const hideSectionChildren = (section) => {
        const children = section.querySelectorAll('.stagger-child');
        children.forEach(child => {
            child.classList.remove('revealed');
        });
    };

    collapsibleSections.forEach((section, idx) => {
        const header = section.querySelector('.section-header');
        if (!header) return;
        syncAccordionUI(section, idx);

        const toggleSection = () => {
            const wasExpanded = section.classList.contains('expanded');
            section.classList.toggle('expanded');
            syncAccordionUI(section, idx);
            if (!wasExpanded) {
                revealSectionChildren(section);
            } else {
                hideSectionChildren(section);
            }
        };
        header.addEventListener('click', toggleSection);
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSection();
            }
        });
        if (section.classList.contains('expanded')) {
            revealSectionChildren(section);
        }
    });

    window.addEventListener('resize', () => {
        collapsibleSections.forEach(setBodyHeight);
    });
    if (window.MathJax?.startup?.promise) {
        window.MathJax.startup.promise.then(() => {
            collapsibleSections.forEach(setBodyHeight);
        });
    }

    // Section reveal for divider animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));

    // ========== LIGHTBOX DISPLAY INTEGRATION ==========
    const overlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const portfolioImages = document.querySelectorAll('.viz-wrapper-card img');

    if (overlay && lightboxImg && closeBtn) {
        portfolioImages.forEach(image => {
            image.addEventListener('click', () => {
                lightboxImg.src = image.src;
                lightboxImg.alt = image.alt;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const dismissLightbox = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', dismissLightbox);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                dismissLightbox();
            }
        });
    }
});
