/**
 * Red Bird Holiday Trail - Mobile-Optimized Interactive JavaScript
 * Vanilla JavaScript with falling snow effect, touch interactions, and PWA features
 */

(function() {
    'use strict';
    
    // ===================================
    // DEVICE & FEATURE DETECTION
    // ===================================
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // ===================================
    // MOBILE VIEWPORT HEIGHT FIX
    // ===================================
    
    function setViewportHeight() {
        // Fix for mobile browsers where 100vh doesn't account for address bar
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight, { passive: true });
    window.addEventListener('orientationchange', setViewportHeight, { passive: true });
    
    // ===================================
    // FALLING SNOW EFFECT (MOBILE OPTIMIZED)
    // ===================================
    
    if (!prefersReducedMotion) {
        const canvas = document.getElementById('snow-canvas');
        
        if (canvas) {
            const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
            let animationId;
            let snowflakes = [];
            
            // Adjust snowflake count based on device
            const getSnowflakeCount = () => {
                const width = window.innerWidth;
                if (isMobile) {
                    return Math.min(Math.floor(width / 20), 50);
                }
                return Math.min(Math.floor(width / 10), 100);
            };
            
            // Set canvas size
            function resizeCanvas() {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                ctx.scale(dpr, dpr);
                
                // Reinitialize snowflakes on resize
                initSnowflakes();
            }
            
            // Snowflake class
            class Snowflake {
                constructor() {
                    this.reset();
                }
                
                reset() {
                    this.x = Math.random() * window.innerWidth;
                    this.y = Math.random() * -window.innerHeight;
                    this.radius = Math.random() * 2.5 + 0.5; // 0.5-3px
                    this.speed = Math.random() * 0.8 + 0.3; // 0.3-1.1 fall speed
                    this.wind = Math.random() * 0.4 - 0.2; // -0.2 to 0.2 horizontal drift
                    this.opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8 opacity
                }
                
                update() {
                    this.y += this.speed;
                    this.x += this.wind;
                    
                    if (this.y > window.innerHeight) {
                        this.reset();
                        this.y = -10;
                    }
                    
                    if (this.x > window.innerWidth + 10) {
                        this.x = -10;
                    } else if (this.x < -10) {
                        this.x = window.innerWidth + 10;
                    }
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                }
            }
            
            function initSnowflakes() {
                const count = getSnowflakeCount();
                snowflakes = [];
                for (let i = 0; i < count; i++) {
                    snowflakes.push(new Snowflake());
                }
            }
            
            // Animation loop with performance optimization
            let lastTime = 0;
            const targetFPS = isMobile ? 30 : 60;
            const frameDelay = 1000 / targetFPS;
            
            function animate(currentTime) {
                animationId = requestAnimationFrame(animate);
                
                const deltaTime = currentTime - lastTime;
                if (deltaTime < frameDelay) return;
                
                lastTime = currentTime - (deltaTime % frameDelay);
                
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                
                snowflakes.forEach(snowflake => {
                    snowflake.update();
                    snowflake.draw();
                });
            }
            
            // Initialize and start
            resizeCanvas();
            initSnowflakes();
            animate(0);
            
            // Throttled resize handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(resizeCanvas, 250);
            }, { passive: true });
            
            // Pause animation when page is hidden (performance optimization)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                } else {
                    if (!animationId) {
                        animate(0);
                    }
                }
            }, { passive: true });
        }
    }
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 20; // Offset for better positioning
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }, { passive: false });
    });
    
    // ===================================
    // TOUCH-OPTIMIZED SCROLL REVEAL
    // ===================================
    
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: isMobile ? 0.05 : 0.1,
            rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Unobserve after animation for performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with stagger effect
        const elementsToObserve = document.querySelectorAll('.info-card, .step-card, .stop-card, .faq-item');
        
        elementsToObserve.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        });
    }
    
    // ===================================
    // ENHANCED TOUCH FEEDBACK
    // ===================================
    
    if (supportsTouch) {
        // Add active state for touch interactions
        document.querySelectorAll('.btn, .info-card, .step-card, .stop-card').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }, { passive: true });
            
            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }
    
    // ===================================
    // BUTTON RIPPLE EFFECT
    // ===================================
    
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles dynamically
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===================================
    // IMAGE LAZY LOADING
    // ===================================
    
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // PWA INSTALL PROMPT (iOS/Android)
    // ===================================
    
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // You can show a custom install button here if desired
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        deferredPrompt = null;
    });
    
    // ===================================
    // ORIENTATION CHANGE HANDLER
    // ===================================
    
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            // Small delay to ensure layout is updated
            setTimeout(() => {
                setViewportHeight();
                window.scrollTo(0, window.pageYOffset + 1);
                window.scrollTo(0, window.pageYOffset - 1);
            }, 100);
        });
    }
    
    // ===================================
    // PERFORMANCE MONITORING
    // ===================================
    
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, { passive: true });
    }
    
    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    
    console.log('%c🎄 Red Bird Holiday Trail 🎄', 'color: #d62828; font-size: 24px; font-weight: bold;');
    console.log('%cWelcome to the holiday magic! ✨', 'color: #ffd700; font-size: 16px;');
    console.log('%cBuilt with ❤️ for the Red Bird Neighborhood', 'color: #0a3d2e; font-size: 12px;');
    console.log(`%cDevice: ${isMobile ? 'Mobile' : 'Desktop'} | Touch: ${supportsTouch ? 'Yes' : 'No'} | iOS: ${isIOS ? 'Yes' : 'No'}`, 'color: #888; font-size: 10px;');
    
})();