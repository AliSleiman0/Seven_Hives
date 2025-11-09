// Seven Hives - Static Frontend with HTMX JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initNavigation();
    initAnimations();
    initSliders();
    initScrollEffects();
    initHTMXForms();
    initHTMXEvents();

    // Navigation functionality
    function initNavigation() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('data-section');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                }
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', updateActiveNav);
    }

    function updateActiveNav() {
        const sections = ['home', 'about', 'features', 'community', 'contact'];
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // Initialize animations with Anime.js
    function initAnimations() {
        // Hero section animation
        const heroAnimation = document.getElementById('hero-animation');
        if (heroAnimation && typeof anime !== 'undefined') {
            createHeroAnimation();
        }

        // Feature cards animation on scroll
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-animate');
                    
                    if (animationType && typeof anime !== 'undefined') {
                        animateElement(element, animationType);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    function createHeroAnimation() {
        // Create floating elements for hero section
        const heroAnimation = document.getElementById('hero-animation');
        
        for (let i = 0; i < 6; i++) {
            const floatingElement = document.createElement('div');
            floatingElement.className = 'floating-element';
            floatingElement.style.cssText = `
                position: absolute;
                width: ${Math.random() * 60 + 20}px;
                height: ${Math.random() * 60 + 20}px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                opacity: 0.1;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            heroAnimation.appendChild(floatingElement);

            // Animate floating elements
            anime({
                targets: floatingElement,
                translateY: [0, -30, 0],
                translateX: [0, Math.random() * 40 - 20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                duration: 3000 + Math.random() * 2000,
                loop: true,
                easing: 'easeInOutSine',
                delay: Math.random() * 2000
            });
        }
    }

    function animateElement(element, animationType) {
        const animations = {
            fadeInUp: {
                translateY: [50, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuart'
            },
            fadeInLeft: {
                translateX: [-50, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuart'
            },
            fadeInRight: {
                translateX: [50, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuart'
            },
            scaleIn: {
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutBack'
            }
        };

        if (animations[animationType]) {
            anime({
                targets: element,
                ...animations[animationType]
            });
        }
    }

    // Initialize Splide sliders
    function initSliders() {
        const communitySlider = document.getElementById('community-slider');
        
        if (communitySlider && typeof Splide !== 'undefined') {
            new Splide('#community-slider', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                breakpoints: {
                    1024: {
                        perPage: 2,
                        gap: '1.5rem'
                    },
                    768: {
                        perPage: 1,
                        gap: '1rem'
                    }
                }
            }).mount();
        }
    }

    // Scroll effects
    function initScrollEffects() {
        // Header scroll effect
        const header = document.getElementById('header');
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });

        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (heroSection.querySelector('.hero-visual')) {
                    heroSection.querySelector('.hero-visual').style.transform = 
                        `translateY(${rate}px)`;
                }
            });
        }
    }

    // HTMX Form handling for template fragments
    function initHTMXForms() {
        // Enhanced form validation
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearError);
            });
        });
    }

    // HTMX Event handlers for dynamic content loading
    function initHTMXEvents() {
        // Before HTMX request - show loading states
        document.body.addEventListener('htmx:beforeRequest', function(event) {
            const trigger = event.detail.elt;
            const target = event.detail.target;
            
            // Show loading indicator on target
            if (target) {
                target.classList.add('htmx-loading');
                target.innerHTML = '<div class="loading-spinner">Loading...</div>';
            }
            
            // Add loading state to trigger element
            if (trigger.tagName === 'BUTTON' || trigger.classList.contains('btn')) {
                trigger.classList.add('loading');
                trigger.disabled = true;
            }
            
            // Show global loading for navigation
            if (trigger.classList.contains('nav-link') || trigger.hasAttribute('hx-get')) {
                showGlobalLoading();
            }
        });

        // After HTMX request - handle response
        document.body.addEventListener('htmx:afterRequest', function(event) {
            const trigger = event.detail.elt;
            const target = event.detail.target;
            
            // Remove loading states
            if (target) {
                target.classList.remove('htmx-loading');
            }
            
            if (trigger) {
                trigger.classList.remove('loading');
                trigger.disabled = false;
            }
            
            hideGlobalLoading();
            
            // Handle successful responses
            if (event.detail.xhr.status >= 200 && event.detail.xhr.status < 300) {
                // Re-initialize components for newly loaded content
                reinitializeComponents(target);
                
                // Show success notification for forms
                if (event.detail.elt.tagName === 'FORM') {
                    showNotification('Form submitted successfully!', 'success');
                }
                
                // Update page title if specified
                const newTitle = event.detail.xhr.getResponseHeader('X-Page-Title');
                if (newTitle) {
                    document.title = newTitle;
                    updatePageTitle(newTitle);
                }
            }
        });

        // Handle HTMX errors
        document.body.addEventListener('htmx:responseError', function(event) {
            hideGlobalLoading();
            
            const trigger = event.detail.elt;
            if (trigger) {
                trigger.classList.remove('loading');
                trigger.disabled = false;
            }
            
            showNotification('Failed to load content. Please try again.', 'error');
        });

        // Handle network errors
        document.body.addEventListener('htmx:sendError', function(event) {
            hideGlobalLoading();
            showNotification('Network error. Please check your connection.', 'error');
        });

        // Handle content swapped
        document.body.addEventListener('htmx:afterSwap', function(event) {
            const target = event.detail.target;
            
            // Animate new content
            if (typeof anime !== 'undefined') {
                anime({
                    targets: target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 400,
                    easing: 'easeOutQuart'
                });
            }
            
            // Update active navigation
            updateActiveNavFromContent(event.detail.elt);
        });
    }

    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove existing error
        clearError(event);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }

        if (!isValid) {
            showFieldError(field, message);
        }

        return isValid;
    }

    function clearError(event) {
        const field = event.target;
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Utility functions
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => removeNotification(notification), 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // HTMX Helper functions
    function showGlobalLoading() {
        let loadingOverlay = document.getElementById('global-loading');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'global-loading';
            loadingOverlay.className = 'global-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.classList.add('active');
    }

    function hideGlobalLoading() {
        const loadingOverlay = document.getElementById('global-loading');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    function reinitializeComponents(container) {
        if (!container) return;
        
        // Reinitialize sliders in the new content
        const newSliders = container.querySelectorAll('.splide:not(.is-initialized)');
        newSliders.forEach(slider => {
            if (typeof Splide !== 'undefined') {
                new Splide(slider, {
                    type: 'loop',
                    perPage: 1,
                    autoplay: true,
                    interval: 3000
                }).mount();
            }
        });
        
        // Reinitialize animations
        const animatedElements = container.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const animationType = element.getAttribute('data-animate');
            if (animationType && typeof anime !== 'undefined') {
                animateElement(element, animationType);
            }
        });
        
        // Reinitialize form validation
        const forms = container.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearError);
            });
        });
        
        // Reinitialize interactive elements
        const interactiveElements = container.querySelectorAll('[data-interactive]');
        interactiveElements.forEach(element => {
            // Add hover effects or click handlers as needed
            element.addEventListener('click', handleInteractiveClick);
        });
    }

    function updateActiveNavFromContent(trigger) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to the trigger if it's a nav link
        if (trigger && trigger.classList.contains('nav-link')) {
            trigger.classList.add('active');
        }
        
        // Update based on data attributes
        const targetPage = trigger?.getAttribute('data-page') || trigger?.getAttribute('hx-get');
        if (targetPage) {
            navLinks.forEach(link => {
                if (link.getAttribute('hx-get') === targetPage || 
                    link.getAttribute('data-page') === targetPage) {
                    link.classList.add('active');
                }
            });
        }
    }

    function updatePageTitle(title) {
        const pageTitleElement = document.querySelector('.page-title, h1');
        if (pageTitleElement) {
            pageTitleElement.textContent = title;
        }
    }

    function handleInteractiveClick(event) {
        const element = event.currentTarget;
        const action = element.getAttribute('data-action');
        
        // Handle different interactive actions
        switch (action) {
            case 'toggle':
                element.classList.toggle('active');
                break;
            case 'expand':
                element.classList.add('expanded');
                break;
            case 'collapse':
                element.classList.remove('expanded');
                break;
            default:
                // Default interaction feedback
                element.classList.add('clicked');
                setTimeout(() => element.classList.remove('clicked'), 200);
        }
    }

    // Demo button functionality
    const watchDemoBtn = document.getElementById('watch-demo');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // You can implement a modal or redirect to demo video
            showNotification('Demo video coming soon!', 'info');
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const mobileToggle = document.getElementById('mobile-toggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
});

// Service worker registration for PWA (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}