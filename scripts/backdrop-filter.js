/**
 * BACKDROP FILTER PLAYGROUND
 * Controles interactivos para experimentar con backdrop-filter
 * Optimizado para Core Web Vitals
 * 
 * @author Miguel Ramos Alarcon
 * @version 1.0.0
 */

class BackdropFilterPlayground {
  constructor() {
    // Referencias DOM
    this.previewCard = document.getElementById('previewCard');
    this.generatedCode = document.getElementById('generatedCode');
    this.copyBtn = document.getElementById('copyCodeBtn');
    
    // Sliders
    this.sliders = {
      blur: document.getElementById('blurRange'),
      brightness: document.getElementById('brightnessRange'),
      saturate: document.getElementById('saturateRange'),
      contrast: document.getElementById('contrastRange'),
      opacity: document.getElementById('opacityRange')
    };
    
    // Value displays
    this.values = {
      blur: document.getElementById('blurValue'),
      brightness: document.getElementById('brightnessValue'),
      saturate: document.getElementById('saturateValue'),
      contrast: document.getElementById('contrastValue'),
      opacity: document.getElementById('opacityValue')
    };
    
    // Presets
    this.presets = {
      glass: { blur: 10, brightness: 100, saturate: 100, contrast: 100, opacity: 20 },
      frost: { blur: 20, brightness: 100, saturate: 100, contrast: 100, opacity: 30 },
      dark: { blur: 15, brightness: 80, saturate: 100, contrast: 100, opacity: 40 },
      vibrant: { blur: 8, brightness: 110, saturate: 180, contrast: 100, opacity: 15 },
      subtle: { blur: 5, brightness: 105, saturate: 120, contrast: 100, opacity: 10 },
      reset: { blur: 10, brightness: 100, saturate: 100, contrast: 100, opacity: 20 }
    };
    
    // Estado actual
    this.currentValues = { ...this.presets.glass };
    
    // Throttle para performance
    this.updateTimeout = null;
    
    // Inicializar
    this.init();
  }
  
  /**
   * Inicializa el playground
   */
  init() {
    if (!this.previewCard || !this.generatedCode) {
      console.warn('BackdropFilterPlayground: Elementos no encontrados');
      return;
    }
    
    this.bindEvents();
    this.updatePreview();
    
    console.log('✅ BackdropFilterPlayground inicializado');
  }
  
  /**
   * Vincula eventos
   */
  bindEvents() {
    // Eventos de sliders
    Object.keys(this.sliders).forEach(key => {
      const slider = this.sliders[key];
      if (slider) {
        slider.addEventListener('input', (e) => this.onSliderChange(key, e.target.value));
      }
    });
    
    // Eventos de presets
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.dataset.preset;
        this.applyPreset(preset);
      });
    });
    
    // Evento de copiar
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyCode());
    }
  }
  
  /**
   * Handler de cambio en slider
   */
  onSliderChange(key, value) {
    this.currentValues[key] = parseInt(value, 10);
    this.updateValueDisplay(key);
    this.throttledUpdate();
  }
  
  /**
   * Actualiza el display del valor
   */
  updateValueDisplay(key) {
    const valueEl = this.values[key];
    if (!valueEl) return;
    
    const value = this.currentValues[key];
    
    switch (key) {
      case 'blur':
        valueEl.textContent = `${value}px`;
        break;
      case 'opacity':
        valueEl.textContent = `${value}%`;
        break;
      default:
        valueEl.textContent = `${value}%`;
    }
  }
  
  /**
   * Throttle para actualización de preview
   */
  throttledUpdate() {
    if (this.updateTimeout) {
      cancelAnimationFrame(this.updateTimeout);
    }
    
    this.updateTimeout = requestAnimationFrame(() => {
      this.updatePreview();
    });
  }
  
  /**
   * Actualiza la vista previa
   */
  updatePreview() {
    const { blur, brightness, saturate, contrast, opacity } = this.currentValues;
    
    // Construir backdrop-filter
    const filters = [];
    
    if (blur !== 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    
    const backdropFilter = filters.length > 0 ? filters.join(' ') : 'none';
    const background = `rgba(255, 255, 255, ${opacity / 100})`;
    
    // Aplicar estilos
    this.previewCard.style.backdropFilter = backdropFilter;
    this.previewCard.style.webkitBackdropFilter = backdropFilter;
    this.previewCard.style.background = background;
    
    // Actualizar código generado
    this.updateGeneratedCode(backdropFilter, background);
  }
  
  /**
   * Actualiza el código CSS generado
   */
  updateGeneratedCode(backdropFilter, background) {
    const codeLines = [];
    
    if (backdropFilter !== 'none') {
      codeLines.push(`backdrop-filter: ${backdropFilter};`);
      codeLines.push(`-webkit-backdrop-filter: ${backdropFilter};`);
    }
    
    codeLines.push(`background: ${background};`);
    
    const codeEl = this.generatedCode.querySelector('code');
    if (codeEl) {
      codeEl.textContent = codeLines.join('\n');
    }
  }
  
  /**
   * Aplica un preset
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;
    
    // Actualizar valores
    this.currentValues = { ...preset };
    
    // Actualizar sliders
    Object.keys(this.sliders).forEach(key => {
      const slider = this.sliders[key];
      if (slider && preset[key] !== undefined) {
        slider.value = preset[key];
        this.updateValueDisplay(key);
      }
    });
    
    // Actualizar preview
    this.updatePreview();
    
    // Feedback visual en botón
    this.highlightPresetButton(presetName);
  }
  
  /**
   * Resalta el botón de preset activo
   */
  highlightPresetButton(presetName) {
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.style.transform = '';
      btn.style.borderColor = '';
    });
    
    const activeBtn = document.querySelector(`[data-preset="${presetName}"]`);
    if (activeBtn) {
      activeBtn.style.transform = 'scale(0.95)';
      activeBtn.style.borderColor = 'var(--primary-color)';
      
      setTimeout(() => {
        activeBtn.style.transform = '';
      }, 150);
    }
  }
  
  /**
   * Copia el código al portapapeles
   */
  async copyCode() {
    const codeEl = this.generatedCode.querySelector('code');
    if (!codeEl) return;
    
    const code = codeEl.textContent;
    
    try {
      await navigator.clipboard.writeText(code);
      this.showCopyFeedback(true);
    } catch (err) {
      // Fallback para navegadores antiguos
      this.fallbackCopy(code);
    }
  }
  
  /**
   * Fallback para copiar en navegadores antiguos
   */
  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback(true);
    } catch (err) {
      this.showCopyFeedback(false);
    }
    
    document.body.removeChild(textarea);
  }
  
  /**
   * Muestra feedback visual de copiado
   */
  showCopyFeedback(success) {
    if (!this.copyBtn) return;
    
    const originalHTML = this.copyBtn.innerHTML;
    
    this.copyBtn.innerHTML = success 
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    
    this.copyBtn.style.background = success ? 'var(--success)' : 'var(--error)';
    
    setTimeout(() => {
      this.copyBtn.innerHTML = originalHTML;
      this.copyBtn.style.background = '';
    }, 1500);
  }
  
  /**
   * Obtiene los valores actuales
   */
  getValues() {
    return { ...this.currentValues };
  }
  
  /**
   * Establece valores programáticamente
   */
  setValues(values) {
    Object.keys(values).forEach(key => {
      if (this.currentValues.hasOwnProperty(key)) {
        this.currentValues[key] = values[key];
        
        const slider = this.sliders[key];
        if (slider) {
          slider.value = values[key];
          this.updateValueDisplay(key);
        }
      }
    });
    
    this.updatePreview();
  }
  
  /**
   * Destruye la instancia
   */
  destroy() {
    if (this.updateTimeout) {
      cancelAnimationFrame(this.updateTimeout);
    }
    
    console.log('🗑️ BackdropFilterPlayground destruido');
  }
}

// ==========================================================================
// AUTO-INICIALIZACIÓN
// ==========================================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.backdropPlayground = new BackdropFilterPlayground();
  });
} else {
  window.backdropPlayground = new BackdropFilterPlayground();
}

// Export para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackdropFilterPlayground;
}