/**
 * Animations Controller for DIC Humanities Club
 * Handles scroll animations, interactive effects, and page transitions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initTypingAnimation();
    initHoverEffects();
    initPageTransitions();
    initObserverAnimations();
});

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered delay for children
                if (entry.target.classList.contains('stagger-parent')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Initialize counter animations (for statistics)
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Initialize parallax scrolling effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (!parallaxElements.length) return;
    
    const handleParallax = () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    };
    
    // Throttle the scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    handleParallax();
}

/**
 * Initialize typing animation for hero text
 */
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-animation');
    if (!typingElement) return;
    
    const texts = JSON.parse(typingElement.getAttribute('data-texts') || '["Humanities Club", "Student Leadership", "Academic Excellence", "Cultural Activities"]');
    const speed = parseInt(typingElement.getAttribute('data-speed')) || 100;
    const deleteSpeed = parseInt(typingElement.getAttribute('data-delete-speed')) || 50;
    const delay = parseInt(typingElement.getAttribute('data-delay')) || 2000;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, delay);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, isDeleting ? deleteSpeed : speed);
    }
    
    // Start typing animation
    setTimeout(type, 500);
}

/**
 * Initialize hover effects
 */
function initHoverEffects() {
    // Card hover effects
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-ripple');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Initialize page transition animations
 */
function initPageTransitions() {
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Handle link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || link.target === '_blank' || link.href.includes('#')) return;
        
        if (link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('mailto:')) {
            e.preventDefault();
            
            // Add exit animation
            document.body.classList.add('page-exit');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = link.href;
            }, 300);
        }
    });
    
    // Handle back/forward navigation
    window.addEventListener('pageshow', function() {
        document.body.classList.remove('page-exit');
        document.body.classList.add('page-enter');
        
        setTimeout(() => {
            document.body.classList.remove('page-enter');
        }, 300);
    });
}

/**
 * Initialize Intersection Observer for complex animations
 */
function initObserverAnimations() {
    // Observe for complex animation triggers
    const animatedSections = document.querySelectorAll('.animated-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const animation = section.getAttribute('data-animation') || 'fadeInUp';
                const delay = section.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    section.classList.add(`animate-${animation}`);
                    
                    // Animate child elements with staggered delay
                    const children = section.querySelectorAll('[data-child-animation]');
                    children.forEach((child, index) => {
                        const childAnimation = child.getAttribute('data-child-animation');
                        const childDelay = child.getAttribute('data-child-delay') || index * 0.1;
                        
                        setTimeout(() => {
                            child.classList.add(`animate-${childAnimation}`);
                        }, childDelay * 1000);
                    });
                }, delay * 1000);
                
                sectionObserver.unobserve(section);
            }
        });
    }, { threshold: 0.2 });
    
    animatedSections.forEach(section => sectionObserver.observe(section));
}

/**
 * Animate progress bars
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (!progressBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width') || '100%';
                const duration = progressBar.getAttribute('data-duration') || '1s';
                
                progressBar.style.width = '0%';
                progressBar.style.transition = `width ${duration} ease`;
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

/**
 * Initialize timeline animations
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-left');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

/**
 * Toggle mobile menu animation
 */
function initMobileMenuAnimation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Animate menu items
        const menuItems = mobileMenu.querySelectorAll('li');
        if (mobileMenu.classList.contains('active')) {
            menuItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-fade-in-up');
            });
        } else {
            menuItems.forEach(item => {
                item.classList.remove('animate-fade-in-up');
            });
        }
    });
}

/**
 * Initialize floating elements animation
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.float-element');
    
    floatingElements.forEach(element => {
        const amplitude = element.getAttribute('data-float-amplitude') || 20;
        const duration = element.getAttribute('data-float-duration') || 3;
        
        element.style.animation = `float ${duration}s ease-in-out infinite`;
        
        // Create keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-${amplitude}px); }
            }
        `;
        document.head.appendChild(style);
    });
}

/**
 * Initialize text reveal animation
 */
function initTextReveal() {
    const textRevealElements = document.querySelectorAll('.text-reveal');
    
    textRevealElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.animationDelay = `${i * 0.05}s`;
            span.classList.add('text-reveal-char');
            element.appendChild(span);
        }
    });
    
    // Observe for animation trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chars = entry.target.querySelectorAll('.text-reveal-char');
                chars.forEach(char => {
                    char.classList.add('animate-fade-in-up');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textRevealElements.forEach(el => observer.observe(el));
}

/**
 * Initialize loading animation
 */
function initLoadingAnimation() {
    const loadingElement = document.querySelector('.loading-animation');
    if (!loadingElement) return;
    
    // Simulate loading completion
    setTimeout(() => {
        loadingElement.classList.add('loaded');
        
        // Animate content in
        const content = document.querySelector('.page-content');
        if (content) {
            content.classList.add('animate-fade-in');
        }
    }, 1500);
}

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

/**
 * Utility function to debounce scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize additional animations on load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
        // Start progress bars animation
        animateProgressBars();
        
        // Start timeline animations
        initTimelineAnimations();
        
        // Start mobile menu animation
        initMobileMenuAnimation();
        
        // Start floating elements
        initFloatingElements();
        
        // Start text reveal
        initTextReveal();
        
        // Start loading animation if present
        initLoadingAnimation();
    });
});

// Re-initialize animations on window resize
window.addEventListener('resize', debounce(() => {
    initScrollAnimations();
    initParallaxEffects();
}, 250));

// Export animation functions
window.animations = {
    initScrollAnimations,
    initCounterAnimations,
    initParallaxEffects,
    initTypingAnimation,
    animateProgressBars,
    initTimelineAnimations,
    initTextReveal
};