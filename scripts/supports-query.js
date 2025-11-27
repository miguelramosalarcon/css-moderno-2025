/**
 * SUPPORTS QUERY DEMO - JavaScript
 * Detecta capacidades CSS del navegador y actualiza la UI
 * Miguel Ramos Alarcon - CSS Moderno 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const capabilityCards = document.querySelectorAll('.capability-card');
    const featureBadges = document.querySelectorAll('.feature-badge');
    
    /**
     * INICIALIZACIÓN
     */
    function init() {
        detectBrowserCapabilities();
        updateFeatureBadges();
        setupAnimations();
        setupCodeCopy();
        
        console.log('🔍 Demo @supports inicializado correctamente');
        logBrowserCapabilities();
    }

    /**
     * DETECTAR CAPACIDADES DEL NAVEGADOR
     */
    function detectBrowserCapabilities() {
        const features = [
            {
                name: 'grid',
                test: 'display: grid',
                card: document.querySelector('[data-feature="grid"]')
            },
            {
                name: 'backdrop-filter',
                test: 'backdrop-filter: blur(10px)',
                card: document.querySelector('[data-feature="backdrop-filter"]')
            },
            {
                name: 'color-mix',
                test: 'background: color-mix(in srgb, red, blue)',
                card: document.querySelector('[data-feature="color-mix"]')
            },
            {
                name: 'container-queries',
                test: 'container-type: inline-size',
                card: document.querySelector('[data-feature="container-queries"]')
            },
            {
                name: 'has-selector',
                selector: ':has(*)',
                card: document.querySelector('[data-feature="has-selector"]')
            },
            {
                name: 'subgrid',
                test: 'grid-template-columns: subgrid',
                card: document.querySelector('[data-feature="subgrid"]')
            }
        ];

        features.forEach((feature, index) => {
            // Delay progresivo para efecto visual
            setTimeout(() => {
                checkFeatureSupport(feature);
            }, index * 200);
        });
    }

    /**
     * VERIFICAR SOPORTE DE UNA CARACTERÍSTICA
     */
    function checkFeatureSupport(feature) {
        let isSupported = false;

        try {
            if (feature.selector) {
                // Verificar selector con CSS.supports
                isSupported = CSS.supports('selector(' + feature.selector + ')');
            } else if (feature.test) {
                // Verificar propiedad CSS
                isSupported = CSS.supports(feature.test);
            }
        } catch (error) {
            console.warn(`Error al verificar ${feature.name}:`, error);
            isSupported = false;
        }

        updateCapabilityCard(feature.card, isSupported, feature.name);
    }

    /**
     * ACTUALIZAR ESTADO DE CAPABILITY CARD
     */
    function updateCapabilityCard(card, isSupported, featureName) {
        if (!card) return;

        const statusElement = card.querySelector('.capability-status');
        const badgeElement = card.querySelector('.status-badge');

        if (!statusElement || !badgeElement) return;

        // Animación de transición
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);

        // Actualizar estado
        const status = isSupported ? 'supported' : 'not-supported';
        card.setAttribute('data-status', status);

        // Actualizar texto
        if (isSupported) {
            badgeElement.textContent = '✅ Soportado';
            announceToScreenReader(`${featureName} está soportado en tu navegador`);
        } else {
            badgeElement.textContent = '❌ No soportado';
            announceToScreenReader(`${featureName} no está soportado en tu navegador`);
        }

        // Log para debugging
        console.log(`${isSupported ? '✅' : '❌'} ${featureName}: ${isSupported ? 'Soportado' : 'No soportado'}`);
    }

    /**
     * ACTUALIZAR BADGES DE CARACTERÍSTICAS EN LA GALERÍA
     */
    function updateFeatureBadges() {
        const gridSupported = CSS.supports('display: grid');
        const backdropSupported = CSS.supports('backdrop-filter: blur(10px)');
        const colorMixSupported = CSS.supports('background: color-mix(in srgb, red, blue)');

        // Actualizar badge de Grid
        const gridBadge = document.querySelector('[data-feature="grid"]');
        if (gridBadge) {
            gridBadge.style.borderColor = gridSupported ? 'var(--success)' : 'var(--error)';
            gridBadge.style.opacity = gridSupported ? '1' : '0.6';
        }

        // Actualizar badge de Backdrop
        const backdropBadge = document.querySelector('[data-feature="backdrop"]');
        if (backdropBadge) {
            backdropBadge.style.borderColor = backdropSupported ? 'var(--success)' : 'var(--error)';
            backdropBadge.style.opacity = backdropSupported ? '1' : '0.6';
        }

        // Actualizar badge de Color-mix
        const colorMixBadge = document.querySelector('[data-feature="color-mix"]');
        if (colorMixBadge) {
            colorMixBadge.style.borderColor = colorMixSupported ? 'var(--success)' : 'var(--error)';
            colorMixBadge.style.opacity = colorMixSupported ? '1' : '0.6';
        }

        // Mensaje informativo en console
        console.log('📊 Resumen de soporte:');
        console.log(`   Grid: ${gridSupported ? '✅' : '❌'}`);
        console.log(`   Backdrop Filter: ${backdropSupported ? '✅' : '❌'}`);
        console.log(`   Color-mix: ${colorMixSupported ? '✅' : '❌'}`);
    }

    /**
     * ANIMACIONES DE ENTRADA CON INTERSECTION OBSERVER
     */
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos animables
        document.querySelectorAll('.code-block, .use-case-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * COPIAR CÓDIGO AL CLIPBOARD
     */
    function setupCodeCopy() {
        document.querySelectorAll('.code-content').forEach(codeBlock => {
            // Indicador visual de que es clickeable
            codeBlock.style.cursor = 'pointer';
            codeBlock.title = 'Click para copiar código';

            codeBlock.addEventListener('click', function() {
                copyToClipboard(this.textContent);
            });
        });
    }

    /**
     * COPIAR TEXTO AL PORTAPAPELES
     */
    function copyToClipboard(text) {
        if (!navigator.clipboard) {
            // Fallback para navegadores antiguos
            fallbackCopyToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
            announceToScreenReader('Código copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar:', err);
            showCopyFeedback(false);
        });
    }

    /**
     * FALLBACK PARA COPIAR SIN CLIPBOARD API
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            showCopyFeedback(successful);
            if (successful) {
                announceToScreenReader('Código copiado al portapapeles');
            }
        } catch (err) {
            console.error('Fallback: Error al copiar', err);
            showCopyFeedback(false);
        }

        document.body.removeChild(textArea);
    }

    /**
     * MOSTRAR FEEDBACK AL COPIAR
     */
    function showCopyFeedback(success = true) {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = success ? '✓ Copiado!' : '✗ Error al copiar';
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${success ? 'var(--success)' : 'var(--error)'};
            color: var(--brand-white);
            padding: var(--spacing-md) var(--spacing-xl);
            border-radius: var(--border-radius);
            font-weight: 600;
            z-index: 10000;
            animation: slideInUp 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }

    /**
     * ANUNCIAR A SCREEN READERS
     */
    function announceToScreenReader(message) {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';

        document.body.appendChild(announcer);
        announcer.textContent = message;

        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * INTERACCIONES CON GALLERY ITEMS
     */
    function setupGalleryInteractions() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            const overlayButton = item.querySelector('.overlay-button');

            if (overlayButton) {
                overlayButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const title = item.querySelector('.gallery-title').textContent;
                    showGalleryModal(item, title);
                });
            }

            // Keyboard accessibility
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && overlayButton) {
                    overlayButton.click();
                }
            });
        });
    }

    /**
     * MOSTRAR MODAL DE GALERÍA (DEMO)
     */
    function showGalleryModal(item, title) {
        console.log(`📸 Mostrando detalles de: ${title}`);
        announceToScreenReader(`Mostrando detalles de ${title}`);

        // Aquí podrías implementar un modal real
        alert(`Demo: Mostrando detalles de "${title}"\n\nEn una implementación real, aquí se abriría un modal con más información.`);
    }

    /**
     * LOGGING DE CAPACIDADES DEL NAVEGADOR
     */
    function logBrowserCapabilities() {
        console.log('═══════════════════════════════════════');
        console.log('🔍 DETECCIÓN DE CAPACIDADES CSS');
        console.log('═══════════════════════════════════════');

        const capabilities = {
            'CSS Grid': CSS.supports('display: grid'),
            'Flexbox': CSS.supports('display: flex'),
            'Grid Subgrid': CSS.supports('grid-template-columns: subgrid'),
            'Container Queries': CSS.supports('container-type: inline-size'),
            'Selector :has()': CSS.supports('selector(:has(*))'),
            'Selector :is()': CSS.supports('selector(:is(*))'),
            'Selector :where()': CSS.supports('selector(:where(*))'),
            'backdrop-filter': CSS.supports('backdrop-filter: blur(10px)'),
            'color-mix()': CSS.supports('background: color-mix(in srgb, red, blue)'),
            'clamp()': CSS.supports('width: clamp(1px, 50%, 100px)'),
            'aspect-ratio': CSS.supports('aspect-ratio: 16 / 9'),
            'gap (Grid/Flex)': CSS.supports('gap: 1rem'),
            'CSS Custom Properties': CSS.supports('--custom: value'),
            'CSS Nesting': CSS.supports('selector(& div)'),
            'color-contrast()': CSS.supports('color: color-contrast(white vs black, blue)'),
            '@layer': CSS.supports('@layer')
        };

        Object.entries(capabilities).forEach(([name, supported]) => {
            console.log(`${supported ? '✅' : '❌'} ${name}`);
        });

        console.log('═══════════════════════════════════════');

        // Información del navegador
        console.log('📱 Información del navegador:');
        console.log(`   User Agent: ${navigator.userAgent}`);
        console.log(`   Viewport: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`   Pixel Ratio: ${window.devicePixelRatio}`);
        console.log('═══════════════════════════════════════');
    }

    /**
     * GENERAR REPORTE DE SOPORTE
     */
    function generateSupportReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: window.devicePixelRatio
            },
            features: {
                grid: CSS.supports('display: grid'),
                backdropFilter: CSS.supports('backdrop-filter: blur(10px)'),
                colorMix: CSS.supports('background: color-mix(in srgb, red, blue)'),
                containerQueries: CSS.supports('container-type: inline-size'),
                hasSelector: CSS.supports('selector(:has(*))'),
                subgrid: CSS.supports('grid-template-columns: subgrid')
            }
        };

        return report;
    }

    /**
     * EXPONER API PÚBLICA PARA DEBUGGING
     */
    window.supportsDemo = {
        detectCapabilities: detectBrowserCapabilities,
        logCapabilities: logBrowserCapabilities,
        generateReport: generateSupportReport,
        checkFeature: (test) => {
            try {
                return CSS.supports(test);
            } catch (error) {
                console.error('Error al verificar feature:', error);
                return false;
            }
        },
        checkSelector: (selector) => {
            try {
                return CSS.supports('selector(' + selector + ')');
            } catch (error) {
                console.error('Error al verificar selector:', error);
                return false;
            }
        }
    };

    /**
     * PERFORMANCE MONITORING
     */
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`📈 Página cargada en ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }, 0);
        });
    }

    /**
     * MANEJO DE ERRORES GLOBALES
     */
    window.addEventListener('error', (event) => {
        console.warn('Error en SupportsDemo:', event.error);
    });

    /**
     * INICIALIZAR TODO
     */
    init();
    setupGalleryInteractions();

    // Mensaje final
    console.log('🎉 Demo de @supports completamente cargado');
    console.log('💡 Usa window.supportsDemo para debugging');
    console.log('📊 Ejemplo: window.supportsDemo.checkFeature("display: grid")');
});