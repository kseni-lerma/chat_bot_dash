// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек с задержкой
    const cards = document.querySelectorAll('.cube-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });

    // Интерактивность для куба
    const cube = document.querySelector('.cube');
    let isRotating = true;

    function toggleRotation() {
        isRotating = !isRotating;
        if (isRotating) {
            cube.style.animationPlayState = 'running';
            cube.style.animationDuration = '8s';
        } else {
            cube.style.animationPlayState = 'paused';
        }
    }

    cube.addEventListener('click', toggleRotation);
    
    // Эффект параллакса для фона
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
        
        document.body.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

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

    // Добавляем эффект частиц при клике
    document.addEventListener('click', function(e) {
        createParticles(e.clientX, e.clientY);
    });

    function createParticles(x, y) {
        const particles = document.createElement('div');
        particles.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            width: 6px;
            height: 6px;
            background: #81c784;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(particles);
        
        // Анимация частицы
        const animation = particles.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => particles.remove();
    }

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
        const bgColor = type === 'success' ? '#4caf50' : '#2e7d32';
        
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