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

document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    new ScrollAnimator();
    new ContactForm();
    new SmoothScroll();

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