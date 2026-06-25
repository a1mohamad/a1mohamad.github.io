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

    // ========== METRIC COUNTER (percentage, float, integer) ==========
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

        const increment = () => {
            currentStep++;
            initial += intervalVal;
            if (currentStep < steps) {
                if (type === 'percentage') {
                    targetEl.innerText = initial.toFixed(2) + '%';
                } else if (type === 'float2') {
                    targetEl.innerText = initial.toFixed(2);
                } else if (type === 'float4' || type === 'float') {
                    targetEl.innerText = initial.toFixed(4);
                } else {
                    targetEl.innerText = Math.floor(initial);
                }
                setTimeout(increment, runtime / steps);
            } else {
                if (type === 'percentage') {
                    targetEl.innerText = targetVal.toFixed(2) + '%';
                } else if (type === 'float2') {
                    targetEl.innerText = targetVal.toFixed(2);
                } else if (type === 'float4' || type === 'float') {
                    targetEl.innerText = targetVal.toFixed(4);
                } else {
                    targetEl.innerText = targetVal;
                }
            }
        };
        increment();
    });

    // ========== SCROLL PROGRESS BAR ==========
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    });

    // ========== SWITCH-BASED ACCORDION (with guide bar) ==========
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



    // ========== NOTEBOOK TAB SWITCHER ==========
    const notebookTabs = document.querySelectorAll('.notebook-tab');
    const notebookPanels = document.querySelectorAll('.notebook-panel');

    const refreshExpandedHeights = () => {
        document.querySelectorAll('.section-collapsible.expanded').forEach(section => {
            const body = section.querySelector('.section-body');
            if (body) body.style.maxHeight = body.scrollHeight + 'px';
        });
    };

    const centerActiveBoxOfficeTabOnMobile = (tab) => {
        if (!tab || !window.matchMedia('(max-width: 760px)').matches) return;
        const switcher = tab.closest('.notebook-switcher.box-office-switcher');
        if (!switcher) return;
        requestAnimationFrame(() => {
            const targetLeft = tab.offsetLeft - (switcher.clientWidth - tab.offsetWidth) / 2;
            switcher.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        });
    };

    notebookTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            notebookTabs.forEach(item => item.classList.remove('active'));
            notebookPanels.forEach(panel => panel.classList.remove('active'));
            tab.classList.add('active');
            centerActiveBoxOfficeTabOnMobile(tab);
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.querySelectorAll('.section-collapsible.expanded').forEach(revealSectionChildren);
                requestAnimationFrame(() => {
                    refreshExpandedHeights();
                    window.dispatchEvent(new Event('resize'));
                    if (window.matchMedia('(max-width: 760px)').matches) {
                        document.querySelector('.notebook-switcher')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        });
    });

    const initialActiveBoxOfficeTab = document.querySelector('.notebook-switcher.box-office-switcher .notebook-tab.active');
    if (initialActiveBoxOfficeTab) {
        centerActiveBoxOfficeTabOnMobile(initialActiveBoxOfficeTab);
    }

    // ========== SECTION REVEAL FOR DIVIDER ANIMATION ==========
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));

    // ========== LIGHTBOX FUNCTIONALITY ==========
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

    // ========== TEMPLATE-STYLE CODE SYNTAX COLORING ==========
    const escapeHtml = (value) => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const highlightPythonCode = (code) => {
        const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#.*$)|\b(\d+(?:\.\d+)?(?:e[-+]?\d+)?)\b|\b(import|from|as|def|return|for|in|if|else|elif|with|while|lambda|True|False|None|class|try|except|finally|break|continue|and|or|not|is)\b|\b([A-Za-z_]\w*)(?=\s*\()/gmi;
        let html = '';
        let lastIndex = 0;

        code.replace(tokenPattern, (match, stringToken, commentToken, numberToken, keywordToken, functionToken, offset) => {
            html += escapeHtml(code.slice(lastIndex, offset));
            const className = stringToken ? 'code-str'
                : commentToken ? 'code-comment'
                : numberToken ? 'code-num'
                : keywordToken ? 'code-keyword'
                : functionToken ? 'code-fn'
                : '';
            html += className
                ? `<span class="${className}">${escapeHtml(match)}</span>`
                : escapeHtml(match);
            lastIndex = offset + match.length;
            return match;
        });

        html += escapeHtml(code.slice(lastIndex));
        return html;
    };

    document.querySelectorAll('.terminal-body pre').forEach((pre) => {
        const raw = pre.textContent;
        pre.innerHTML = highlightPythonCode(raw);
    });

});
