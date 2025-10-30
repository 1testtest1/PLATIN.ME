// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect - appears after first block
const header = document.getElementById('header');
const heroSection = document.getElementById('hero');
const mobileBottomNav = document.querySelector('.mobile-bottom-nav');

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    
    // Для мобильных устройств хедер появляется раньше
    const isMobile = window.innerWidth <= 968;
    const offset = isMobile ? 300 : 100;
    // Гарантируем, что нижний хедер не появится на первом экране
    // Если высота героя меньше offset (очень маленькие экраны), используем процент от высоты
    const threshold = isMobile
        ? Math.max(0, Math.floor(heroHeight * 0.95))
        : Math.max(0, heroHeight - offset);
    
    if (isMobile) {
        // На мобильных нижняя навигация отключена
        if (mobileBottomNav) mobileBottomNav.classList.remove('visible');
        // Поведение верхнего хедера (полупрозрачный фон) оставляем по скроллу
        if (scrollTop > threshold) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    } else {
        if (scrollTop > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // На десктопе нижний хедер не используется
        if (mobileBottomNav) mobileBottomNav.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            // Remove active class from all links (включая мобильные)
            const allNavLinks = document.querySelectorAll('.nav-link');
            allNavLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to all corresponding links (десктоп и мобильные)
            const activeLinks = document.querySelectorAll(`.nav-link[href="#${sectionId}"]`);
            activeLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Update active link on page load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Process steps animation - активация цифр на основе позиции скролла
const processSteps = document.querySelectorAll('.step');
const processSection = document.querySelector('.process-container');

function updateStepsOnScroll() {
    if (!processSection || processSteps.length === 0) return;
    
    const sectionTop = processSection.offsetTop;
    const sectionHeight = processSection.offsetHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Вычисляем прогресс прокрутки через секцию (от 0 до 1)
    const sectionScrollStart = sectionTop - windowHeight + 200;
    const sectionScrollEnd = sectionTop + sectionHeight - 200;
    const scrollProgress = (scrollTop - sectionScrollStart) / (sectionScrollEnd - sectionScrollStart);
    
    // Ограничиваем прогресс от 0 до 1
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    
    // Вычисляем, какая цифра должна быть активна
    const activeIndex = Math.floor(clampedProgress * processSteps.length);
    
    // Активируем только одну цифру
    processSteps.forEach((step, index) => {
        const stepNumber = step.querySelector('.step-number');
        if (stepNumber) {
            if (index === activeIndex && clampedProgress > 0 && clampedProgress < 1) {
                stepNumber.classList.add('active');
            } else {
                stepNumber.classList.remove('active');
            }
        }
    });
}

// Обновляем при скролле
window.addEventListener('scroll', updateStepsOnScroll);
// Обновляем при загрузке
window.addEventListener('load', updateStepsOnScroll);

// Эффект дронов удален

// Mouse parallax effect for hero background
const hero = document.getElementById('hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;
        
        hero.style.setProperty('--mouse-x', `${moveX}px`);
        hero.style.setProperty('--mouse-y', `${moveY}px`);
    });
}

// Add CSS custom properties for mouse movement
const style = document.createElement('style');
style.textContent = `
    .hero-background::before {
        transform: translate(calc(var(--mouse-x, 0) * 0.5), calc(var(--mouse-y, 0) * 0.5));
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.logo-container, .hero-title, .cta-button').forEach(el => {
    observer.observe(el);
});

// Add hover effects to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Logo container hover effect
const logoContainer = document.querySelector('.logo-container');
if (logoContainer) {
    logoContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    logoContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// CTA button click effect
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(ctaButton => {
    ctaButton.addEventListener('click', function(e) {
        // Не блокируем переход по ссылке, только добавляем визуальный эффект
        this.style.opacity = '0.8';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 200);
    });
});

// Smooth scroll - более плавный скролл
document.documentElement.style.scrollBehavior = 'smooth';

// Console branding
console.log('%cPLATIN AGENCY', 'font-size: 24px; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5);');
console.log('%cЭксклюзивный сервис премиум-класса', 'font-size: 12px; color: #ccc; margin-top: 5px;');

// Prevent widows: склеиваем последние два слова неразрывным пробелом
function preventWidows(selectors) {
    const elements = document.querySelectorAll(selectors);
    elements.forEach(el => {
        // Пропускаем, если есть вложенные теги со сложной разметкой
        if (el.children.length > 0 && el.tagName !== 'LI') return;
        const html = el.innerHTML.trim();
        if (!html) return;
        // Если уже есть неразрывный пробел, пропускаем
        if (html.includes('&nbsp;')) return;
        // Заменяем последний обычный пробел между словами на неразрывный
        const updated = html.replace(/\s+(\S+)\s*$/u, '&nbsp;$1');
        el.innerHTML = updated;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    preventWidows(
        [
            '.hero-desc-line1',
            '.hero-desc-line2',
            '.foundation-title',
            '.foundation-text p',
            '.services-title',
            '.services-text p',
            '.process-title',
            '.confidentiality-title',
            '.confidentiality-text p',
            '.footer-cta-title',
            '.goals-list li'
        ].join(',')
    );
});