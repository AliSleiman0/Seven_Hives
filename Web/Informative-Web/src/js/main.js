// Seven Hives - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded attribute
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle icon
            const svg = mobileToggle.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                // Show hamburger icon
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />';
            } else {
                // Show close icon
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const svg = mobileToggle.querySelector('svg');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />';
            });
        });
    }
});

// Active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    // Store original color for each link
    const navLinks = document.querySelectorAll('nav a[href^="/"]');
    const originalColors = new Map();
    
    navLinks.forEach(link => {
        // Detect the original text color class
        let originalColor = 'text-white'; // default
        
        if (link.classList.contains('text-black')) {
            originalColor = 'text-black';
        } else if (link.classList.contains('text-white')) {
            originalColor = 'text-white';
        } else if (link.classList.contains('text-gray-700')) {
            originalColor = 'text-gray-700';
        } else if (link.classList.contains('text-gray-900')) {
            originalColor = 'text-gray-900';
        }
        
        originalColors.set(link, originalColor);
    });
    
    // Function to set active link
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            // Remove active classes from all links
            link.classList.remove('text-yellow-500', '!text-yellow-500');
            
            // Restore original color
            const originalColor = originalColors.get(link) || 'text-white';
            link.classList.remove('text-white', 'text-black', 'text-gray-700', 'text-gray-900');
            link.classList.add(originalColor);
            
            // Add active class to current link
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
                link.classList.remove(originalColor);
                link.classList.add('text-yellow-500', '!text-yellow-500');
            }
        });
    }
    
    // Set active link on page load
    setActiveLink();
    
    // Update active link when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active state from all links
            navLinks.forEach(l => {
                l.classList.remove('text-yellow-500', '!text-yellow-500');
                const originalColor = originalColors.get(l) || 'text-white';
                l.classList.remove('text-white', 'text-black', 'text-gray-700', 'text-gray-900');
                l.classList.add(originalColor);
            });
            
            // Add active state to clicked link
            const originalColor = originalColors.get(this) || 'text-white';
            this.classList.remove(originalColor);
            this.classList.add('text-yellow-500', '!text-yellow-500');
        });
    });
    
    // Listen for htmx navigation events
    document.body.addEventListener('htmx:afterSwap', function() {
        setActiveLink();
    });
});

// Smooth scroll behavior for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = new Splide('#hexagon-carousel', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                autoplay: true,
                interval: 3000,
                speed: 1200,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                pauseOnHover: false,
                pauseOnFocus: false,
                gap: '2rem',
                pagination: false,
                arrows: false,
                focus: 'center',
                trimSpace: false,
                breakpoints: {
                    1024: {
                        perPage: 2,
                    },
                    640: {
                        perPage: 1,
                    }
                }
            });
            
            carousel.mount();
            
            // Function to animate cards based on position
            function animateCards() {
                const track = document.querySelector('.splide__track');
                const trackRect = track.getBoundingClientRect();
                const centerX = trackRect.left + trackRect.width / 2;
                
                const slides = document.querySelectorAll('.splide__slide');
                
                slides.forEach(slide => {
                    const wrapper = slide.querySelector('.hexagon-border-wrapper');
                    if (!wrapper) return;
                    
                    const slideRect = slide.getBoundingClientRect();
                    const slideCenterX = slideRect.left + slideRect.width / 2;
                    
                    // Calculate distance from center
                    const distance = Math.abs(centerX - slideCenterX);
                    const maxDistance = trackRect.width / 3; // Distance from center to edge of visible area
                    
                    // Normalize distance (0 at center, 1 at edge)
                    const normalizedDistance = Math.min(distance / maxDistance, 1);
                    
                    // Calculate scale: 1.3 at center, gradually down to 1.0
                    const scale = 1.3 - (normalizedDistance * 0.3);
                    
                    // Apply smooth animation
                    anime({
                        targets: wrapper,
                        scale: scale,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                });
            }
            
            // Update continuously during movement
            let animationFrame;
            function updateAnimation() {
                animateCards();
                animationFrame = requestAnimationFrame(updateAnimation);
            }
            
            // Start animation loop when carousel moves
            carousel.on('move', function() {
                if (!animationFrame) {
                    updateAnimation();
                }
            });
            
            // Stop animation loop when movement completes
            carousel.on('moved', function() {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }
                animateCards(); // Final position update
            });
            
            // Initial animation for all cards
            setTimeout(() => {
                const initialSlides = document.querySelectorAll('.splide__slide.is-active .hexagon-border-wrapper');
                anime({
                    targets: initialSlides,
                    scale: [0, 1],
                    opacity: [0, 1],
                    duration: 800,
                    delay: anime.stagger(100),
                    easing: 'easeOutElastic(1, .8)',
                    complete: function() {
                        // After initial animation, apply center card scaling
                        animateCards();
                    }
                });
            }, 100);
        });

// Testimonials Carousel
document.addEventListener('DOMContentLoaded', function() {
    const testimonialsCarousel = document.getElementById('testimonials-carousel');
    if (testimonialsCarousel) {
        new Splide('#testimonials-carousel', {
            type: 'loop',
            perPage: 4.5,
            perMove: 1,
            autoplay: true,
            interval: 3000,
            speed: 800,
            gap: '1rem',
            pagination: false,
            arrows: false,
            breakpoints: {
                1024: {
                    perPage: 2,
                },
                640: {
                    perPage: 1,
                }
            }
        }).mount();
    }
});

// Scroll Animations with Anime.js
document.addEventListener('DOMContentLoaded', function() {
    // Set to keep track of animated elements
    const animatedElements = new Set();
    
    // Hide all animatable elements initially
    const animatableSelectors = [
        'section:not(header):not(footer)',
        'h1:not(header *):not(footer *)',
        'h2:not(header *):not(footer *)',
        'h3:not(header *):not(footer *)',
        'p:not(header *):not(footer *)',
        'button:not(header *):not(footer *)',
        '.grid > div:not(header *):not(footer *)',
        'input:not(header *):not(footer *)',
        'textarea:not(header *):not(footer *)',
        'footer h3',
        'footer ul',
        'footer p',
        'footer form',
        'footer .flex.gap-3',
        'img:not(header *):not(.w-25)',
        '.hexagon-shape'
    ];
    
    animatableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (!el.classList.contains('animated')) {
                el.style.opacity = '0';
            }
        });
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const elementHeight = rect.height;
        
        // Element is considered in viewport when 20% of it is visible
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visiblePercentage = (visibleHeight / elementHeight) * 100;
        
        return visiblePercentage >= 20;
    }
    
    // Function to animate elements from sides
    function animateOnScroll() {
        // Animate sections
        const sections = document.querySelectorAll('section:not(.animated):not(header):not(footer)');
        sections.forEach((section, index) => {
            if (isInViewport(section) && !animatedElements.has(section)) {
                section.classList.add('animated');
                animatedElements.add(section);
                
                anime({
                    targets: section,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    delay: 100,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate headings from left (exclude header and footer)
        const headings = document.querySelectorAll('h1:not(.animated):not(header *):not(footer *), h2:not(.animated):not(header *):not(footer *), h3:not(.animated):not(header *):not(footer *)');
        headings.forEach((heading) => {
            if (isInViewport(heading) && !animatedElements.has(heading)) {
                heading.classList.add('animated');
                animatedElements.add(heading);
                
                anime({
                    targets: heading,
                    opacity: [0, 1],
                    translateX: [-100, 0],
                    duration: 1000,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate paragraphs from right (exclude header and footer)
        const paragraphs = document.querySelectorAll('p:not(.animated):not(header *):not(footer *)');
        paragraphs.forEach((paragraph) => {
            if (isInViewport(paragraph) && !animatedElements.has(paragraph)) {
                paragraph.classList.add('animated');
                animatedElements.add(paragraph);
                
                anime({
                    targets: paragraph,
                    opacity: [0, 1],
                    translateX: [50, 0],
                    duration: 1000,
                    delay: 200,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate buttons from bottom (exclude header and footer)
        const buttons = document.querySelectorAll('button:not(.animated):not(header *):not(footer *), a:not(header *):not(footer *) button:not(.animated)');
        buttons.forEach((button) => {
            if (isInViewport(button) && !animatedElements.has(button)) {
                button.classList.add('animated');
                animatedElements.add(button);
                
                anime({
                    targets: button,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    scale: [0.9, 1],
                    duration: 600,
                    delay: 400,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        });
        
        // Animate cards/team members from bottom with stagger (exclude header and footer)
        const cards = document.querySelectorAll('.grid > div:not(.animated):not(header *):not(footer *)');
        cards.forEach((card, index) => {
            if (isInViewport(card) && !animatedElements.has(card)) {
                card.classList.add('animated');
                animatedElements.add(card);
                
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [60, 0],
                    duration: 800,
                    delay: index * 100,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate form inputs from left (exclude header and footer)
        const inputs = document.querySelectorAll('input:not(.animated):not(header *):not(footer *), textarea:not(.animated):not(header *):not(footer *)');
        inputs.forEach((input, index) => {
            if (isInViewport(input) && !animatedElements.has(input)) {
                input.classList.add('animated');
                animatedElements.add(input);
                
                anime({
                    targets: input,
                    opacity: [0, 1],
                    translateX: [-50, 0],
                    duration: 600,
                    delay: index * 80,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate footer sections from bottom
        const footerHeadings = document.querySelectorAll('footer h3:not(.animated)');
        footerHeadings.forEach((heading, index) => {
            if (isInViewport(heading) && !animatedElements.has(heading)) {
                heading.classList.add('animated');
                animatedElements.add(heading);
                
                anime({
                    targets: heading,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    delay: index * 100,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        const footerLists = document.querySelectorAll('footer ul:not(.animated)');
        footerLists.forEach((list, index) => {
            if (isInViewport(list) && !animatedElements.has(list)) {
                list.classList.add('animated');
                animatedElements.add(list);
                
                anime({
                    targets: list,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    delay: index * 100 + 200,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        const footerParagraphs = document.querySelectorAll('footer p:not(.animated)');
        footerParagraphs.forEach((p, index) => {
            if (isInViewport(p) && !animatedElements.has(p)) {
                p.classList.add('animated');
                animatedElements.add(p);
                
                anime({
                    targets: p,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    delay: index * 100 + 300,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        const footerForms = document.querySelectorAll('footer form:not(.animated)');
        footerForms.forEach((form, index) => {
            if (isInViewport(form) && !animatedElements.has(form)) {
                form.classList.add('animated');
                animatedElements.add(form);
                
                anime({
                    targets: form,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    delay: index * 100 + 200,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        const footerSocial = document.querySelectorAll('footer .flex.gap-3:not(.animated)');
        footerSocial.forEach((social, index) => {
            if (isInViewport(social) && !animatedElements.has(social)) {
                social.classList.add('animated');
                animatedElements.add(social);
                
                anime({
                    targets: social,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    delay: index * 100 + 400,
                    easing: 'easeOutCubic'
                });
            }
        });
        
        // Animate images and hexagons (exclude header logos)
        const images = document.querySelectorAll('img:not(.animated):not(header *):not(.w-25), .hexagon-shape:not(.animated)');
        images.forEach((img) => {
            if (isInViewport(img) && !animatedElements.has(img)) {
                img.classList.add('animated');
                animatedElements.add(img);
                
                anime({
                    targets: img,
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    duration: 1000,
                    easing: 'easeOutElastic(1, .8)'
                });
            }
        });
    }
    
    // Initial check on page load
    setTimeout(animateOnScroll, 100);
    
    // Check on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            animateOnScroll();
        });
    });
    
    // Also check on resize
    window.addEventListener('resize', animateOnScroll);
});