// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек
    const cards = document.querySelectorAll('.cube-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Интерактивность для куба в шапке
    const cube = document.querySelector('.cube');
    let isRotating = true;

    function toggleRotation() {
        isRotating = !isRotating;
        cube.style.animationPlayState = isRotating ? 'running' : 'paused';
    }

    cube.addEventListener('click', toggleRotation);

    // Эффект параллакса для фона
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.body.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });

    // Подсветка активной карточки
    cards.forEach(card => {
        if (!card.classList.contains('coming-soon')) {
            card.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.95)';
            });
        }
    });

    console.log('КУБ система запущена! Добро пожаловать!');
});

// Дополнительные функции для будущего расширения
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
            </div>
        `;
        grid.appendChild(newCard);
    },

    // Метод для показа уведомлений
    showNotification: function(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4d96ff;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};