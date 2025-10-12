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
        }, index * 150);
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

    // Подсветка активной карточки
    const activeCards = document.querySelectorAll('.cube-card:not(.coming-soon)');
    activeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Адаптация для больших экранов
    function handleResize() {
        const isLargeScreen = window.innerWidth >= 1600;
        document.body.classList.toggle('large-screen', isLargeScreen);
        
        // Оптимизация для OLED панелей
        if (window.innerWidth >= 2000) {
            document.body.style.background = '#0a1f0a';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    console.log('🚀 КУБ система запущена! Добро пожаловать!');
});

// Системные функции
const KUBSystem = {
    // Метод для добавления новых блоков
    addNewBlock: function(title, description, icon, url) {
        const grid = document.querySelector('.dashboard-grid');
        const newCard = document.createElement('a');
        newCard.href = url;
        newCard.className = 'cube-card';
        newCard.innerHTML = `
            <div class="card-content">
                <div class="card-icon">${icon}</div>
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="card-hover-effect"></div>
            </div>
        `;
        grid.appendChild(newCard);
        return newCard;
    },

    // Метод для показа уведомлений
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#4caf50' : '#FF9800';
        
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