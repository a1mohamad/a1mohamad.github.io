document.addEventListener("DOMContentLoaded", () => {
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
});
