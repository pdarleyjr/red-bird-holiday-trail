/**
 * Red Bird Holiday Trail - Mobile-Optimized Interactive JavaScript
 * Vanilla JavaScript with falling snow effect, touch interactions, and PWA features
 */

(function () {
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
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                // Prevent default for placeholder links (like "Coming Soon")
                e.preventDefault();
            } else if (href !== '#') {
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
            element.addEventListener('touchstart', function () {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });

            element.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }, { passive: true });

            element.addEventListener('touchcancel', function () {
                this.style.transform = '';
            }, { passive: true });
        });
    }

    // ===================================
    // BUTTON RIPPLE EFFECT
    // ===================================

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
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
    // MOBILE NAVIGATION - ACTIVE STATE
    // ===================================

    if (window.innerWidth <= 1024) {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navItems = document.querySelectorAll('.nav-item');

        // Create a map of section IDs to nav items
        const navMap = new Map();
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                navMap.set(sectionId, item);
            }
        });

        // Intersection Observer for active state
        const navObserverOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -60% 0px'
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const activeNavItem = navMap.get(sectionId);

                    if (activeNavItem) {
                        // Remove active class from all nav items
                        navItems.forEach(item => item.classList.remove('active'));
                        // Add active class to current nav item
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }, navObserverOptions);

        // Observe all sections
        sections.forEach(section => {
            navObserver.observe(section);
        });

        // Handle orientation changes for mobile nav
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (window.innerWidth > 1024) {
                    // Cleanup observers if switched to desktop view
                    sections.forEach(section => navObserver.unobserve(section));
                }
            }, 100);
        }, { passive: true });
    }

    // ===================================
    // PERSISTENT VIEW COUNTER (CountAPI)
    // ===================================

    /**
     * Fetch and display the view count using CountAPI
     * CountAPI provides a free, persistent counter that never resets
     * unless explicitly cleared by the namespace/key owner
     */
    (function initViewCounter() {
        const viewCountElement = document.getElementById('viewCount');

        if (!viewCountElement) return;

        // Use CountAPI to track page views
        // Format: https://api.countapi.xyz/hit/{namespace}/{key}
        // This increments the counter and returns the new value
        const namespace = 'red-bird-holiday-trail';
        const key = 'site-visits';
        const apiUrl = `https://api.countapi.xyz/hit/${namespace}/${key}`;

        // Fetch the count
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data.value === 'number') {
                    // Format the number with commas for readability
                    const formattedCount = data.value.toLocaleString();
                    viewCountElement.textContent = formattedCount;
                } else {
                    viewCountElement.textContent = '---';
                }
            })
            .catch(error => {
                console.error('[View Counter] Failed to fetch count:', error);
                viewCountElement.textContent = '---';
            });
    })();

    // ===================================
    // SERVICE WORKER REGISTRATION (PWA)
    // ===================================

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered successfully:', registration.scope);

                    // Check for updates on page load
                    registration.update();

                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('[PWA] New Service Worker found, installing...');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, could show update notification
                                console.log('[PWA] New version available! Refresh to update.');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });

            // Handle controller change (new service worker activated)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[PWA] New Service Worker activated');
            });
        }, { passive: true });
    } else {
        console.log('[PWA] Service Workers are not supported in this browser');
    }

    // ===================================
    //LEX                       // ===================================

    // ===================================
    // IMAGE CAROUSEL WITH AUTO-ROTATION
    // ===================================

    (function initCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicatorsContainer = document.getElementById('carouselIndicators');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxPicture = document.getElementById('lightboxPicture');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightboxCounter = document.getElementById('lightboxCounter');

        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoRotateInterval;
        let isAutoRotating = true;
        const AUTO_ROTATE_DELAY = 5000; // 5 seconds

        // Create indicators
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('carousel-indicator');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = Array.from(indicatorsContainer.querySelectorAll('.carousel-indicator'));

        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetAutoRotate();
        }

        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Auto-rotation
        function startAutoRotate() {
            if (!prefersReducedMotion && isAutoRotating) {
                autoRotateInterval = setInterval(nextSlide, AUTO_ROTATE_DELAY);
            }
        }

        function stopAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
            }
        }

        function resetAutoRotate() {
            stopAutoRotate();
            startAutoRotate();
        }

        // Event listeners
        prevBtn?.addEventListener('click', () => {
            prevSlide();
            resetAutoRotate();
        });

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            resetAutoRotate();
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoRotate();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoRotate();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) return; // Don't interfere with lightbox

            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoRotate();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoRotate();
            }
        });

        // Pause auto-rotate when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoRotate();
            } else if (isAutoRotating) {
                startAutoRotate();
            }
        });

        // Pause auto-rotate on hover (desktop only)
        if (!isMobile) {
            track.addEventListener('mouseenter', stopAutoRotate);
            track.addEventListener('mouseleave', startAutoRotate);
        }

        // ===================================
        // LIGHTBOX FUNCTIONALITY
        // ===================================

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
            stopAutoRotate();
            isAutoRotating = false;
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
            isAutoRotating = true;
            startAutoRotate();
        }

        function updateLightboxImage() {
            const currentSlide = slides[currentIndex];
            const picture = currentSlide.querySelector('picture');
            const img = picture.querySelector('img');
            const source = picture.querySelector('source');

            // Clone the picture element for responsive image loading
            const newPicture = picture.cloneNode(true);
            const newImg = newPicture.querySelector('img');
            newImg.id = 'lightboxImg';

            // Clear and update lightbox picture
            lightboxPicture.innerHTML = '';
            lightboxPicture.appendChild(newPicture);

            // Update counter
            lightboxCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }

        function lightboxNext() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateLightboxImage();
        }

        function lightboxPrevious() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateLightboxImage();
        }

        // Click on carousel slide to open lightbox
        slides.forEach((slide, index) => {
            slide.addEventListener('click', () => openLightbox(index));
        });

        // Lightbox controls
        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxNext?.addEventListener('click', lightboxNext);
        lightboxPrev?.addEventListener('click', lightboxPrevious);

        // Close lightbox on background click
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrevious();
            } else if (e.key === 'ArrowRight') {
                lightboxNext();
            }
        });

        // Touch/swipe support for lightbox
        let lightboxTouchStartX = 0;
        let lightboxTouchEndX = 0;

        lightbox?.addEventListener('touchstart', (e) => {
            if (e.target.closest('.lightbox-content')) {
                lightboxTouchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        lightbox?.addEventListener('touchend', (e) => {
            if (e.target.closest('.lightbox-content')) {
                lightboxTouchEndX = e.changedTouches[0].screenX;
                handleLightboxSwipe();
            }
        }, { passive: true });

        function handleLightboxSwipe() {
            const swipeThreshold = 50;
            const diff = lightboxTouchStartX - lightboxTouchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    lightboxNext();
                } else {
                    lightboxPrevious();
                }
            }
        }

        // Start auto-rotation
        startAutoRotate();

        console.log(`[Carousel] Initialized with ${totalSlides} slides (auto-rotate: ${AUTO_ROTATE_DELAY / 1000}s)`);
    })();

    // ===================================
    // CONSOLE MESSAGE
    // ===================================

    console.log('%c🎄 Red Bird Holiday Trail 🎄', 'color: #d62828; font-size: 24px; font-weight: bold;');
    console.log('%cWelcome to the holiday magic! ✨', 'color: #ffd700; font-size: 16px;');
    console.log('%cBuilt with ❤️ for the Red Bird Neighborhood', 'color: #0a3d2e; font-size: 12px;');
    console.log(`%cDevice: ${isMobile ? 'Mobile' : 'Desktop'} | Touch: ${supportsTouch ? 'Yes' : 'No'} | iOS: ${isIOS ? 'Yes' : 'No'}`, 'color: #888; font-size: 10px;');

    // ===================================
    // STORY CAROUSEL - NAT GEO STYLE (NO AUTOPLAY)
    // ===================================

    (function initStoryCarousel() {
        const track = document.getElementById('storyCarouselTrack');
        const prevBtn = document.getElementById('storyPrevBtn');
        const nextBtn = document.getElementById('storyNextBtn');
        const progressContainer = document.getElementById('storyProgress');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxPicture = document.getElementById('lightboxPicture');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightboxCounter = document.getElementById('lightboxCounter');

        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-story-slide'));
        const totalSlides = slides.length;
        let currentIndex = 0;

        // Create progress indicators
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('story-indicator');
            indicator.setAttribute('aria-label', `Go to story ${index + 1}`);
            indicator.setAttribute('data-index', index);
            if (index === 0) indicator.setAttribute('data-active', 'true');
            indicator.addEventListener('click', () => goToSlide(index));
            progressContainer.appendChild(indicator);
        });

        const indicators = Array.from(progressContainer.querySelectorAll('.story-indicator'));

        // Update carousel position and active states
        function updateCarousel(transition = true) {
            // Remove transition temporarily if needed
            if (!transition) {
                track.style.transition = 'none';
            }

            // Update slide active states
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.setAttribute('data-active', 'true');
                } else {
                    slide.removeAttribute('data-active');
                }
            });

            // Calculate transform for center-focused layout
            // On mobile: show only current slide
            // On desktop: show current + flanking slides
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobile: simple left translation
                const slideWidth = slides[0].offsetWidth;
                const gap = 20; // margin between slides
                const offset = -(currentIndex * (slideWidth + gap));
                track.style.transform = `translateX(${offset}px)`;
            } else {
                // Desktop: center current slide
                const slideWidth = slides[0].offsetWidth;
                const gap = 30; // margin between slides
                const viewportWidth = track.parentElement.offsetWidth;
                const centerOffset = (viewportWidth / 2) - (slideWidth / 2);
                const slideOffset = currentIndex * (slideWidth + gap);
                const offset = centerOffset - slideOffset;
                track.style.transform = `translateX(${offset}px)`;
            }

            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.setAttribute('data-active', 'true');
                } else {
                    indicator.removeAttribute('data-active');
                }
            });

            // Re-enable transition
            if (!transition) {
                setTimeout(() => {
                    track.style.transition = '';
                }, 50);
            }
        }

        // Go to specific slide
        function goToSlide(index) {
            if (index < 0 || index >= totalSlides) return;
            currentIndex = index;
            updateCarousel();
        }

        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Navigation button event listeners
        prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Story Carousel] Previous button clicked');
            prevSlide();
        });

        nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Story Carousel] Next button clicked');
            nextSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox?.classList.contains('active')) return; // Don't interfere with lightbox

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);

            // Only trigger if horizontal swipe is dominant
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel(false);
            }, 250);
        }, { passive: true });

        // ===================================
        // LIGHTBOX FUNCTIONALITY
        // ===================================

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox?.classList.add('active');
            document.body.classList.add('lightbox-open');
        }

        function closeLightbox() {
            lightbox?.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }

        function updateLightboxImage() {
            const currentSlide = slides[currentIndex];
            const picture = currentSlide.querySelector('picture');
            const img = picture.querySelector('img');

            // Clone the picture element for responsive image loading
            const newPicture = picture.cloneNode(true);
            const newImg = newPicture.querySelector('img');
            newImg.id = 'lightboxImg';

            // Clear and update lightbox picture
            if (lightboxPicture) {
                lightboxPicture.innerHTML = '';
                lightboxPicture.appendChild(newPicture);
            }

            // Update counter
            if (lightboxCounter) {
                lightboxCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
            }
        }

        function lightboxNextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateLightboxImage();
        }

        function lightboxPrevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateLightboxImage();
        }

        // Click on carousel slide to open lightbox
        slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                // Don't open lightbox immediately - only on active slide
                if (slide.getAttribute('data-active') === 'true') {
                    openLightbox(index);
                }
            });
        });

        // Lightbox controls
        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxNext?.addEventListener('click', lightboxNextSlide);
        lightboxPrev?.addEventListener('click', lightboxPrevSlide);

        // Close lightbox on background click
        lightbox?.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox?.classList.contains('active')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                lightboxPrevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                lightboxNextSlide();
            }
        });

        // Touch/swipe support for lightbox
        let lightboxTouchStartX = 0;
        let lightboxTouchEndX = 0;

        lightbox?.addEventListener('touchstart', (e) => {
            if (e.target.closest('.lightbox-content')) {
                lightboxTouchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        lightbox?.addEventListener('touchend', (e) => {
            if (e.target.closest('.lightbox-content')) {
                lightboxTouchEndX = e.changedTouches[0].screenX;
                handleLightboxSwipe();
            }
        }, { passive: true });

        function handleLightboxSwipe() {
            const swipeThreshold = 50;
            const diff = lightboxTouchStartX - lightboxTouchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    lightboxNextSlide();
                } else {
                    lightboxPrevSlide();
                }
            }
        }

        // Initialize carousel
        updateCarousel(false);

        console.log(`[Story Carousel] Initialized with ${totalSlides} stories (NO AUTOPLAY - user-controlled navigation)`);
    })();

    // ===================================
    // CONSOLE MESSAGE
    // ===================================

})();