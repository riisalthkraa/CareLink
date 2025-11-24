// ===================================
// CARELINK - SCRIPT PRINCIPAL
// Développeur: VIEY David
// Version: 2.0.0
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // MODE SOMBRE
    // ===================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;

    // Charger la préférence sauvegardée
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    if (darkModeToggle) {
        // Sync checkbox state with saved theme
        darkModeToggle.checked = (savedTheme === 'dark');

        darkModeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===================================
    // MENU MOBILE
    // ===================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Changement de l'icône du bouton
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.textContent = '✕';
            } else {
                mobileMenuBtn.textContent = '☰';
            }
        });

        // Fermer le menu quand on clique sur un lien
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(event) {
            const isClickInside = navLinks.contains(event.target) || mobileMenuBtn.contains(event.target);

            if (!isClickInside && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorer les liens avec # seulement
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===================================
    // FORMULAIRE DE CONTACT
    // ===================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validation basique
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Validation de l'email
            if (!isValidEmail(formData.email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Construction du lien mailto
            const mailtoLink = `mailto:Riisalthkarral@gmail.com?subject=${encodeURIComponent(formData.subject + ' - ' + formData.name)}&body=${encodeURIComponent(
                `Nom: ${formData.name}\n` +
                `Email: ${formData.email}\n` +
                `Sujet: ${formData.subject}\n\n` +
                `Message:\n${formData.message}`
            )}`;

            // Ouvrir le client email
            window.location.href = mailtoLink;

            // Afficher une notification
            showNotification('Votre client email va s\'ouvrir. Merci de votre message !', 'success');

            // Réinitialiser le formulaire
            contactForm.reset();
        });
    }

    // ===================================
    // ANIMATIONS AU SCROLL
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les cartes de fonctionnalités
    document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
        observer.observe(card);
    });

    // ===================================
    // ANIMATIONS DES CHIFFRES (statistiques)
    // ===================================
    const statsNumbers = document.querySelectorAll('.text-primary');

    statsNumbers.forEach(stat => {
        if (stat.textContent.match(/^\d+\+?$/)) {
            const finalValue = parseInt(stat.textContent);
            animateValue(stat, 0, finalValue, 2000);
        }
    });
});

// ===================================
// FONCTIONS UTILITAIRES
// ===================================

/**
 * Valide une adresse email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affiche une notification
 */
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Ajouter des styles inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#7ED321' : type === 'error' ? '#D0021B' : '#4A90E2'};
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Retirer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

/**
 * Animation des nombres
 */
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

/**
 * Détection du scroll pour ajouter une ombre au header
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// ===================================
// ANIMATIONS CSS (ajoutées dynamiquement)
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification {
        cursor: pointer;
    }

    .notification:hover {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// ===================================
// CONSOLE INFO
// ===================================
console.log('%c🏥 CareLink v2.0.0', 'color: #4A90E2; font-size: 20px; font-weight: bold;');
console.log('%cDéveloppé par VIEY David', 'color: #7F8C8D; font-size: 14px;');
console.log('%cSite web professionnel pour CareLink', 'color: #7F8C8D; font-size: 12px;');
