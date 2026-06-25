document.addEventListener("DOMContentLoaded", () => {
    // ========== RESPONSIVE TABLE LABELS (used by mobile CSS only) ==========
    document.querySelectorAll('table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => {
            Array.from(row.children).forEach((cell, index) => {
                if (headers[index]) cell.setAttribute('data-label', headers[index]);
            });
        });
    });

    const blocks = document.querySelectorAll('.metric-block');
    blocks.forEach(block => {
        const targetEl = block.querySelector('.metric-value');
        if (!targetEl || !block.hasAttribute('data-metric-target')) return;
        const type = block.getAttribute('data-metric-type');
        const targetVal = parseFloat(block.getAttribute('data-metric-target'));
        let initial = 0;
        const runtime = 1200;
        const steps = 40;
        const intervalVal = targetVal / steps;
        let currentStep = 0;

        const render = (value, final = false) => {
            if (type === 'percentage') targetEl.innerText = value.toFixed(2) + '%';
            else if (type === 'float2') targetEl.innerText = value.toFixed(2);
            else if (type === 'float4' || type === 'float') targetEl.innerText = value.toFixed(4);
            else targetEl.innerText = final ? String(targetVal) : String(Math.floor(value));
        };

        const increment = () => {
            currentStep++;
            initial += intervalVal;
            if (currentStep < steps) {
                render(initial);
                setTimeout(increment, runtime / steps);
            } else {
                render(targetVal, true);
            }
        };
        increment();
    });

    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    });

    const collapsibleSections = document.querySelectorAll('.section-collapsible');
    if (collapsibleSections.length) {
        const guide = document.createElement('div');
        guide.className = 'accordion-guide';
        guide.innerHTML = `
            <div class="accordion-guide-main">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Expandable case study</span>
            </div>
            <div class="accordion-guide-hint">Use the switch or tap any title row for more technical info.</div>
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
        body.style.maxHeight = section.classList.contains('expanded') ? body.scrollHeight + 'px' : '0px';
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
            if (!wasExpanded) revealSectionChildren(section);
            else hideSectionChildren(section);
        };

        header.addEventListener('click', toggleSection);
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSection();
            }
        });
        if (section.classList.contains('expanded')) revealSectionChildren(section);
    });

    window.addEventListener('resize', () => {
        collapsibleSections.forEach(setBodyHeight);
    });
    if (window.MathJax?.startup?.promise) {
        window.MathJax.startup.promise.then(() => {
            collapsibleSections.forEach(setBodyHeight);
        });
    }

    const notebookTabs = document.querySelectorAll('.notebook-tab');
    const notebookPanels = document.querySelectorAll('.notebook-panel');

    const refreshExpandedHeights = () => {
        document.querySelectorAll('.section-collapsible.expanded').forEach(section => {
            const body = section.querySelector('.section-body');
            if (body) body.style.maxHeight = body.scrollHeight + 'px';
        });
    };

    notebookTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            notebookTabs.forEach(item => item.classList.remove('active'));
            notebookPanels.forEach(panel => panel.classList.remove('active'));
            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.querySelectorAll('.section-collapsible.expanded').forEach(revealSectionChildren);
                requestAnimationFrame(() => {
                    refreshExpandedHeights();
                    window.dispatchEvent(new Event('resize'));
                });
            }
        });
    });

    document.querySelectorAll('[data-tab-link]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('data-tab-link');
            const tabButton = document.querySelector(`.notebook-tab[data-target="${targetId}"]`);
            if (tabButton) {
                tabButton.click();
                document.querySelector('.notebook-switcher')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));
});
