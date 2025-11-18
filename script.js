/**
 * Red Bird Holiday Trail - Interactive JavaScript
 * Vanilla JavaScript with falling snow effect and smooth scrolling
 */

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ===================================
    // FALLING SNOW EFFECT
    // ===================================
    
    if (!prefersReducedMotion) {
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Snowflake class
        class Snowflake {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.radius = Math.random() * 3 + 1; // 1-4px
                this.speed = Math.random() * 1 + 0.5; // 0.5-1.5 fall speed
                this.wind = Math.random() * 0.5 - 0.25; // -0.25 to 0.25 horizontal drift
                this.opacity = Math.random() * 0.6 + 0.3; // 0.3-0.9 opacity
            }
            
            update() {
                this.y += this.speed;
                this.x += this.wind;
                
                // Reset snowflake if it goes off screen
                if (this.y > canvas.height) {
                    this.reset();
                    this.y = -10;
                }
                
                if (this.x > canvas.width + 10) {
                    this.x = -10;
                } else if (this.x < -10) {
                    this.x = canvas.width + 10;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Create snowflakes (adjusted for performance)
        const snowflakeCount = Math.min(Math.floor(canvas.width / 10), 100);
        const snowflakes = [];
        
        for (let i = 0; i < snowflakeCount; i++) {
            snowflakes.push(new Snowflake());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            snowflakes.forEach(snowflake => {
                snowflake.update();
                snowflake.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only smooth scroll if it's an actual anchor (not just "#")
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===================================
    // SCROLL REVEAL ANIMATIONS
    // ===================================
    
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe cards and sections for reveal effect
        const elementsToObserve = document.querySelectorAll('.info-card, .step-card, .stop-card, .faq-item');
        
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ===================================
    // BUTTON INTERACTION ENHANCEMENTS
    // ===================================
    
    // Add click ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
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
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
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
    
    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    
    // Pause snow animation when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations if needed
            canvas.style.display = 'none';
        } else {
            canvas.style.display = 'block';
        }
    });
    
    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    
    console.log('%c🎄 Red Bird Holiday Trail 🎄', 'color: #d62828; font-size: 24px; font-weight: bold;');
    console.log('%cWelcome to the holiday magic! ✨', 'color: #ffd700; font-size: 16px;');
    console.log('%cBuilt with ❤️ for the Red Bird Neighborhood', 'color: #0a3d2e; font-size: 12px;');
    
})();