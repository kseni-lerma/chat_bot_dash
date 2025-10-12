// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек с задержкой
    const cards = document.querySelectorAll('.cube-card');
    cards.forEach((card, index) => {
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
        const body = document.body;
        
        // Убираем классы перед добавлением новых
        body.classList.remove('mobile', 'tablet', 'desktop', 'large-desktop', 'huge-desktop');
        
        if (width < 768) {
            body.classList.add('mobile');
        } else if (width < 1200) {
            body.classList.add('tablet');
        } else if (width < 2000) {
            body.classList.add('desktop');
        } else if (width < 3000) {
            body.classList.add('large-desktop');
        } else {
            body.classList.add('huge-desktop');
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
        const bgColor = type === 'success' ? '#3b82f6' : '#f59e0b';
        
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