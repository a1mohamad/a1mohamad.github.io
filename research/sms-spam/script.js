document.addEventListener("DOMContentLoaded", () => {

    // ========== LIGHTWEIGHT SYNTAX COLORING FOR DEPLOYMENT CODE LABS ==========
    const codeKeywords = {
        python: [
            'and', 'as', 'async', 'await', 'class', 'def', 'elif', 'else',
            'except', 'False', 'finally', 'for', 'from', 'if', 'import', 'in',
            'is', 'lambda', 'None', 'not', 'or', 'pass', 'raise', 'return',
            'True', 'try', 'with', 'yield',
        ],
        typescript: [
            'as', 'async', 'await', 'catch', 'class', 'const', 'else', 'export',
            'false', 'for', 'from', 'function', 'if', 'import', 'interface',
            'let', 'new', 'null', 'return', 'throw', 'true', 'try', 'type',
            'undefined', 'var', 'while',
        ],
        sql: [
            'AND', 'AS', 'ASC', 'BETWEEN', 'BY', 'CHECK', 'CREATE', 'DEFAULT',
            'DELETE', 'DESC', 'FROM', 'INSERT', 'INTO', 'KEY', 'LIMIT', 'NOT',
            'NULL', 'OR', 'ORDER', 'PRIMARY', 'SELECT', 'SET', 'TABLE', 'UNIQUE',
            'UPDATE', 'VALUES', 'WHERE',
        ],
        yaml: [
            'branches', 'env', 'if', 'jobs', 'name', 'needs', 'on',
            'pull_request', 'push', 'run', 'runs-on', 'services', 'steps',
            'uses', 'with', 'workflow_dispatch',
        ],
        dockerfile: [
            'ADD', 'ARG', 'AS', 'CMD', 'COPY', 'ENTRYPOINT', 'ENV', 'EXPOSE',
            'FROM', 'HEALTHCHECK', 'LABEL', 'RUN', 'USER', 'VOLUME', 'WORKDIR',
        ],
        nginx: [
            'access_log', 'add_header', 'expires', 'index', 'listen', 'location',
            'proxy_connect_timeout', 'proxy_pass', 'proxy_read_timeout',
            'proxy_set_header', 'proxy_ssl_name', 'proxy_ssl_server_name',
            'return', 'root', 'server', 'try_files',
        ],
        shell: [
            'alembic', 'compose', 'curl', 'docker', 'done', 'echo', 'else', 'fi',
            'for', 'if', 'in', 'make', 'npm', 'python', 'then',
        ],
    };

    const escapeCodeHtml = value => value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');

    document.querySelectorAll('pre[data-language]').forEach(pre => {
        const language = pre.dataset.language;
        if (!language || language === 'plaintext') return;

        const keywords = codeKeywords[language] || [];
        const keywordSource = keywords.length
            ? `\\b(?:${keywords.join('|')})\\b`
            : '(?!)';
        const commentSource = language === 'typescript'
            ? '\\/\\/[^\\n]*'
            : language === 'sql'
                ? '--[^\\n]*'
                : '#[^\\n]*';
        const stringSource = '"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`';
        const tokenPattern = new RegExp(
            `(?<comment>${commentSource})|` +
            `(?<string>${stringSource})|` +
            `(?<decorator>@[A-Za-z_][\\w.]*)|` +
            `(?<keyword>${keywordSource})|` +
            `(?<property>\\b[A-Za-z_][\\w-]*(?=\\s*:))|` +
            `(?<fn>\\b[A-Za-z_$][\\w$]*(?=\\s*\\())|` +
            '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
            'gm',
        );

        const source = pre.textContent;
        let output = '';
        let cursor = 0;

        for (const match of source.matchAll(tokenPattern)) {
            output += escapeCodeHtml(source.slice(cursor, match.index));
            const group = Object.entries(match.groups)
                .find(([, value]) => value !== undefined)?.[0];
            const className = {
                comment: 'code-comment',
                string: 'code-str',
                decorator: 'code-fn',
                keyword: 'code-keyword',
                property: 'code-fn',
                fn: 'code-fn',
                number: 'code-num',
            }[group] || '';
            output += `<span class="${className}">${escapeCodeHtml(match[0])}</span>`;
            cursor = match.index + match[0].length;
        }

        output += escapeCodeHtml(source.slice(cursor));
        pre.innerHTML = output;
        pre.classList.add('syntax-colored');
        const terminalPanel = pre.closest('.terminal-panel');
        terminalPanel?.setAttribute('data-language', language);
        terminalPanel?.querySelector('.terminal-title')
            ?.setAttribute('data-language', language);
    });

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


    const centerMobileNotebookTab = (tab) => {
        if (!tab || !window.matchMedia('(max-width: 760px)').matches) return;
        const switcher = tab.closest('.notebook-switcher');
        if (!switcher) return;

        const targetLeft = tab.offsetLeft - ((switcher.clientWidth - tab.offsetWidth) / 2);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        switcher.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: reduceMotion ? 'auto' : 'smooth'
        });
    };

    const activateNotebookTab = (tab, moveFocus = false) => {
        const targetId = tab.dataset.target;
        notebookTabs.forEach(item => {
            const selected = item === tab;
            item.classList.toggle('active', selected);
            item.setAttribute('aria-selected', String(selected));
            item.tabIndex = selected ? 0 : -1;
        });
        notebookPanels.forEach(panel => {
            const selected = panel.id === targetId;
            panel.classList.toggle('active', selected);
            panel.setAttribute('aria-hidden', String(!selected));
        });

        const targetPanel = document.getElementById(targetId);
        if (!targetPanel) return;
        targetPanel.classList.add('active');
        targetPanel.querySelectorAll('.section-collapsible.expanded').forEach(revealSectionChildren);
        if (moveFocus) tab.focus();

        requestAnimationFrame(() => {
            refreshExpandedHeights();
            centerMobileNotebookTab(tab);
            window.dispatchEvent(new Event('resize'));
            if (window.matchMedia('(max-width: 760px)').matches) {
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                targetPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            }
        });
    };

    notebookTabs.forEach((tab, index) => {
        const targetPanel = document.getElementById(tab.dataset.target);
        tab.id = tab.id || `research-tab-${index + 1}`;
        if (targetPanel) {
            targetPanel.setAttribute('role', 'tabpanel');
            targetPanel.setAttribute('aria-labelledby', tab.id);
            targetPanel.setAttribute('aria-hidden', String(!targetPanel.classList.contains('active')));
        }
        tab.setAttribute('aria-selected', String(tab.classList.contains('active')));
        tab.tabIndex = tab.classList.contains('active') ? 0 : -1;

        tab.addEventListener('click', () => activateNotebookTab(tab));
        tab.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % notebookTabs.length;
            if (event.key === 'ArrowLeft') nextIndex = (index - 1 + notebookTabs.length) % notebookTabs.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = notebookTabs.length - 1;
            activateNotebookTab(notebookTabs[nextIndex], true);
        });
    });

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
});
