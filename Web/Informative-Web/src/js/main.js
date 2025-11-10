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