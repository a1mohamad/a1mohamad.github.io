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
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section').forEach(section => {
        revealObserver.observe(section);
    });

    // ========== LIGHTBOX ==========
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
