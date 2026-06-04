document.addEventListener("DOMContentLoaded", () => {
    // Counter animation (unchanged)
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

    // Reveal sections on scroll
    const revealSections = document.querySelectorAll('.section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });
});
