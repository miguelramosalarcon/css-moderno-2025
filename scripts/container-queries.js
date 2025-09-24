 // Código específico para container queries demo
        document.addEventListener('DOMContentLoaded', function() {
            // Control de animación
            const animationToggle = document.getElementById('animationToggle');
            const animationStatus = document.getElementById('animationStatus');
            const containerWrapper = document.querySelector('.container-wrapper');
            const animationText = document.querySelector('.animation-text');
            
            let isAnimating = true;
            
            // Iniciar con animación activa
            containerWrapper.classList.add('animated');
            
            animationToggle.addEventListener('click', function() {
                isAnimating = !isAnimating;
                
                if (isAnimating) {
                    // Reanudar animación
                    containerWrapper.classList.add('animated');
                    containerWrapper.classList.remove('paused');
                    animationToggle.classList.add('active');
                    animationToggle.setAttribute('aria-pressed', 'true');
                    animationText.textContent = 'Pausar Animación';
                    animationStatus.textContent = '▶️ Ejecutándose';
                    
                } else {
                    // Pausar animación
                    containerWrapper.classList.remove('animated');
                    containerWrapper.classList.add('paused');
                    animationToggle.classList.remove('active');
                    animationToggle.setAttribute('aria-pressed', 'false');
                    animationText.textContent = 'Reanudar Animación';
                    animationStatus.textContent = '⏸️ Pausado';
                }
                
                // Anuncio para accesibilidad
                if (window.Utils && window.Utils.A11y) {
                    const message = isAnimating ? 'Animación reanudada' : 'Animación pausada';
                    window.Utils.A11y.announce(message);
                }
            });

            // Animación de entrada para elementos
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = '0.2s';
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observar elementos para animación
            document.querySelectorAll('.code-block, .advantage-card').forEach(el => {
                observer.observe(el);
            });

            // Copiar código al clipboard
            document.querySelectorAll('.code-content').forEach(codeBlock => {
                codeBlock.addEventListener('click', () => {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(codeBlock.textContent);
                        
                        // Feedback visual
                        const originalBg = codeBlock.style.backgroundColor;
                        codeBlock.style.backgroundColor = 'var(--secondary-color)';
                        codeBlock.style.transition = 'background-color 0.3s ease';
                        
                        setTimeout(() => {
                            codeBlock.style.backgroundColor = originalBg;
                        }, 300);
                        
                        // Anuncio para accesibilidad
                        if (window.Utils && window.Utils.A11y) {
                            window.Utils.A11y.announce('Código copiado al portapapeles');
                        }
                    }
                });
            });
        });