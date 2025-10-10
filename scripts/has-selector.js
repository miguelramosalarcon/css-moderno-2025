/**
 * HAS SELECTOR DEMO - JavaScript
 * Funcionalidad específica para el demo del selector :has()
 * Miguel Ramos Alarcon - CSS Moderno 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.querySelector('.smart-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsInput = document.getElementById('terms');
    const newsletterInput = document.getElementById('newsletter');
    
    // Botones y controles
    const validateBtn = document.getElementById('validateBtn');
    const submitBtn = document.getElementById('submitBtn');
    const passwordToggle = document.querySelector('.password-toggle');
    const formStatus = document.getElementById('formStatus');
    
    // Elementos de feedback
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    // Estados del formulario
    let hasErrors = false;
    let allFieldsValid = false;

    /**
     * INICIALIZACIÓN
     */
    function init() {
        setupPasswordToggle();
        setupRealTimeValidation();
        setupFormValidation();
        setupPasswordStrength();
        setupAccessibility();
        
        // Mensaje inicial
        updateFormStatus('Completa el formulario para continuar', 'info');
        
        console.log('🎯 Demo :has() inicializado correctamente');
    }

    /**
     * TOGGLE DE CONTRASEÑA
     */
    function setupPasswordToggle() {
        if (!passwordToggle) return;
        
        passwordToggle.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            const newType = isPassword ? 'text' : 'password';
            const newLabel = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
            
            passwordInput.type = newType;
            passwordToggle.setAttribute('aria-label', newLabel);
            
            // Cambiar iconos
            const hideIcon = passwordToggle.querySelector('.password-icon--hide');
            const showIcon = passwordToggle.querySelector('.password-icon--show');
            
            if (isPassword) {
                hideIcon.style.opacity = '0';
                showIcon.style.opacity = '1';
            } else {
                hideIcon.style.opacity = '1';
                showIcon.style.opacity = '0';
            }
            
            // Feedback de accesibilidad
            announceToScreenReader(isPassword ? 'Contraseña visible' : 'Contraseña oculta');
        });
    }

    /**
     * VALIDACIÓN EN TIEMPO REAL
     */
    function setupRealTimeValidation() {
        // Validar mientras el usuario escribe
        [nameInput, emailInput, passwordInput].forEach(input => {
            if (!input) return;
            
            input.addEventListener('input', function() {
                clearError(this);
                validateField(this, false); // No mostrar errores mientras escribe
                updateFormState();
            });
            
            input.addEventListener('blur', function() {
                validateField(this, true); // Mostrar errores al salir del campo
                updateFormState();
            });
            
            input.addEventListener('focus', function() {
                updateFormStatus('Escribiendo en: ' + this.labels[0].textContent, 'info');
            });
        });
        
        // Checkboxes
        [termsInput, newsletterInput].forEach(checkbox => {
            if (!checkbox) return;
            
            checkbox.addEventListener('change', function() {
                clearError(this);
                updateFormState();
                
                if (this === termsInput) {
                    updateFormStatus(
                        this.checked ? 'Términos aceptados ✓' : 'Debes aceptar los términos',
                        this.checked ? 'success' : 'warning'
                    );
                }
            });
        });
    }

    /**
     * VALIDACIÓN DE CAMPOS INDIVIDUAL
     */
    function validateField(field, showErrors = true) {
        if (!field) return false;
        
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas
        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El nombre es obligatorio';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El nombre solo puede contener letras y espacios';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'El email es obligatorio';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;
                
            case 'password':
                if (!value) {
                    isValid = false;
                    errorMessage = 'La contraseña es obligatoria';
                } else if (value.length < 6) {
                    isValid = false;
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    isValid = false;
                    errorMessage = 'Debe contener mayúscula, minúscula y número';
                }
                break;
        }
        
        // Aplicar resultado
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            if (showErrors) {
                field.classList.add('error');
                showError(field, errorMessage);
            }
        }
        
        return isValid;
    }

    /**
     * MOSTRAR/OCULTAR ERRORES
     */
    function showError(field, message) {
        const errorElement = document.getElementById(field.name + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-live', 'assertive');
            
            // Animación de entrada
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                errorElement.style.opacity = '1';
                errorElement.style.transform = 'translateY(0)';
            }, 50);
        }
        
        announceToScreenReader('Error: ' + message);
    }
    
    function clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.removeAttribute('aria-live');
        }
    }

    /**
     * MEDIDOR DE FUERZA DE CONTRASEÑA
     */
    function setupPasswordStrength() {
        if (!passwordInput || !strengthBar || !strengthText) return;
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            updatePasswordStrength(strength);
        });
    }
    
    function calculatePasswordStrength(password) {
        if (!password) return { score: 0, text: 'Ingresa tu contraseña', color: 'var(--text-muted)' };
        
        let score = 0;
        let feedback = [];
        
        // Longitud
        if (password.length >= 6) score += 1;
        else feedback.push('mín. 6 caracteres');
        
        if (password.length >= 10) score += 1;
        
        // Complejidad
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('minúscula');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('mayúscula');
        
        if (/\d/.test(password)) score += 1;
        else feedback.push('número');
        
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        
        // Resultado
        const strength = {
            0: { text: 'Muy débil', color: 'var(--error)' },
            1: { text: 'Débil', color: 'var(--error)' },
            2: { text: 'Débil', color: 'var(--warning)' },
            3: { text: 'Regular', color: 'var(--warning)' },
            4: { text: 'Buena', color: 'var(--success)' },
            5: { text: 'Fuerte', color: 'var(--success)' },
            6: { text: 'Muy fuerte', color: 'var(--primary-color)' }
        };
        
        return {
            score: Math.min(score, 6),
            ...strength[Math.min(score, 6)],
            feedback: feedback.length > 0 ? 'Falta: ' + feedback.join(', ') : ''
        };
    }
    
    function updatePasswordStrength(strength) {
        const percentage = (strength.score / 6) * 100;
        
        strengthBar.style.width = percentage + '%';
        strengthBar.style.background = strength.color;
        strengthText.textContent = strength.text + (strength.feedback ? ' (' + strength.feedback + ')' : '');
        strengthText.style.color = strength.color;
        
        // Animación del bar
        strengthBar.style.transition = 'all 0.3s ease';
    }

    /**
     * VALIDACIÓN COMPLETA DEL FORMULARIO
     */
    function setupFormValidation() {
        validateBtn.addEventListener('click', function() {
            validateCompleteForm();
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateCompleteForm()) {
                simulateFormSubmission();
            }
        });
    }
    
    function validateCompleteForm() {
        let isFormValid = true;
        
        // Validar campos de texto
        [nameInput, emailInput, passwordInput].forEach(field => {
            if (!validateField(field, true)) {
                isFormValid = false;
            }
        });
        
        // Validar términos
        if (!termsInput.checked) {
            isFormValid = false;
            showError(termsInput, 'Debes aceptar los términos y condiciones');
            termsInput.classList.add('error');
        } else {
            clearError(termsInput);
            termsInput.classList.remove('error');
        }
        
        // Actualizar estado
        updateFormState();
        
        if (isFormValid) {
            updateFormStatus('¡Formulario válido! ✅ Listo para enviar', 'success');
            announceToScreenReader('Formulario validado correctamente');
        } else {
            updateFormStatus('❌ Hay errores en el formulario. Revísalos antes de continuar', 'error');
            announceToScreenReader('Se encontraron errores en el formulario');
            
            // Scroll al primer error
            const firstError = form.querySelector('.form-input.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isFormValid;
    }

    /**
     * ACTUALIZAR ESTADO GENERAL DEL FORMULARIO
     */
    function updateFormState() {
        // Verificar si hay errores
        hasErrors = form.querySelectorAll('.error').length > 0;
        
        // Verificar si todos los campos requeridos son válidos
        const nameValid = nameInput.classList.contains('valid');
        const emailValid = emailInput.classList.contains('valid');
        const passwordValid = passwordInput.classList.contains('valid');
        const termsValid = termsInput.checked;
        
        allFieldsValid = nameValid && emailValid && passwordValid && termsValid;
        
        // Aplicar clases CSS para :has()
        form.classList.toggle('has-errors', hasErrors);
        form.classList.toggle('all-valid', allFieldsValid && !hasErrors);
        form.classList.toggle('has-focus', document.activeElement && form.contains(document.activeElement));
        
        // Actualizar botón submit
        submitBtn.disabled = !allFieldsValid || hasErrors;
        submitBtn.style.opacity = (!allFieldsValid || hasErrors) ? '0.5' : '1';
        submitBtn.style.cursor = (!allFieldsValid || hasErrors) ? 'not-allowed' : 'pointer';
    }

    /**
     * SIMULACIÓN DE ENVÍO
     */
    function simulateFormSubmission() {
        updateFormStatus('📤 Enviando formulario...', 'loading');
        
        // Deshabilitar formulario
        const formElements = form.querySelectorAll('input, button');
        formElements.forEach(el => el.disabled = true);
        
        // Simular carga
        setTimeout(() => {
            updateFormStatus('🎉 ¡Cuenta creada exitosamente!', 'success');
            announceToScreenReader('Formulario enviado correctamente. Cuenta creada exitosamente');
            
            // Re-habilitar después de un momento
            setTimeout(() => {
                formElements.forEach(el => el.disabled = false);
                updateFormStatus('Formulario restablecido. Puedes probar de nuevo', 'info');
            }, 3000);
        }, 2000);
    }

    /**
     * ACTUALIZAR STATUS DEL FORMULARIO
     */
    function updateFormStatus(message, type) {
        if (!formStatus) return;
        
        const statusText = formStatus.querySelector('.status-text');
        if (!statusText) return;
        
        statusText.textContent = message;
        
        // Remover clases anteriores
        formStatus.className = 'form-status';
        
        // Aplicar nueva clase
        if (type) {
            formStatus.classList.add('form-status--' + type);
        }
        
        // Animación
        formStatus.style.transform = 'scale(0.95)';
        setTimeout(() => {
            formStatus.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * ACCESIBILIDAD Y SCREEN READERS
     */
    function setupAccessibility() {
        // Navegación por teclado mejorada
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.type !== 'submit') {
                e.preventDefault();
                
                // Buscar siguiente campo
                const formElements = Array.from(form.querySelectorAll('input, button'));
                const currentIndex = formElements.indexOf(e.target);
                const nextElement = formElements[currentIndex + 1];
                
                if (nextElement) {
                    nextElement.focus();
                }
            }
        });
        
        // Anunciar cambios de estado
        document.addEventListener('focusin', function(e) {
            if (form.contains(e.target)) {
                updateFormState();
            }
        });
        
        document.addEventListener('focusout', function(e) {
            setTimeout(() => {
                if (!form.contains(document.activeElement)) {
                    updateFormState();
                }
            }, 100);
        });
    }
    
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
     * ANIMACIONES DE ENTRADA
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

        // Observar elementos para animación
        document.querySelectorAll('.code-block, .use-case-card, .demo-instructions').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * COPIAR CÓDIGO AL CLIPBOARD
     */
    function setupCodeCopy() {
        document.querySelectorAll('.code-content').forEach(codeBlock => {
            codeBlock.addEventListener('click', function() {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(this.textContent);
                    
                    // Feedback visual
                    const original = this.style.backgroundColor;
                    this.style.backgroundColor = 'var(--secondary-color)';
                    this.style.transition = 'background-color 0.3s ease';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = original;
                    }, 300);
                    
                    announceToScreenReader('Código copiado al portapapeles');
                }
            });
        });
    }

    /**
     * DEBUG HELPERS
     */
    function logFormState() {
        console.log('🔍 Estado del formulario:', {
            hasErrors,
            allFieldsValid,
            nameValid: nameInput.classList.contains('valid'),
            emailValid: emailInput.classList.contains('valid'),
            passwordValid: passwordInput.classList.contains('valid'),
            termsAccepted: termsInput.checked,
            activeElement: document.activeElement?.name || 'none'
        });
    }

    // Exponer funciones para debugging
    window.hasDemo = {
        validateForm: validateCompleteForm,
        logState: logFormState,
        updateState: updateFormState,
        announceToScreenReader
    };

    /**
     * INICIALIZAR TODO
     */
    init();
    setupAnimations();
    setupCodeCopy();
    
    // Log inicial
    console.log('🎯 Demo del selector :has() listo!');
    console.log('💡 Usa window.hasDemo para debugging');
});