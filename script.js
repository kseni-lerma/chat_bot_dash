// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек с задержкой
    const cards = document.querySelectorAll('.cube-card');
    cards.forEach((card, index) => {
        // Показываем только активные карточки на мобильных
        if (window.innerWidth <= 768 && !card.classList.contains('active-card')) {
            card.style.display = 'none';
            return;
        }
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Интерактивность для куба
    const cube = document.querySelector('.cube');
    let isRotating = true;

    function toggleRotation() {
        isRotating = !isRotating;
        if (isRotating) {
            cube.style.animationPlayState = 'running';
        } else {
            cube.style.animationPlayState = 'paused';
        }
    }

    cube.addEventListener('click', toggleRotation);

    // Адаптация для разных размеров экранов
    function handleResize() {
        const width = window.innerWidth;
        const desktopCards = document.querySelectorAll('.desktop-only');
        
        if (width <= 768) {
            // На мобильных скрываем дополнительные карточки
            desktopCards.forEach(card => {
                card.style.display = 'none';
            });
        } else {
            // На больших экранах показываем все карточки
            desktopCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    console.log('🚀 КУБ система запущена! Добро пожаловать!');
});

// Системные функции
const KUBSystem = {
    // Метод для показа уведомлений
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#8B5CF6' : '#06D6A0';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Убираем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },

    // Инициализация системы
    init: function() {
        this.showNotification('КУБ система загружена успешно!', 'success');
    }
};

// Инициализируем систему
setTimeout(() => {
    KUBSystem.init();
}, 1000);