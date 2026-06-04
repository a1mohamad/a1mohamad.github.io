document.addEventListener("DOMContentLoaded", () => {
    // Counter animation for metric blocks (supports float values)
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
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Accordion + stagger reveal
    const collapsibleSections = document.querySelectorAll('.section-collapsible');
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const wasExpanded = section.classList.contains('expanded');
            section.classList.toggle('expanded');
            if (!wasExpanded) {
                const children = section.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = (index * 0.07) + 's';
                    child.classList.add('revealed');
                });
                setTimeout(() => children.forEach(child => child.style.transitionDelay = ''), 800);
            } else {
                const children = section.querySelectorAll('.stagger-child');
                children.forEach(child => {
                    child.classList.remove('revealed');
                    child.style.transitionDelay = '';
                });
            }
        });

        if (section.classList.contains('expanded')) {
            const children = section.querySelectorAll('.stagger-child');
            children.forEach((child, index) => {
                child.style.transitionDelay = (index * 0.07) + 's';
                child.classList.add('revealed');
            });
            setTimeout(() => children.forEach(child => child.style.transitionDelay = ''), 800);
        }
    });

    // Section reveal for divider animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));
});
