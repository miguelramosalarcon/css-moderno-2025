/**
 * THEME TOGGLE - JavaScript reutilizable
 * Maneja el cambio entre tema claro y oscuro
 * Compatible con todos los componentes del proyecto
 */

class ThemeToggle {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.html = document.documentElement;
        this.STORAGE_KEY = 'theme';
        this.THEMES = {
            LIGHT: 'light',
            DARK: 'dark'
        };
        
        this.init();
    }
    
    /**
     * Inicializa el toggle de tema
     */
    init() {
        if (!this.themeToggle) {
            console.warn('ThemeToggle: No se encontró elemento .theme-toggle');
            return;
        }
        
        this.setInitialTheme();
        this.bindEvents();
        this.observeSystemChanges();
    }
    
    /**
     * Establece el tema inicial basado en:
     * 1. Preferencia guardada en localStorage
     * 2. Preferencia del sistema
     * 3. Tema claro por defecto
     */
    setInitialTheme() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? this.THEMES.DARK : this.THEMES.LIGHT);
        
        this.applyTheme(initialTheme);
    }
    
    /**
     * Aplica un tema específico
     * @param {string} theme - 'light' o 'dark'
     */
    applyTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        this.themeToggle.setAttribute('aria-pressed', theme === this.THEMES.DARK);
        
        // Emitir evento personalizado para otros componentes
        this.dispatchThemeChange(theme);
    }
    
    /**
     * Cambia al tema opuesto
     */
    toggleTheme() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }
    
    /**
     * Obtiene el tema actual
     * @returns {string} Tema actual
     */
    getCurrentTheme() {
        return this.html.getAttribute('data-theme') || this.THEMES.LIGHT;
    }
    
    /**
     * Guarda el tema en localStorage
     * @param {string} theme - Tema a guardar
     */
    saveTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
        } catch (error) {
            console.warn('ThemeToggle: No se pudo guardar tema en localStorage', error);
        }
    }
    
    /**
     * Vincula eventos del toggle
     */
    bindEvents() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Soporte para teclado
        this.themeToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    /**
     * Observa cambios en la preferencia del sistema
     */
    observeSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (event) => {
            // Solo aplicar cambio si no hay preferencia guardada
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);
            if (!savedTheme) {
                const newTheme = event.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                this.applyTheme(newTheme);
            }
        });
    }
    
    /**
     * Emite evento personalizado cuando cambia el tema
     * @param {string} theme - Nuevo tema
     */
    dispatchThemeChange(theme) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: theme,
                isDark: theme === this.THEMES.DARK
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * API pública para otros scripts
     */
    getApi() {
        return {
            getCurrentTheme: () => this.getCurrentTheme(),
            setTheme: (theme) => {
                if (Object.values(this.THEMES).includes(theme)) {
                    this.applyTheme(theme);
                    this.saveTheme(theme);
                }
            },
            toggleTheme: () => this.toggleTheme(),
            isDark: () => this.getCurrentTheme() === this.THEMES.DARK,
            onThemeChange: (callback) => {
                document.addEventListener('themechange', callback);
            }
        };
    }
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeToggle = new ThemeToggle();
    });
} else {
    window.themeToggle = new ThemeToggle();
}

// Exportar para módulos ES6 si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeToggle;
}