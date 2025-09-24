/**
 * UTILS.JS - Utilidades compartidas para todo el proyecto
 * Funciones helper reutilizables para todos los demos
 */

/**
 * Utilidades DOM
 */
const DOM = {
    /**
     * Selector mejorado que retorna null si no encuentra
     * @param {string} selector - Selector CSS
     * @param {Element} context - Contexto de búsqueda (opcional)
     * @returns {Element|null}
     */
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * Selector múltiple
     * @param {string} selector - Selector CSS
     * @param {Element} context - Contexto de búsqueda (opcional)
     * @returns {NodeList}
     */
    $$(selector, context = document) {
        return context.querySelectorAll(selector);
    },

    /**
     * Crear elemento con atributos
     * @param {string} tag - Tag HTML
     * @param {object} attributes - Atributos del elemento
     * @param {string} content - Contenido interno (opcional)
     * @returns {Element}
     */
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    /**
     * Verificar si elemento es visible en viewport
     * @param {Element} element - Elemento a verificar
     * @param {number} threshold - Porcentaje de visibilidad (0-1)
     * @returns {boolean}
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        return vertInView && horInView;
    }
};

/**
 * Utilidades de animación
 */
const Animation = {
    /**
     * Animar número desde valor inicial hasta final
     * @param {Element} element - Elemento que contiene el número
     * @param {number} from - Valor inicial
     * @param {number} to - Valor final
     * @param {number} duration - Duración en ms
     * @param {function} formatter - Función para formatear el número
     */
    animateNumber(element, from, to, duration = 1000, formatter = (n) => n) {
        const startTime = performance.now();
        const difference = to - from;
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = from + (difference * easedProgress);
            
            element.textContent = formatter(Math.round(currentValue));
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    },

    /**
     * Efecto typewriter para texto
     * @param {Element} element - Elemento de texto
     * @param {string} text - Texto a escribir
     * @param {number} speed - Velocidad en ms por carácter
     */
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    },

    /**
     * Fade in/out con callback
     * @param {Element} element - Elemento a animar
     * @param {'in'|'out'} direction - Dirección del fade
     * @param {number} duration - Duración en ms
     * @param {function} callback - Función a ejecutar al terminar
     */
    fade(element, direction, duration = 300, callback = null) {
        const isIn = direction === 'in';
        const startOpacity = isIn ? 0 : 1;
        const endOpacity = isIn ? 1 : 0;
        
        element.style.opacity = startOpacity;
        if (isIn) element.style.display = 'block';
        
        const startTime = performance.now();
        
        const updateOpacity = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;
            element.style.opacity = currentOpacity;
            
            if (progress < 1) {
                requestAnimationFrame(updateOpacity);
            } else {
                if (!isIn) element.style.display = 'none';
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(updateOpacity);
    }
};

/**
 * Utilidades de localStorage
 */
const Storage = {
    /**
     * Guardar en localStorage con manejo de errores
     * @param {string} key - Clave
     * @param {any} value - Valor (se convierte a JSON)
     * @returns {boolean} - True si se guardó correctamente
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Storage.set error:', error);
            return false;
        }
    },

    /**
     * Obtener de localStorage
     * @param {string} key - Clave
     * @param {any} defaultValue - Valor por defecto
     * @returns {any} - Valor parseado o defaultValue
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Storage.get error:', error);
            return defaultValue;
        }
    },

    /**
     * Eliminar de localStorage
     * @param {string} key - Clave
     * @returns {boolean} - True si se eliminó
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Storage.remove error:', error);
            return false;
        }
    }
};

/**
 * Utilidades de performance
 */
const Performance = {
    /**
     * Debounce para funciones que se ejecutan frecuentemente
     * @param {function} func - Función a hacer debounce
     * @param {number} wait - Tiempo de espera en ms
     * @returns {function} - Función con debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle para funciones que se ejecutan frecuentemente
     * @param {function} func - Función a hacer throttle
     * @param {number} limit - Límite de tiempo en ms
     * @returns {function} - Función con throttle
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Medir tiempo de ejecución de una función
     * @param {string} label - Etiqueta para la medición
     * @param {function} func - Función a medir
     * @returns {any} - Resultado de la función
     */
    measure(label, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

/**
 * Utilidades de accesibilidad
 */
const A11y = {
    /**
     * Anunciar texto a lectores de pantalla
     * @param {string} message - Mensaje a anunciar
     * @param {string} priority - Prioridad: 'polite' o 'assertive'
     */
    announce(message, priority = 'polite') {
        const announcer = DOM.create('div', {
            'aria-live': priority,
            'aria-atomic': 'true',
            className: 'sr-only'
        });
        
        document.body.appendChild(announcer);
        announcer.textContent = message;
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    },

    /**
     * Verificar si las animaciones están deshabilitadas
     * @returns {boolean}
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Verificar si el usuario prefiere alto contraste
     * @returns {boolean}
     */
    prefersHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    },

    /**
     * Manejar focus trap para modales
     * @param {Element} container - Contenedor del modal
     */
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
};

/**
 * Utilidades para CSS moderno
 */
const CSS = {
    /**
     * Verificar soporte de una propiedad CSS
     * @param {string} property - Propiedad CSS
     * @param {string} value - Valor a probar (opcional)
     * @returns {boolean}
     */
    supports(property, value = '') {
        if (value) {
            return CSS.supports(property, value);
        }
        return CSS.supports(property);
    },

    /**
     * Aplicar custom properties dinámicamente
     * @param {Element} element - Elemento objetivo
     * @param {object} properties - Objeto con propiedades CSS
     */
    setCustomProperties(element, properties) {
        Object.entries(properties).forEach(([property, value]) => {
            const cssProperty = property.startsWith('--') ? property : `--${property}`;
            element.style.setProperty(cssProperty, value);
        });
    },

    /**
     * Obtener valor de custom property
     * @param {string} property - Nombre de la propiedad
     * @param {Element} element - Elemento contexto (opcional)
     * @returns {string}
     */
    getCustomProperty(property, element = document.documentElement) {
        const cssProperty = property.startsWith('--') ? property : `--${property}`;
        return getComputedStyle(element).getPropertyValue(cssProperty).trim();
    }
};

/**
 * Event bus simple para comunicación entre componentes
 */
const EventBus = {
    events: {},

    /**
     * Suscribirse a un evento
     * @param {string} eventName - Nombre del evento
     * @param {function} callback - Función callback
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },

    /**
     * Emitir un evento
     * @param {string} eventName - Nombre del evento
     * @param {any} data - Datos a enviar
     */
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    },

    /**
     * Desuscribirse de un evento
     * @param {string} eventName - Nombre del evento
     * @param {function} callback - Función callback a remover
     */
    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }
};

// Exponer utilidades globalmente
window.Utils = {
    DOM,
    Animation,
    Storage,
    Performance,
    A11y,
    CSS,
    EventBus
};

// Debug en desarrollo
if (window.location.hostname === 'localhost') {
    console.log('🛠️ Utils cargadas:', Object.keys(window.Utils));
}