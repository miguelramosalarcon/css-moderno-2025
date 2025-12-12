/**
 * BACK TO TOP BUTTON
 * Botón moderno y accesible para volver arriba
 * Optimizado para Core Web Vitals
 * 
 * @author Miguel Ramos Alarcon
 * @version 1.0.0
 */

class BackToTop {
  constructor(options = {}) {
    // Configuración con defaults
    this.config = {
      selector: '#backToTop',
      showAfter: 300,           // Mostrar después de 300px de scroll
      smoothScroll: true,       // Scroll suave
      showProgress: true,       // Mostrar progreso de scroll
      pulseAfter: 10000,        // Pulsar después de 10s visible (0 = desactivado)
      ...options
    };
    
    // Referencias DOM
    this.button = document.querySelector(this.config.selector);
    this.progressBar = this.button?.querySelector('.back-to-top__progress-bar');
    
    // Estado
    this.isVisible = false;
    this.pulseTimeout = null;
    this.ticking = false;
    
    // Constantes
    this.CIRCUMFERENCE = 289; // 2 * PI * 46
    
    // Inicializar
    this.init();
  }
  
  /**
   * Inicializa el componente
   */
  init() {
    if (!this.button) {
      console.warn('BackToTop: No se encontró el elemento', this.config.selector);
      return;
    }
    
    this.bindEvents();
    this.checkScroll(); // Check inicial
    
    console.log('✅ BackToTop inicializado');
  }
  
  /**
   * Vincula los event listeners
   */
  bindEvents() {
    // Scroll con requestAnimationFrame para performance
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    
    // Click en el botón
    this.button.addEventListener('click', (e) => this.onClick(e));
    
    // Keyboard support
    this.button.addEventListener('keydown', (e) => this.onKeydown(e));
  }
  
  /**
   * Handler de scroll optimizado
   */
  onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.checkScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  /**
   * Verifica la posición del scroll y actualiza el estado
   */
  checkScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Mostrar/ocultar botón
    if (scrollTop > this.config.showAfter) {
      this.show();
    } else {
      this.hide();
    }
    
    // Actualizar progreso
    if (this.config.showProgress && this.progressBar) {
      this.updateProgress(scrollTop, scrollHeight);
    }
  }
  
  /**
   * Muestra el botón
   */
  show() {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.button.classList.add('is-visible');
    this.button.removeAttribute('hidden');
    
    // Iniciar timer para pulse (llamar atención)
    if (this.config.pulseAfter > 0) {
      this.startPulseTimer();
    }
  }
  
  /**
   * Oculta el botón
   */
  hide() {
    if (!this.isVisible) return;
    
    this.isVisible = false;
    this.button.classList.remove('is-visible', 'is-pulsing');
    
    // Limpiar timer
    this.clearPulseTimer();
    
    // Añadir hidden después de la transición
    setTimeout(() => {
      if (!this.isVisible) {
        this.button.setAttribute('hidden', '');
      }
    }, 300);
  }
  
  /**
   * Actualiza el indicador de progreso
   */
  updateProgress(scrollTop, scrollHeight) {
    if (scrollHeight <= 0) return;
    
    const progress = scrollTop / scrollHeight;
    const offset = this.CIRCUMFERENCE - (progress * this.CIRCUMFERENCE);
    
    this.progressBar.style.strokeDashoffset = offset;
  }
  
  /**
   * Handler del click
   */
  onClick(e) {
    e.preventDefault();
    this.scrollToTop();
  }
  
  /**
   * Handler de teclado
   */
  onKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.scrollToTop();
    }
  }
  
  /**
   * Scroll hacia arriba
   */
  scrollToTop() {
    // Quitar pulse si estaba activo
    this.button.classList.remove('is-pulsing');
    this.clearPulseTimer();
    
    if (this.config.smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Feedback visual
    this.button.blur();
    
    // Anunciar para screen readers
    this.announceAction();
  }
  
  /**
   * Anuncia la acción para lectores de pantalla
   */
  announceAction() {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Volviendo al inicio de la página';
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
  
  /**
   * Inicia el timer para el efecto pulse
   */
  startPulseTimer() {
    this.clearPulseTimer();
    
    this.pulseTimeout = setTimeout(() => {
      if (this.isVisible) {
        this.button.classList.add('is-pulsing');
      }
    }, this.config.pulseAfter);
  }
  
  /**
   * Limpia el timer del pulse
   */
  clearPulseTimer() {
    if (this.pulseTimeout) {
      clearTimeout(this.pulseTimeout);
      this.pulseTimeout = null;
    }
  }
  
  /**
   * API pública
   */
  getApi() {
    return {
      show: () => this.show(),
      hide: () => this.hide(),
      scrollToTop: () => this.scrollToTop(),
      isVisible: () => this.isVisible,
      destroy: () => this.destroy()
    };
  }
  
  /**
   * Destruye el componente
   */
  destroy() {
    this.clearPulseTimer();
    this.button?.classList.remove('is-visible', 'is-pulsing');
    window.removeEventListener('scroll', this.onScroll);
    console.log('🗑️ BackToTop destruido');
  }
}

// ==========================================================================
// AUTO-INICIALIZACIÓN
// ==========================================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.backToTop = new BackToTop();
  });
} else {
  window.backToTop = new BackToTop();
}

// Export para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackToTop;
}