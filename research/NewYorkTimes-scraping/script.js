document.addEventListener("DOMContentLoaded", () => {
    // Metric handler (supports string and numeric)
    const blocks = document.querySelectorAll('.metric-block');
    blocks.forEach(block => {
        const targetEl = block.querySelector('.metric-value');
        const type = block.getAttribute('data-metric-type');
        const targetVal = block.getAttribute('data-metric-target');
        if (type === 'string') {
            if (targetEl) targetEl.innerText = targetVal;
            return;
        }
        const targetNum = parseFloat(targetVal);
        if (isNaN(targetNum)) return;
        let initial = 0;
        const runtime = 1200;
        const steps = 40;
        const intervalVal = targetNum / steps;
        let currentStep = 0;
        const increment = () => {
            currentStep++;
            initial += intervalVal;
            if (currentStep < steps) {
                targetEl.innerText = initial.toFixed(4);
                setTimeout(increment, runtime / steps);
            } else {
                targetEl.innerText = targetNum.toFixed(4);
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
    if (collapsibleSections.length) {
        const guide = document.createElement('div');
        guide.className = 'accordion-guide';
        guide.innerHTML = `
            <div class="accordion-guide-main">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Expandable case study</span>
            </div>
            <div class="accordion-guide-hint">Use the switch — or tap any title row — for more technical info.</div>
        `;
        collapsibleSections[0].parentNode.insertBefore(guide, collapsibleSections[0]);
    }

    const revealSectionChildren = (section) => {
        const children = section.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            child.style.transitionDelay = (index * 0.07) + 's';
            child.classList.add('revealed');
        });
        setTimeout(() => {
            children.forEach(child => child.style.transitionDelay = '');
        }, 800);
    };

    const hideSectionChildren = (section) => {
        const children = section.querySelectorAll('.stagger-child');
        children.forEach(child => {
            child.classList.remove('revealed');
            child.style.transitionDelay = '';
        });
    };

    const setBodyHeight = (section) => {
        const body = section.querySelector('.section-body');
        if (!body) return;
        if (section.classList.contains('expanded')) {
            body.style.maxHeight = body.scrollHeight + 'px';
        } else {
            body.style.maxHeight = '0px';
        }
    };

    const syncAccordionUI = (section, index) => {
        const header = section.querySelector('.section-header');
        const body = section.querySelector('.section-body');
        const isExpanded = section.classList.contains('expanded');
        const bodyId = body?.id || `section-panel-${index + 1}`;
        if (body) body.id = bodyId;
        if (header) {
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.setAttribute('aria-expanded', String(isExpanded));
            header.setAttribute('aria-controls', bodyId);
            header.setAttribute('title', isExpanded ? 'Tap to hide details' : 'Tap for more info');
        }
        setBodyHeight(section);
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
});
