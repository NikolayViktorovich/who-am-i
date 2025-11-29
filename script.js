class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.icon = this.themeToggle.querySelector('i');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
            this.icon.className = 'fas fa-sun text-yellow-500';
        } else {
            document.documentElement.classList.remove('dark');
            this.icon.className = 'fas fa-moon text-gray-600';
        }

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        if (isDark) {
            this.icon.className = 'fas fa-sun text-yellow-500';
        } else {
            this.icon.className = 'fas fa-moon text-gray-600';
        }
        this.themeToggle.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 200);
    }
}

class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-animate');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.elements.forEach(el => observer.observe(el));
    }
}

class LightEffects {
    constructor() {
        this.init();
    }

    init() {
        const lightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('light-hit');
                    setTimeout(() => {
                        entry.target.classList.remove('light-hit');
                    }, 2000);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.tech-card, .project-card, .edu-card, .main-title-glow').forEach(el => {
            lightObserver.observe(el);
        });

        this.randomLightFlashes();
    }

    randomLightFlashes() {
        setInterval(() => {
            const elements = document.querySelectorAll('.tech-card, .project-card, .edu-card');
            if (elements.length > 0) {
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                randomElement.classList.add('light-hit');
                setTimeout(() => {
                    randomElement.classList.remove('light-hit');
                }, 2000);
            }
        }, 8000);
    }
}

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Отправка...';
        submitBtn.disabled = true;
        
        try {
            await this.sendFormData(formData);
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError();
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendFormData(formData) {
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Ошибка отправки');
        return response.json();
    }

    showSuccess() {
        this.showNotification('Сообщение отправлено успешно!', 'success');
    }

    showError() {
        this.showNotification('Ошибка отправки. Попробуйте еще раз.', 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

class PdfExporter {
    constructor() {
        this.downloadBtn = document.getElementById('downloadPdf');
        this.init();
    }

    init() {
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.generatePdf());
        }
    }

    async generatePdf() {
        this.showNotification('Подготовка PDF...', 'info');
        
        // Сохраняем текущую тему
        const isDark = document.documentElement.classList.contains('dark');
        const originalTheme = localStorage.getItem('theme');
        
        // Принудительно переключаем на светлую тему для PDF
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        
        // Ждем перерисовки
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const element = document.getElementById('resume-content');
            
            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'Николай-Викторович-Frontend-Developer.pdf',
                image: { 
                    type: 'jpeg', 
                    quality: 0.98 
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'] 
                }
            };

            // Создаем клон элемента для PDF
            const clone = element.cloneNode(true);
            clone.style.width = '210mm';
            clone.style.padding = '0';
            clone.style.margin = '0';
            document.body.appendChild(clone);
            
            await html2pdf().set(opt).from(clone).save();
            
            document.body.removeChild(clone);
            
            this.showNotification('PDF успешно создан!', 'success');
            
        } catch (error) {
            console.error('Ошибка при создании PDF:', error);
            this.showNotification('Ошибка при создании PDF', 'error');
            this.fallbackPdf();
        } finally {
            // Восстанавливаем исходную тему
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', originalTheme);
            }
        }
    }

    fallbackPdf() {
        this.showNotification('Используем альтернативный метод...', 'info');
        
        // Простой метод через печать
        const element = document.getElementById('resume-content');
        const originalDisplay = element.style.display;
        
        element.style.display = 'block';
        element.style.width = '210mm';
        element.style.margin = '0 auto';
        
        window.print();
        
        // Восстанавливаем стили
        setTimeout(() => {
            element.style.display = originalDisplay;
            element.style.width = '';
            element.style.margin = '';
        }, 1000);
    }

    showNotification(message, type) {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.pdf-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `pdf-notification fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    new ScrollAnimator();
    new LightEffects();
    new ContactForm();
    new SmoothScroll();
    new PdfExporter();

    // Анимации карточек
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.querySelectorAll('.edu-card, .tech-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });

    console.log('🎯 Портфолио загружено!');
});

// Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        const swCode = `
            self.addEventListener('install', function(event) {
                event.waitUntil(self.skipWaiting());
            });
            self.addEventListener('activate', function(event) {
                event.waitUntil(self.clients.claim());
            });
        `;
        const blob = new Blob([swCode], {type: 'application/javascript'});
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl);
    });
}