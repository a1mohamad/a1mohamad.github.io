document.addEventListener("DOMContentLoaded", () => {
    // Counter animation for metric blocks
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
                } else if (type === 'decimal') {
                    targetEl.innerText = initial.toFixed(3);
                } else {
                    targetEl.innerText = Math.floor(initial);
                }
                setTimeout(increment, runtime / steps);
            } else {
                if (type === 'percentage') {
                    targetEl.innerText = targetVal.toFixed(2) + '%';
                } else if (type === 'decimal') {
                    targetEl.innerText = targetVal.toFixed(3);
                } else {
                    targetEl.innerText = targetVal;
                }
            }
        };
        increment();
    });

    // Lightbox functionality
    const overlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const portfolioImages = document.querySelectorAll('.viz-wrapper-card img');

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
});
