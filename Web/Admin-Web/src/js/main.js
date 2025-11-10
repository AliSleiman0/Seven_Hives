// Seven Hives CMS - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize CMS components
    initSidebar();
    initNotifications();
    initQuickActions();
    initSearch();
    initAnimations();
    initSliders();
    initUserMenu();
    initLoadingStates();

    // Sidebar functionality
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
        const navLinks = document.querySelectorAll('.nav-link');

        // Desktop sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-collapsed');
            });
        }

        // Mobile sidebar toggle
        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-open');
                document.body.classList.toggle('sidebar-mobile-open');
            });
        }

        // Navigation link handling
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Update page title
                const pageTitle = this.querySelector('.nav-text').textContent;
                updatePageTitle(pageTitle);
                
                // Close mobile sidebar
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    document.body.classList.remove('sidebar-mobile-open');
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileSidebarToggle.contains(e.target) &&
                sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-mobile-open');
            }
        });
    }

    // Notifications functionality
    function initNotifications() {
        const notificationsBtn = document.getElementById('notifications-btn');
        const notificationPanel = document.getElementById('notification-panel');
        const closeNotifications = document.getElementById('close-notifications');

        if (notificationsBtn && notificationPanel) {
            notificationsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                notificationPanel.classList.toggle('active');
            });

            closeNotifications.addEventListener('click', function() {
                notificationPanel.classList.remove('active');
            });

            // Close panel when clicking outside
            document.addEventListener('click', function(e) {
                if (!notificationPanel.contains(e.target) && 
                    !notificationsBtn.contains(e.target)) {
                    notificationPanel.classList.remove('active');
                }
            });
        }

        // Mark notifications as read
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                this.classList.add('read');
                updateNotificationCount();
            });
        });
    }

    // Quick actions functionality
    function initQuickActions() {
        const quickActionsBtn = document.getElementById('quick-actions-btn');
        const quickActionsMenu = document.getElementById('quick-actions-menu');

        if (quickActionsBtn && quickActionsMenu) {
            quickActionsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                quickActionsMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!quickActionsMenu.contains(e.target) && 
                    !quickActionsBtn.contains(e.target)) {
                    quickActionsMenu.classList.remove('active');
                }
            });

            // Handle quick action clicks
            const quickActionItems = quickActionsMenu.querySelectorAll('.quick-action-item');
            quickActionItems.forEach(item => {
                item.addEventListener('click', function() {
                    quickActionsMenu.classList.remove('active');
                    showNotification('Action initiated', 'info');
                });
            });
        }
    }

    // Search functionality
    function initSearch() {
        const globalSearch = document.getElementById('global-search');
        
        if (globalSearch) {
            let searchTimeout;
            
            globalSearch.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();
                
                if (query.length >= 3) {
                    searchTimeout = setTimeout(() => {
                        performSearch(query);
                    }, 300);
                }
            });

            globalSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = this.value.trim();
                    if (query) {
                        performSearch(query);
                    }
                }
            });
        }
    }

    // Animation functionality
    function initAnimations() {
        // Animate stats on page load
        if (typeof anime !== 'undefined') {
            animateStats();
            setupScrollAnimations();
        }
    }

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            if (numericValue) {
                // Start from 0 and animate to final value
                let currentValue = 0;
                const increment = numericValue / 50;
                
                anime({
                    targets: { value: 0 },
                    value: numericValue,
                    duration: 2000,
                    delay: index * 200,
                    easing: 'easeOutQuart',
                    update: function() {
                        const current = Math.floor(this.animations[0].currentValue);
                        stat.textContent = formatStatValue(current, finalValue);
                    }
                });
            }
        });
    }

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-animate');
                    
                    if (animationType) {
                        animateElement(element, animationType);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    function animateElement(element, animationType) {
        const animations = {
            fadeInUp: {
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuart'
            },
            fadeInLeft: {
                translateX: [-30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutQuart'
            },
            fadeInRight: {
                translateX: [30, 0],
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

    // Sliders functionality
    function initSliders() {
        const hivesSlider = document.getElementById('hives-slider');
        
        if (hivesSlider && typeof Splide !== 'undefined') {
            new Splide('#hives-slider', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '1rem',
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                breakpoints: {
                    1024: {
                        perPage: 2
                    },
                    768: {
                        perPage: 1
                    }
                }
            }).mount();
        }
    }

    // User menu functionality
    function initUserMenu() {
        const userMenuToggle = document.getElementById('user-menu-toggle');
        const userDropdown = document.getElementById('user-dropdown');

        if (userMenuToggle && userDropdown) {
            userMenuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', function(e) {
                if (!userDropdown.contains(e.target) && 
                    !userMenuToggle.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
    }

    // Loading states
    function initLoadingStates() {
        // HTMX event listeners for loading states
        document.body.addEventListener('htmx:beforeRequest', function(event) {
            showLoadingOverlay();
            
            // Add loading state to clicked element
            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
                event.target.classList.add('loading');
                event.target.disabled = true;
            }
        });

        document.body.addEventListener('htmx:afterRequest', function(event) {
            hideLoadingOverlay();
            
            // Remove loading state
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                el.classList.remove('loading');
                el.disabled = false;
            });

            // Show success/error notifications
            if (event.detail.xhr.status >= 200 && event.detail.xhr.status < 300) {
                if (event.detail.xhr.responseText.includes('success')) {
                    showNotification('Action completed successfully', 'success');
                }
            } else {
                showNotification('An error occurred. Please try again.', 'error');
            }
        });

        document.body.addEventListener('htmx:responseError', function(event) {
            hideLoadingOverlay();
            showNotification('Network error. Please check your connection.', 'error');
        });
    }

    // Utility functions
    function updatePageTitle(title) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = title;
        }
        document.title = `${title} - Seven Hives CMS`;
    }

    function updateNotificationCount() {
        const unreadNotifications = document.querySelectorAll('.notification-item:not(.read)').length;
        const notificationBadge = document.getElementById('notification-count');
        
        if (notificationBadge) {
            if (unreadNotifications > 0) {
                notificationBadge.textContent = unreadNotifications;
                notificationBadge.style.display = 'block';
            } else {
                notificationBadge.style.display = 'none';
            }
        }
    }

    function performSearch(query) {
        showNotification(`Searching for: ${query}`, 'info');
        
        // Simulate search API call
        setTimeout(() => {
            // In a real implementation, you would make an HTMX request here
            console.log('Search results for:', query);
        }, 500);
    }

    function formatStatValue(current, original) {
        if (original.includes('k')) {
            return (current / 1000).toFixed(1) + 'k';
        } else if (original.includes('%')) {
            return current + '%';
        }
        return current.toLocaleString();
    }

    function showLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    function hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cms-notification cms-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${getNotificationIcon(type)}</div>
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => removeNotification(notification), 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for global search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const globalSearch = document.getElementById('global-search');
            if (globalSearch) {
                globalSearch.focus();
            }
        }

        // ESC key closes open panels
        if (e.key === 'Escape') {
            document.getElementById('notification-panel')?.classList.remove('active');
            document.getElementById('quick-actions-menu')?.classList.remove('active');
            document.getElementById('user-dropdown')?.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        
        // Close mobile sidebar on desktop
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            document.body.classList.remove('sidebar-mobile-open');
        }
    });

    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            this.setAttribute('title', tooltip);
        });
    });

    console.log('Seven Hives CMS initialized successfully');
});