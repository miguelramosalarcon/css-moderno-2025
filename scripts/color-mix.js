/* ==========================================================================
   COLOR-MIX DEMO - JavaScript
   Playground interactivo de color-mix()
   ========================================================================== */

// ==========================================================================
// ESTADO GLOBAL
// ==========================================================================

const state = {
  color1: '#2448A6',
  color2: '#F5B841',
  mixPercentage: 50,
  colorSpace: 'srgb'
};

// ==========================================================================
// PRESETS DE COLORES
// ==========================================================================

const presets = {
  brand: { color1: '#2448A6', color2: '#F5B841' },
  sunset: { color1: '#FF6B6B', color2: '#FFA500' },
  ocean: { color1: '#0077BE', color2: '#00CED1' },
  forest: { color1: '#228B22', color2: '#90EE90' }
};

// ==========================================================================
// ELEMENTOS DEL DOM
// ==========================================================================

const elements = {
  // Color inputs
  color1Input: document.getElementById('color1'),
  color1Hex: document.getElementById('color1-hex'),
  color1Value: document.getElementById('color1-value'),
  color2Input: document.getElementById('color2'),
  color2Hex: document.getElementById('color2-hex'),
  color2Value: document.getElementById('color2-value'),
  
  // Mix controls
  mixSlider: document.getElementById('mixPercentage'),
  mixValue: document.getElementById('mix-value'),
  colorSpaceSelect: document.getElementById('colorSpace'),
  colorSpaceInfo: document.getElementById('colorSpaceInfo'),
  
  // Preview elements
  colorCircle: document.getElementById('colorCircle'),
  resultHex: document.getElementById('resultHex'),
  resultRgb: document.getElementById('resultRgb'),
  resultHsl: document.getElementById('resultHsl'),
  
  // Comparison swatches
  color1Swatch: document.getElementById('color1Swatch'),
  mixedSwatch: document.getElementById('mixedSwatch'),
  color2Swatch: document.getElementById('color2Swatch'),
  
  // Example components
  exampleBtn: document.getElementById('exampleBtn'),
  exampleBtnHover: document.getElementById('exampleBtnHover'),
  exampleBtnActive: document.getElementById('exampleBtnActive'),
  exampleCard: document.getElementById('exampleCard'),
  exampleBadge1: document.getElementById('exampleBadge1'),
  exampleBadge2: document.getElementById('exampleBadge2'),
  exampleBadge3: document.getElementById('exampleBadge3'),
  
  // Generated code
  generatedCss: document.getElementById('generatedCss'),
  copyCssBtn: document.getElementById('copyCssBtn'),
  
  // Preset buttons
  presetButtons: document.querySelectorAll('.preset-btn'),
  
  // Example preset cards
  examplePresetCards: document.querySelectorAll('.example-preset-card')
};

// ==========================================================================
// FUNCIONES DE COLOR
// ==========================================================================

/**
 * Convierte hex a RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convierte RGB a hex
 */
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Convierte RGB a HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Genera el CSS de color-mix()
 */
function generateColorMixCss() {
  const { color1, color2, mixPercentage, colorSpace } = state;
  const color2Percentage = 100 - mixPercentage;
  
  return `background: color-mix(in ${colorSpace}, ${color1} ${mixPercentage}%, ${color2} ${color2Percentage}%);`;
}

/**
 * Calcula el color mezclado (aproximación para visualización)
 */
function calculateMixedColor() {
  const rgb1 = hexToRgb(state.color1);
  const rgb2 = hexToRgb(state.color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const ratio = state.mixPercentage / 100;
  
  const r = rgb1.r * ratio + rgb2.r * (1 - ratio);
  const g = rgb1.g * ratio + rgb2.g * (1 - ratio);
  const b = rgb1.b * ratio + rgb2.b * (1 - ratio);
  
  return { r, g, b };
}

/**
 * Obtiene el color mezclado usando CSS (más preciso)
 */
function getMixedColorFromCSS() {
  const { color1, color2, mixPercentage, colorSpace } = state;
  const color2Percentage = 100 - mixPercentage;
  
  // Crear un elemento temporal para obtener el color computado
  const temp = document.createElement('div');
  temp.style.background = `color-mix(in ${colorSpace}, ${color1} ${mixPercentage}%, ${color2} ${color2Percentage}%)`;
  document.body.appendChild(temp);
  
  const computedColor = getComputedStyle(temp).backgroundColor;
  document.body.removeChild(temp);
  
  // Extraer RGB del formato "rgb(r, g, b)"
  const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  
  // Fallback al cálculo manual
  return calculateMixedColor();
}

// ==========================================================================
// ACTUALIZACIÓN DE UI
// ==========================================================================

/**
 * Actualiza todos los elementos visuales
 */
function updateUI() {
  updateColorInputs();
  updateMixSlider();
  updateColorCircle();
  updateColorComparison();
  updateExampleComponents();
  updateGeneratedCode();
  updateColorSpaceInfo();
}

/**
 * Actualiza los inputs de color
 */
function updateColorInputs() {
  elements.color1Input.value = state.color1;
  elements.color1Hex.value = state.color1;
  elements.color1Value.textContent = state.color1;
  
  elements.color2Input.value = state.color2;
  elements.color2Hex.value = state.color2;
  elements.color2Value.textContent = state.color2;
}

/**
 * Actualiza el slider de mezcla
 */
function updateMixSlider() {
  elements.mixSlider.value = state.mixPercentage;
  elements.mixValue.textContent = `${state.mixPercentage}%`;
  
  // Actualizar gradiente del slider
  elements.mixSlider.style.background = `linear-gradient(to right, ${state.color1} 0%, ${state.color2} 100%)`;
}

/**
 * Actualiza el círculo de color principal
 */
function updateColorCircle() {
  const mixedColor = getMixedColorFromCSS();
  
  if (!mixedColor) return;
  
  const hex = rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
  const hsl = rgbToHsl(mixedColor.r, mixedColor.g, mixedColor.b);
  
  // Aplicar color al círculo usando color-mix CSS
  const { color1, color2, mixPercentage, colorSpace } = state;
  const color2Percentage = 100 - mixPercentage;
  elements.colorCircle.style.background = `color-mix(in ${colorSpace}, ${color1} ${mixPercentage}%, ${color2} ${color2Percentage}%)`;
  elements.colorCircle.style.color = `color-mix(in ${colorSpace}, ${color1} ${mixPercentage}%, ${color2} ${color2Percentage}%)`;
  
  // Actualizar información del color
  elements.resultHex.textContent = hex.toUpperCase();
  elements.resultRgb.textContent = `rgb(${Math.round(mixedColor.r)}, ${Math.round(mixedColor.g)}, ${Math.round(mixedColor.b)})`;
  elements.resultHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Actualiza los swatches de comparación
 */
function updateColorComparison() {
  elements.color1Swatch.style.background = state.color1;
  elements.color2Swatch.style.background = state.color2;
  
  const { color1, color2, mixPercentage, colorSpace } = state;
  const color2Percentage = 100 - mixPercentage;
  elements.mixedSwatch.style.background = `color-mix(in ${colorSpace}, ${color1} ${mixPercentage}%, ${color2} ${color2Percentage}%)`;
}

/**
 * Actualiza los componentes de ejemplo
 */
function updateExampleComponents() {
  const { color1, colorSpace } = state;
  
  // Botones
  elements.exampleBtn.style.background = color1;
  elements.exampleBtnHover.style.background = `color-mix(in ${colorSpace}, ${color1} 80%, white)`;
  elements.exampleBtnActive.style.background = `color-mix(in ${colorSpace}, ${color1} 70%, black)`;
  
  // Card
  elements.exampleCard.style.background = `color-mix(in ${colorSpace}, ${color1} 5%, var(--surface))`;
  elements.exampleCard.style.borderColor = `color-mix(in ${colorSpace}, ${color1} 20%, transparent)`;
  
  // Badges
  elements.exampleBadge1.style.background = color1;
  elements.exampleBadge2.style.background = `color-mix(in ${colorSpace}, ${color1} 30%, white)`;
  elements.exampleBadge2.style.color = color1;
  elements.exampleBadge3.style.background = `color-mix(in ${colorSpace}, ${color1} 10%, white)`;
  elements.exampleBadge3.style.color = color1;
  elements.exampleBadge3.style.borderColor = `color-mix(in ${colorSpace}, ${color1} 30%, transparent)`;
}

/**
 * Actualiza el código CSS generado
 */
function updateGeneratedCode() {
  const css = generateColorMixCss();
  elements.generatedCss.querySelector('code').textContent = css;
}

/**
 * Actualiza la información del espacio de color
 */
function updateColorSpaceInfo() {
  const info = {
    srgb: 'Espacio de color estándar para la web',
    oklch: 'Perceptualmente uniforme - colores más naturales',
    hsl: 'Mezcla por matiz y saturación'
  };
  
  elements.colorSpaceInfo.textContent = info[state.colorSpace];
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

/**
 * Inicializa todos los event listeners
 */
function initEventListeners() {
  // Color picker 1
  elements.color1Input.addEventListener('input', (e) => {
    state.color1 = e.target.value;
    updateUI();
  });
  
  elements.color1Hex.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      state.color1 = value;
      updateUI();
    }
  });
  
  // Color picker 2
  elements.color2Input.addEventListener('input', (e) => {
    state.color2 = e.target.value;
    updateUI();
  });
  
  elements.color2Hex.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      state.color2 = value;
      updateUI();
    }
  });
  
  // Mix slider
  elements.mixSlider.addEventListener('input', (e) => {
    state.mixPercentage = parseInt(e.target.value);
    updateUI();
  });
  
  // Color space selector
  elements.colorSpaceSelect.addEventListener('change', (e) => {
    state.colorSpace = e.target.value;
    updateUI();
  });
  
  // Copy CSS button
  elements.copyCssBtn.addEventListener('click', () => {
    const css = generateColorMixCss();
    navigator.clipboard.writeText(css).then(() => {
      // Feedback visual
      const originalHTML = elements.copyCssBtn.innerHTML;
      elements.copyCssBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      elements.copyCssBtn.style.background = '#10b981';
      
      setTimeout(() => {
        elements.copyCssBtn.innerHTML = originalHTML;
        elements.copyCssBtn.style.background = '';
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar el código');
    });
  });
  
  // Click en código generado para copiar
  elements.generatedCss.addEventListener('click', () => {
    elements.copyCssBtn.click();
  });
  
  // Preset buttons
  elements.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      
      if (preset === 'random') {
        state.color1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        state.color2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      } else if (presets[preset]) {
        state.color1 = presets[preset].color1;
        state.color2 = presets[preset].color2;
      }
      
      updateUI();
      
      // Feedback visual
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
  
  // Example preset cards
  elements.examplePresetCards.forEach(card => {
    card.addEventListener('click', () => {
      const example = card.dataset.example;
      loadExample(example);
      
      // Scroll al playground
      document.querySelector('.playground-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Feedback visual
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
}

// ==========================================================================
// EJEMPLOS PREDEFINIDOS
// ==========================================================================

/**
 * Carga ejemplos predefinidos
 */
function loadExample(example) {
  const examples = {
    pastel: {
      color1: '#6B8CFF',
      color2: '#FFFFFF',
      mixPercentage: 30,
      colorSpace: 'srgb'
    },
    deep: {
      color1: '#1A5490',
      color2: '#000000',
      mixPercentage: 70,
      colorSpace: 'srgb'
    },
    glass: {
      color1: '#6B8CFF',
      color2: '#FFFFFF',
      mixPercentage: 40,
      colorSpace: 'srgb'
    },
    gradient: {
      color1: '#2448A6',
      color2: '#F5B841',
      mixPercentage: 50,
      colorSpace: 'oklch'
    },
    complementary: {
      color1: '#6B8CFF',
      color2: '#FF8C6B',
      mixPercentage: 50,
      colorSpace: 'oklch'
    },
    monochromatic: {
      color1: '#2448A6',
      color2: '#FFFFFF',
      mixPercentage: 60,
      colorSpace: 'hsl'
    }
  };
  
  if (examples[example]) {
    Object.assign(state, examples[example]);
    updateUI();
  }
}

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================

/**
 * Inicializa la aplicación
 */
function init() {
  console.log('🎨 Color-mix() Demo iniciado');
  
  // Verificar soporte de color-mix()
  if (!CSS.supports('background', 'color-mix(in srgb, red, blue)')) {
    console.warn('⚠️ Tu navegador no soporta color-mix() completamente');
    showBrowserWarning();
  }
  
  // Inicializar UI
  updateUI();
  
  // Inicializar event listeners
  initEventListeners();
  
  // Animación de entrada
  animateOnScroll();
  
  console.log('✅ Demo listo');
}

/**
 * Muestra advertencia de navegador
 */
function showBrowserWarning() {
  const warning = document.createElement('div');
  warning.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #fbbf24;
    color: #78350f;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-weight: 600;
    max-width: 90%;
    text-align: center;
  `;
  warning.innerHTML = '⚠️ Tu navegador tiene soporte limitado de color-mix(). Actualiza para mejor experiencia.';
  document.body.appendChild(warning);
  
  setTimeout(() => {
    warning.style.transition = 'opacity 0.5s';
    warning.style.opacity = '0';
    setTimeout(() => warning.remove(), 500);
  }, 5000);
}

/**
 * Animaciones al hacer scroll
 */
function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.space-card, .example-preset-card, .use-case-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
}

// ==========================================================================
// EJECUTAR AL CARGAR
// ==========================================================================

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Exportar para uso en consola (debugging)
window.colorMixDemo = {
  state,
  updateUI,
  loadExample,
  presets
};