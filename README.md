<div align="center">
  
# 🎨 CSS Moderno 2025

### Showcase Interactivo de las Características más Avanzadas de CSS

[![Demo](https://img.shields.io/badge/Demo-Live-2448A6?style=for-the-badge&logo=github-pages&logoColor=white)](https://miguelramosalarcon.github.io/css-moderno-2025/index.html)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/miguelramosalarcon/css-moderno-2025)
[![CSS](https://img.shields.io/badge/CSS-Moderno-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-F5B841?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="assets/preview.png" alt="CSS Moderno 2025 Preview" width="800">
</p>

**Explora el futuro del CSS a través de demos interactivos, código comentado y ejemplos prácticos.**

[Ver Demo en Vivo](https://miguelramosalarcon.github.io/css-moderno-2025/index.html) · [Reportar Bug](https://github.com/miguelramosalarcon/css-moderno-2025/issues) · [Sugerir Feature](https://github.com/miguelramosalarcon/css-moderno-2025/issues)

</div>

---

## ✨ Características

- 🎯 **6 Demos Interactivos** — Cada característica CSS con ejemplos prácticos
- 🌓 **Modo Oscuro/Claro** — Tema adaptable con detección automática del sistema
- ♿ **100% Accesible** — ARIA labels, contraste WCAG AA, navegación por teclado
- ⚡ **Core Web Vitals Optimizado** — Performance, accesibilidad y SEO
- 📱 **Totalmente Responsive** — Diseño adaptable a cualquier dispositivo
- 🎨 **Sin Dependencias** — CSS y JavaScript puros, sin frameworks

---

## 🚀 Demos Incluidos

### 1. 📦 Container Queries
> **Diseño responsive basado en el contenedor padre, no en el viewport.**

La revolución del responsive design. Los componentes se adaptan según el espacio disponible de su contenedor, no del tamaño de la ventana.
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

**Características:** `@container`, `container-type`, unidades `cqw/cqh`

---

### 2. 🎯 Selector :has()
> **El "if" de CSS. Lógica condicional pura sin JavaScript.**

Formularios inteligentes que cambian según su contenido. Selecciona elementos padre basándose en sus hijos.
```css
/* Estiliza el form si tiene un input inválido */
form:has(input:invalid) {
  border-color: var(--error);
}

/* Card con imagen vs sin imagen */
.card:has(img) { grid-template-rows: auto 1fr; }
```

**Características:** `:has()`, `:valid`, `:focus-within`, selectores relacionales

---

### 3. 🔍 @supports Query
> **CSS condicional que se adapta según las características soportadas.**

Fallbacks elegantes automáticos. Detecta soporte de características y aplica estilos alternativos.
```css
/* Fallback para navegadores sin soporte */
.element { background: rgba(255,255,255,0.8); }

@supports (backdrop-filter: blur(10px)) {
  .element {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
  }
}
```

**Características:** `@supports`, feature queries, progressive enhancement

---

### 4. 🎨 color-mix()
> **Mezcla colores directamente en CSS. Paletas dinámicas sin preprocesadores.**

Crea variaciones de color, tints, shades y efectos en tiempo real usando diferentes espacios de color.
```css
/* Crear variaciones de color */
--primary-light: color-mix(in srgb, var(--primary) 70%, white);
--primary-dark: color-mix(in srgb, var(--primary) 70%, black);

/* Transparencias dinámicas */
background: color-mix(in srgb, var(--primary) 20%, transparent);
```

**Características:** `color-mix()`, espacios de color (`srgb`, `oklch`, `hsl`), paletas dinámicas

---

### 5. 📜 Scroll Timeline
> **Animaciones controladas por scroll sin JavaScript.**

Experiencias narrativas fluidas y declarativas. Las animaciones responden al progreso del scroll.
```css
.element {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Características:** `animation-timeline`, `view()`, `scroll()`, `animation-range`

---

### 6. 🪟 Backdrop Filter
> **Efectos de cristal y blur para interfaces modernas.**

Glassmorphism y overlays sofisticados. Aplica filtros visuales al fondo detrás de un elemento.
```css
.glass-card {
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

**Características:** `backdrop-filter`, `blur()`, `saturate()`, `brightness()`, glassmorphism

---

## 🛠️ Tecnologías

<div align="center">

| Tecnología | Uso |
|------------|-----|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Estructura semántica y accesible |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Estilos modernos, variables, animaciones |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Interactividad mínima (playgrounds) |

</div>

**Sin frameworks. Sin dependencias. Solo CSS moderno.**

---

## 📂 Estructura del Proyecto
```
css-moderno-2025/
├── index.html                    # Página principal
├── demos/
│   ├── container-queries.html    # Demo Container Queries
│   ├── has-selector.html         # Demo :has() Selector
│   ├── supports-query.html       # Demo @supports
│   ├── color-mix.html            # Demo color-mix()
│   ├── scroll-timeline.html      # Demo Scroll Timeline
│   └── backdrop-filter.html      # Demo Backdrop Filter
├── styles/
│   ├── main.css                  # Variables y estilos base
│   ├── index.css                 # Estilos página principal
│   ├── container-queries.css
│   ├── has-selector.css
│   ├── supports-query.css
│   ├── color-mix.css
│   ├── scroll-timeline.css
│   ├── backdrop-filter.css
│   └── back-to-top.css           # Botón volver arriba
├── scripts/
│   ├── theme-toggle.js           # Toggle modo oscuro/claro
│   ├── back-to-top.js            # Botón volver arriba
│   ├── color-mix.js              # Playground color-mix
│   └── backdrop-filter.js        # Playground backdrop-filter
└── assets/
    ├── Logo_MRStudio.webp        # Logo
    └── preview.png               # Preview para OG
```

---

## 🚀 Instalación

### Opción 1: Clonar repositorio
```bash
# Clonar el repositorio
git clone https://github.com/miguelramosalarcon/css-moderno-2025.git

# Entrar al directorio
cd css-moderno-2025

# Abrir en el navegador
# Simplemente abre index.html en tu navegador favorito
```

### Opción 2: Descargar ZIP

1. Haz clic en **Code** → **Download ZIP**
2. Descomprime el archivo
3. Abre `index.html` en tu navegador

### Opción 3: Servidor local (recomendado)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000`

---

## 🌐 Compatibilidad de Navegadores

| Característica | Chrome | Firefox | Safari | Edge |
|----------------|:------:|:-------:|:------:|:----:|
| Container Queries | 105+ | 110+ | 16+ | 105+ |
| :has() Selector | 105+ | 121+ | 15.4+ | 105+ |
| @supports | 28+ | 22+ | 9+ | 12+ |
| color-mix() | 111+ | 113+ | 16.2+ | 111+ |
| Scroll Timeline | 115+ | ❌ | ❌ | 115+ |
| Backdrop Filter | 76+ | 103+ | 9+ | 79+ |

> 💡 **Nota:** Todos los demos incluyen fallbacks para navegadores sin soporte completo.

---

## ♿ Accesibilidad

Este proyecto sigue las pautas **WCAG 2.1 AA**:

- ✅ Contraste de colores adecuado (mínimo 4.5:1)
- ✅ Navegación completa por teclado
- ✅ Etiquetas ARIA descriptivas
- ✅ Textos alternativos en imágenes
- ✅ Soporte para `prefers-reduced-motion`
- ✅ Soporte para `prefers-color-scheme`
- ✅ Focus visible en elementos interactivos

---

## ⚡ Performance

Optimizado para **Core Web Vitals**:

| Métrica | Objetivo | Técnicas usadas |
|---------|----------|-----------------|
| **LCP** | < 2.5s | Imágenes optimizadas, CSS crítico inline |
| **FID** | < 100ms | JavaScript mínimo, event delegation |
| **CLS** | < 0.1 | Dimensiones explícitas, `contain` property |

**Otras optimizaciones:**
- `will-change` controlado
- `contain: layout paint` para aislar repaints
- `requestAnimationFrame` para animaciones JS
- Lazy loading de imágenes
- Sin librerías externas

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| 🔵 **Primary** | `#2448A6` | Acciones principales, enlaces |
| 🟡 **Secondary** | `#F5B841` | Acentos, highlights |
| ⚪ **White** | `#FFFFFF` | Fondos claros |
| ⚫ **Dark** | `#0a0a0a` | Fondos oscuros |

---

## 📖 Recursos de Aprendizaje

### Documentación oficial
- [MDN - Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN - :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN - @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
- [MDN - color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [MDN - Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
- [MDN - backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

### Artículos recomendados
- [CSS Container Queries - Una nueva era del responsive](https://web.dev/cq-stable/)
- [The :has() selector is more than a parent selector](https://www.smashingmagazine.com/2023/01/level-up-css-skills-has-selector/)
- [Scroll-driven Animations](https://scroll-driven-animations.style/)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para contribuir
- 🐛 Reportar bugs
- 💡 Sugerir nuevas características CSS
- 📝 Mejorar documentación
- 🌍 Traducciones
- ♿ Mejoras de accesibilidad

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Ver `LICENSE` para más información.
```
MIT License

Copyright (c) 2025 Miguel Ramos Alarcon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Autor

<div align="center">
  
**Miguel Ramos Alarcon**

Full Stack Developer & Creative Designer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/miguelramosalarcon)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/miguelramosalarcon)

</div>

---

<div align="center">

### ⭐ Si este proyecto te fue útil, ¡dale una estrella!

**Transformando ideas en experiencias digitales excepcionales**

</div>
