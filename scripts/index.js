/**
 * INDEX.JS - JavaScript específico para la página principal
 * Maneja animaciones, smooth scroll y efectos interactivos del index
 */

class IndexPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScroll();
        this.setupCardAnimations();
        this.setupHeroEffects();
        this.setupThemeListener();
    }
    
    /**
     * Configura smooth scroll para el indicador de scroll
     */
    setupSmoothScroll() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const mainDemos = document.querySelector('.main-demos');
        
        if (scrollIndicator && mainDemos) {
            scrollIndicator.addEventListener('click', (event) => {
                event.preventDefault();
                
                mainDemos.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Analytics opcional
                this.trackEvent('scroll_indicator_clicked');
            });
        }
    }
    
    /**
     * Configura animaciones de entrada para las cards
     */
    setupCardAnimations() {
        const cards = document.querySelectorAll('.demo-card');
        
        if (!cards.length) return;
        
        // Configuración del Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Delay progresivo para efecto cascada
                    const delay = Array.from(entry.target.parentNode.children)
                        .indexOf(entry.target) * 100;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    
                    // Dejar de observar una vez animado
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar todas las cards
        cards.forEach(card => {
            observer.observe(card);
        });
    }
    
    /**
     * Efectos interactivos del hero
     */
    setupHeroEffects() {
        this.setupParallaxEffect();
        this.setupStatsAnimation();
        this.setupLogoInteraction();
    }
    
    /**
     * Efecto parallax sutil para el hero
     */
    setupParallaxEffect() {
        const hero = document.querySelector('.hero-header');
        
        if (!hero) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
            
            ticking = false;
        };
        
        const requestParallax = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Solo aplicar parallax si no hay preferencia de motion reducido
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.addEventListener('scroll', requestParallax);
        }
    }
    
    /**
     * Animación de contadores en las estadísticas
     */
    setupStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (!statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    /**
     * Anima un número desde 0 hasta su valor final
     * @param {Element} element - Elemento que contiene el número
     */
    animateNumber(element) {
        const finalValue = element.textContent;
        const isPercentage = finalValue.includes('%');
        const targetNumber = parseInt(finalValue.replace(/\D/g, ''));
        
        let currentNumber = 0;
        const increment = targetNumber / 60; // 60 frames para ~1 segundo
        
        const updateNumber = () => {
            currentNumber += increment;
            
            if (currentNumber < targetNumber) {
                const displayNumber = Math.floor(currentNumber);
                element.textContent = isPercentage ? `${displayNumber}%` : displayNumber;
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = finalValue; // Valor final exacto
            }
        };
        
        updateNumber();
    }
    
    /**
     * Interactividad del logo
     */
    setupLogoInteraction() {
        const logo = document.querySelector('.brand-logo');
        
        if (!logo) return;
        
        let clickCount = 0;
        
        logo.addEventListener('click', () => {
            clickCount++;
            
            // Easter egg después de 5 clicks
            if (clickCount === 5) {
                this.triggerLogoEasterEgg();
                clickCount = 0; // Reset
            }
        });
    }
    
    /**
     * Easter egg del logo
     */
    triggerLogoEasterEgg() {
        const logo = document.querySelector('.brand-logo svg');
        
        if (!logo) return;
        
        // Animación especial
        logo.style.animation = 'logoSpin 2s ease-in-out';
        
        // Crear CSS dinámicamente si no existe
        if (!document.querySelector('#logo-easter-egg-styles')) {
            const style = document.createElement('style');
            style.id = 'logo-easter-egg-styles';
            style.textContent = `
                @keyframes logoSpin {
                    0% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.2) rotate(180deg); }
                    50% { transform: scale(1) rotate(360deg); }
                    75% { transform: scale(1.1) rotate(540deg); }
                    100% { transform: scale(1) rotate(720deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Resetear animación después
        setTimeout(() => {
            logo.style.animation = '';
        }, 2000);
        
        // Console message para desarrolladores
        console.log('🎉 ¡Has encontrado el easter egg de Miguel Ramos! ¡Hola developer!');
    }
    
    /**
     * Escucha cambios de tema para actualizar efectos
     */
    setupThemeListener() {
        document.addEventListener('themechange', (event) => {
            const isDark = event.detail.isDark;
            
            // Actualizar efectos específicos del tema si es necesario
            this.updateThemeEffects(isDark);
            
            // Analytics del cambio de tema
            this.trackEvent('theme_changed', { theme: event.detail.theme });
        });
    }
    
    /**
     * Actualiza efectos según el tema
     * @param {boolean} isDark - Si el tema es oscuro
     */
    updateThemeEffects(isDark) {
        const hero = document.querySelector('.hero-header');
        
        if (!hero) return;
        
        // Ejemplo: cambiar intensidad de efectos según tema
        if (isDark) {
            hero.style.setProperty('--hero-glow-opacity', '0.3');
        } else {
            hero.style.setProperty('--hero-glow-opacity', '0.1');
        }
    }
    
    /**
     * Utilidad para tracking de eventos (opcional)
     * @param {string} eventName - Nombre del evento
     * @param {object} properties - Propiedades adicionales
     */
    trackEvent(eventName, properties = {}) {
        // Implementar analytics aquí si es necesario
        // Ejemplo: gtag, analytics, etc.
        
        if (window.gtag) {
            window.gtag('event', eventName, properties);
        }
        
        // Debug en desarrollo
        if (window.location.hostname === 'localhost') {
            console.log(`📊 Event tracked: ${eventName}`, properties);
        }
    }
    
    /**
     * Utilidades públicas para otros scripts
     */
    getApi() {
        return {
            scrollToSection: (selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            },
            triggerCardAnimation: (cardIndex) => {
                const cards = document.querySelectorAll('.demo-card');
                if (cards[cardIndex]) {
                    cards[cardIndex].classList.add('animate-in');
                }
            },
            getCurrentTheme: () => {
                return window.themeToggle?.getApi().getCurrentTheme() || 'light';
            }
        };
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.indexPage = new IndexPage();
    });
} else {
    window.indexPage = new IndexPage();
}

// Manejo de errores globales para debugging
window.addEventListener('error', (event) => {
    console.warn('IndexPage Error:', event.error);
});

// Performance monitoring opcional
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`📈 Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}