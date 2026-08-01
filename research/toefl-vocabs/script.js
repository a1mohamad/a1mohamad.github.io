/* ============================================================================
   RESEARCH PAGE — CANONICAL BEHAVIOUR
   Amir Mohamad Askari · research portfolio
   ----------------------------------------------------------------------------
   Copy this file VERBATIM into every research project folder. Every block is
   defensive: if a page does not use a component, that block simply does
   nothing. Never fork this file per project.

   Provides:
     1. Animated metric counters      5. Sub-tabs inside a section
     2. Scroll progress bar           6. Section reveal on scroll
     3. ON/OFF accordion + guide bar  7. Image lightbox
     4. Top-level tab switcher        8. Responsive table labels
                                      9. Code syntax highlighting
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ===== 1. RESPONSIVE TABLE LABELS ==================================== */
    /* Copies each <th> into its column's cells so the phone CSS can render
       rows as labelled cards. Runs first so tables are ready before layout. */
    document.querySelectorAll('table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => {
            Array.from(row.children).forEach((cell, index) => {
                if (headers[index]) cell.setAttribute('data-label', headers[index]);
            });
        });
    });

    /* ===== 2. METRIC COUNTERS ============================================ */
    /* Drive with data-metric-target + data-metric-type on .metric-block.
       Types: integer | percentage | float2 | float3 | float4 (alias: float,
       decimal). A .metric-block with no data-metric-target is left alone —
       that is how non-numeric metrics (tool names, stack labels) work. */
    const formatMetric = (value, type) => {
        switch (type) {
            case 'percentage': return value.toFixed(2) + '%';
            case 'float2': return value.toFixed(2);
            case 'decimal':
            case 'float3': return value.toFixed(3);
            case 'float':
            case 'float4': return value.toFixed(4);
            default: return Math.floor(value).toLocaleString('en-US');
        }
    };

    document.querySelectorAll('.metric-block').forEach(block => {
        const targetEl = block.querySelector('.metric-value');
        if (!targetEl || !block.hasAttribute('data-metric-target')) return;

        const type = block.getAttribute('data-metric-type');
        const targetVal = parseFloat(block.getAttribute('data-metric-target'));
        if (Number.isNaN(targetVal)) return;

        const runtime = 1200;
        const steps = 40;
        const stepValue = targetVal / steps;
        let current = 0;
        let step = 0;

        const increment = () => {
            step++;
            current += stepValue;
            if (step < steps) {
                targetEl.innerText = formatMetric(current, type);
                setTimeout(increment, runtime / steps);
            } else {
                targetEl.innerText = type && type !== 'integer'
                    ? formatMetric(targetVal, type)
                    : targetVal.toLocaleString('en-US');
            }
        };
        increment();
    });

    /* ===== 3. SCROLL PROGRESS BAR ======================================== */
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    });

    /* ===== 4. ON/OFF ACCORDION =========================================== */
    const collapsibleSections = document.querySelectorAll('.section-collapsible');

    /* The guide bar is injected, never hand-written into the HTML. */
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
        section.querySelectorAll('.stagger-child').forEach(child => {
            child.classList.remove('revealed');
            child.style.transitionDelay = '';
        });
    };

    const setBodyHeight = (section) => {
        const body = section.querySelector('.section-body');
        if (!body) return;
        body.style.maxHeight = section.classList.contains('expanded')
            ? body.scrollHeight + 'px'
            : '0px';
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
            if (wasExpanded) hideSectionChildren(section);
            else revealSectionChildren(section);
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

    /* Re-measure open sections whenever their content can change height. */
    const refreshExpandedHeights = () => {
        document.querySelectorAll('.section-collapsible.expanded').forEach(section => {
            const body = section.querySelector('.section-body');
            if (body) body.style.maxHeight = body.scrollHeight + 'px';
        });
    };

    window.addEventListener('resize', () => collapsibleSections.forEach(setBodyHeight));
    if (window.MathJax?.startup?.promise) {
        window.MathJax.startup.promise.then(() => collapsibleSections.forEach(setBodyHeight));
    }
    window.addEventListener('load', refreshExpandedHeights);

    /* ===== 5. TOP-LEVEL TAB SWITCHER ===================================== */
    const notebookTabs = document.querySelectorAll('.notebook-tab');
    const notebookPanels = document.querySelectorAll('.notebook-panel');

    /* On phones the tab bar is a scroll rail — keep the active tab visible. */
    const centerActiveTabOnMobile = (tab) => {
        if (!tab || !window.matchMedia('(max-width: 760px)').matches) return;
        const switcher = tab.closest('.notebook-switcher');
        if (!switcher) return;
        requestAnimationFrame(() => {
            const targetLeft = tab.offsetLeft - (switcher.clientWidth - tab.offsetWidth) / 2;
            switcher.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        });
    };

    notebookTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            notebookTabs.forEach(item => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });
            notebookPanels.forEach(panel => panel.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            centerActiveTabOnMobile(tab);

            const targetPanel = document.getElementById(targetId);
            if (!targetPanel) return;

            targetPanel.classList.add('active');
            targetPanel.querySelectorAll('.section-collapsible.expanded').forEach(revealSectionChildren);

            /* Measure synchronously first: a panel that was display:none had
               scrollHeight 0, so its open sections are still pinned at 0px.
               requestAnimationFrame alone is not enough — it is suspended when
               the page is not compositing, which would leave the panel blank. */
            refreshExpandedHeights();

            requestAnimationFrame(() => {
                refreshExpandedHeights();
                window.dispatchEvent(new Event('resize'));
                if (window.matchMedia('(max-width: 760px)').matches) {
                    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    targetPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                }
            });
        });
    });

    /* ===== 6. SUB-TABS INSIDE A SECTION ================================== */
    /* Markup: .training-model-tabs.training-tabset holding
       .training-model-tab[data-model-target], siblings .training-model-panel. */
    document.querySelectorAll('.training-tabset').forEach(tabset => {
        const shell = tabset.parentElement;
        if (!shell) return;
        const tabs = tabset.querySelectorAll('.training-model-tab');
        const panels = shell.querySelectorAll('.training-model-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.modelTarget;
                tabs.forEach(item => item.classList.remove('active'));
                panels.forEach(panel => panel.classList.remove('active'));
                tab.classList.add('active');

                const targetPanel = shell.querySelector(`#${targetId}`);
                if (targetPanel) targetPanel.classList.add('active');

                /* Same reasoning as the top-level switcher: measure now, then
                   again after layout settles. */
                refreshExpandedHeights();

                requestAnimationFrame(() => {
                    refreshExpandedHeights();
                    window.dispatchEvent(new Event('resize'));
                });
            });
        });
    });

    /* Pills that jump to a sub-tab elsewhere on the page. */
    document.querySelectorAll('.subsection-pill[data-model-target]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.dataset.modelTarget;
            const targetTab = document.querySelector(`.training-model-tab[data-model-target="${targetId}"]`);
            if (targetTab) {
                targetTab.click();
                const host = targetTab.closest('.section-collapsible');
                if (host) {
                    if (!host.classList.contains('expanded')) {
                        host.querySelector('.section-header')?.click();
                    }
                    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* ===== 7. SECTION REVEAL ============================================= */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));

    /* ===== 8. LIGHTBOX =================================================== */
    const overlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');

    if (overlay && lightboxImg && closeBtn) {
        document.querySelectorAll('.viz-wrapper-card img').forEach(image => {
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
            if (event.target === overlay) dismissLightbox();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && overlay.classList.contains('active')) dismissLightbox();
        });
    }

    /* ===== 9. CODE SYNTAX HIGHLIGHTING =================================== */
    /* Reads each <pre> as plain text and re-colours it, so code can be pasted
       into the HTML unstyled. Set data-lang on the <pre> to pick a keyword
       set; default is python. Any hand-written <span class="code-*"> markup is
       replaced, which is what keeps colouring identical across all pages. */
    const KEYWORDS = {
        python: 'import|from|as|def|return|for|in|if|else|elif|with|while|lambda|True|False|None|class|try|except|finally|raise|break|continue|and|or|not|is|global|nonlocal|assert|yield|pass|async|await',
        javascript: 'import|from|as|export|default|function|return|for|in|of|if|else|while|const|let|var|class|new|try|catch|finally|throw|break|continue|typeof|instanceof|await|async|true|false|null|undefined|this',
        typescript: 'import|from|as|export|default|function|return|for|in|of|if|else|while|const|let|var|class|new|try|catch|finally|throw|break|continue|typeof|instanceof|await|async|true|false|null|undefined|this|interface|type|enum|implements|extends|public|private|readonly',
        cpp: 'include|using|namespace|class|struct|public|private|protected|virtual|override|const|static|void|int|float|double|char|bool|auto|return|if|else|for|while|switch|case|break|continue|new|delete|template|typename|true|false|nullptr|try|catch|throw',
        swift: 'import|func|var|let|struct|class|enum|protocol|extension|init|deinit|self|Self|static|mutating|nonisolated|private|fileprivate|internal|public|open|final|override|return|if|else|guard|for|in|while|repeat|switch|case|default|break|continue|defer|do|try|catch|throw|throws|rethrows|as|is|nil|true|false|where|async|await|some|any|weak|unowned|lazy|typealias|associatedtype|inout|subscript|willSet|didSet|get|set',
        sql: 'SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|ALTER|DROP|AS|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|REFERENCES|DISTINCT|LIMIT|OFFSET|WITH|CASE|WHEN|THEN|END',
        bash: 'if|then|else|fi|for|in|do|done|while|case|esac|function|return|export|source|local|echo|cd|set',
        yaml: 'true|false|null|on|off|yes|no'
    };

    const escapeHtml = (value) => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const highlightCode = (code, lang) => {
        const keywords = KEYWORDS[lang] || KEYWORDS.python;
        const protectedParts = [];
        const protect = (fragment) => {
            const token = `@@CODETOKEN${protectedParts.length}@@`;
            protectedParts.push(fragment);
            return token;
        };

        let html = escapeHtml(code);

        /* Comments and strings are protected first so keyword/number passes
           cannot corrupt their contents. */
        html = html.replace(/(#[^\n]*|\/\/[^\n]*|--[^\n]*)/g,
            (match) => protect(`<span class="code-comment">${match}</span>`));
        html = html.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
            (match) => protect(`<span class="code-str">${match}</span>`));
        html = html.replace(/\b(\d+(?:\.\d+)?(?:e[-+]?\d+)?)\b/gi,
            '<span class="code-num">$1</span>');
        html = html.replace(new RegExp(`\\b(${keywords})\\b`, 'g'),
            '<span class="code-keyword">$1</span>');
        html = html.replace(/\b([A-Za-z_]\w*)(?=\s*\()/g,
            '<span class="code-fn">$1</span>');

        protectedParts.forEach((fragment, index) => {
            html = html.replace(`@@CODETOKEN${index}@@`, fragment);
        });
        return html;
    };

    document.querySelectorAll('.terminal-body pre').forEach((pre) => {
        pre.innerHTML = highlightCode(pre.textContent, pre.dataset.lang);
    });

    /* Highlighting can change code block height — re-measure open sections. */
    refreshExpandedHeights();
});
