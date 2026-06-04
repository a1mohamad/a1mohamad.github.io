document.addEventListener("DOMContentLoaded", () => {

    // ========== COUNTER ANIMATION ==========
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
                targetEl.innerText = type === 'percentage' ? initial.toFixed(2) : Math.floor(initial);
                setTimeout(increment, runtime / steps);
            } else {
                targetEl.innerText = type === 'percentage' ? targetVal.toFixed(2) : targetVal;
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
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ========== SMOOTH ACCORDION TOGGLE ==========
    const collapsibleSections = document.querySelectorAll('.section-collapsible');
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const wasExpanded = section.classList.contains('expanded');
            section.classList.toggle('expanded');

            // stagger animation when expanding
            if (!wasExpanded) {
                const children = section.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = (index * 0.07) + 's';
                    child.classList.add('revealed');
                });
                setTimeout(() => {
                    children.forEach(child => child.style.transitionDelay = '');
                }, 800);
            } else {
                const children = section.querySelectorAll('.stagger-child');
                children.forEach(child => {
                    child.classList.remove('revealed');
                    child.style.transitionDelay = '';
                });
            }
        });

        // if section starts expanded (Overview), reveal its children immediately
        if (section.classList.contains('expanded')) {
            const children = section.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
                child.style.transitionDelay = (index * 0.07) + 's';
                child.classList.add('revealed');
            });
            setTimeout(() => {
                children.forEach(child => child.style.transitionDelay = '');
            }, 800);
        }
    });

    // ========== SECTION REVEAL FOR DIVIDER ANIMATION ==========
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed'); // draws bottom line
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section').forEach(section => {
        revealObserver.observe(section);
    });

});
