// SVG Effects Controller - упрощенная версия с прямым применением фильтров
(function() {
    'use strict';
    
    // Используем конфигурацию из внешнего файла или значения по умолчанию
    const defaultConfig = window.SVGEffectsConfig || {
        mobileBreakpoint: 768,
        desktop: {
            base: { shadows: ['0 0 5px rgba(255, 255, 255, 0.8)', '0 0 10px rgba(255, 255, 255, 0.6)', '0 0 15px rgba(255, 255, 255, 0.4)'] },
            peak: { shadows: ['0 0 8px rgba(255, 255, 255, 1)', '0 0 15px rgba(255, 255, 255, 0.8)', '0 0 25px rgba(255, 255, 255, 0.6)', '0 0 35px rgba(255, 255, 255, 0.4)'] },
            duration: 1500,
            transitionSpeed: 0.5
        },
        mobile: {
            base: { shadows: ['0 0 3px rgba(255, 255, 255, 0.7)', '0 0 6px rgba(255, 255, 255, 0.5)'] },
            peak: { shadows: ['0 0 5px rgba(255, 255, 255, 0.9)', '0 0 10px rgba(255, 255, 255, 0.6)'] },
            duration: 2000,
            transitionSpeed: 0.5
        }
    };
    
    // Определяем мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                     || window.innerWidth <= defaultConfig.mobileBreakpoint;
    
    // Получаем конфигурацию для текущего устройства
    const config = isMobile ? defaultConfig.mobile : defaultConfig.desktop;
    
    // Функция для создания filter строки из массива теней
    function createFilterString(shadows) {
        return shadows.map(shadow => `drop-shadow(${shadow})`).join(' ');
    }
    
    // Функция для применения эффекта к элементу
    function applyEffect(element, filterString) {
        element.style.filter = filterString;
        element.style.transition = `filter ${config.transitionSpeed || 0.5}s ease-in-out`;
        element.style.willChange = 'filter';
    }
    
    // Функция анимации с плавным переходом
    function animateElement(element) {
        const baseFilter = createFilterString(config.base.shadows);
        const peakFilter = createFilterString(config.peak.shadows);
        const duration = config.duration;
        
        let isPeak = false;
        
        // Устанавливаем начальное состояние
        applyEffect(element, baseFilter);
        
        // Функция переключения эффекта
        function toggle() {
            isPeak = !isPeak;
            applyEffect(element, isPeak ? peakFilter : baseFilter);
        }
        
        // Запускаем анимацию (CSS transition обеспечит плавность)
        setInterval(toggle, duration);
    }
    
    // Находим все SVG изображения
    const svgImages = document.querySelectorAll('img[src$=".svg"]');
    
    // Фильтруем только наши тестовые SVG (1-test.svg, 2-test.svg, 3-test.svg, 4-test.svg)
    const targetSvgs = Array.from(svgImages).filter(img => {
        const src = img.getAttribute('src');
        return src && /[1-4]-test\.svg/.test(src);
    });
    
    // Применяем эффекты ко всем найденным SVG
    function initEffects() {
        if (targetSvgs.length === 0) {
            console.warn('SVG изображения не найдены');
            return;
        }
        
        console.log('Найдено SVG изображений:', targetSvgs.length);
        
        targetSvgs.forEach((img, index) => {
            // Ждем загрузки изображения
            if (img.complete) {
                console.log('Применяю эффекты к:', img.src);
                animateElement(img);
            } else {
                img.addEventListener('load', () => {
                    console.log('Применяю эффекты к (после загрузки):', img.src);
                    animateElement(img);
                }, { once: true });
                
                // На случай если событие load не сработает
                img.addEventListener('error', () => {
                    console.error('Ошибка загрузки изображения:', img.src);
                }, { once: true });
            }
        });
    }
    
    // Обработка изменения размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Перезапускаем эффекты при изменении размера (например, поворот устройства)
            const newIsMobile = window.innerWidth <= defaultConfig.mobileBreakpoint;
            if (newIsMobile !== isMobile) {
                location.reload(); // Перезагружаем страницу при изменении типа устройства
            }
        }, 250);
    });
    
    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEffects);
    } else {
        // Задержка для гарантии загрузки DOM
        setTimeout(initEffects, 100);
    }
    
    // Экспортируем для возможного использования извне
    window.SVGEffects = {
        config: config,
        defaultConfig: defaultConfig,
        isMobile: isMobile,
        reinit: initEffects
    };
})();
