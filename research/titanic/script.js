// script.js
document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll('.metric-block');
    blocks.forEach(block => {
        const targetEl = block.querySelector('.metric-value');
        const targetVal = parseFloat(block.getAttribute('data-metric-target'));
        const isInt = block.getAttribute('data-is-int') === '1';
        if (isNaN(targetVal)) return;
        let initial = 0;
        const runtime = 1200;
        const steps = 40;
        const intervalVal = targetVal / steps;
        let currentStep = 0;
        const increment = () => {
            currentStep++;
            initial += intervalVal;
            if (currentStep < steps) {
                targetEl.innerText = isInt ? Math.round(initial) : initial.toFixed(4);
                setTimeout(increment, runtime / steps);
            } else {
                targetEl.innerText = isInt ? targetVal.toString() : targetVal.toFixed(4);
            }
        };
        increment();
    });

    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

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
                children.forEach(child => child.classList.remove('revealed'));
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

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.section').forEach(section => revealObserver.observe(section));
});
