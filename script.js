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
        card.style.transform = 'translateY(20px)';

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
                card.style.display = 'flex';
            });
        }

        // Выравнивание высоты карточек
        alignCardHeights();
    }

    // Функция для выравнивания высоты карточек
    function alignCardHeights() {
        const cards = document.querySelectorAll('.cube-card');
        let maxHeight = 0;

        // Сначала сбросим высоту
        cards.forEach(card => {
            card.style.height = 'auto';
        });

        // Найдем максимальную высоту
        cards.forEach(card => {
            if (window.innerWidth <= 768 && !card.classList.contains('active-card')) {
                return;
            }
            const cardHeight = card.offsetHeight;
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
        });

        // Применим максимальную высоту ко всем карточкам
        if (maxHeight > 0 && window.innerWidth >= 769) {
            cards.forEach(card => {
                if (window.innerWidth <= 768 && !card.classList.contains('active-card')) {
                    return;
                }
                card.style.height = maxHeight + 'px';
            });
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Выравнивание высоты после загрузки всех ресурсов
    window.addEventListener('load', alignCardHeights);

    // Оптимизация для мобильных: убедимся что карточки занимают весь экран
    function optimizeMobileLayout() {
        if (window.innerWidth <= 768) {
            const main = document.querySelector('.main');
            const grid = document.querySelector('.dashboard-grid');
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const footerHeight = document.querySelector('.footer').offsetHeight;
            const availableHeight = viewportHeight - headerHeight - footerHeight - 32; // 32px для отступов

            if (main && grid) {
                main.style.height = availableHeight + 'px';
                grid.style.height = '100%';
            }
        }
    }

    window.addEventListener('resize', optimizeMobileLayout);
    optimizeMobileLayout();

    // Оптимизация для больших экранов 1920x1080
    function optimizeDesktopLayout() {
        if (window.innerWidth >= 1920) {
            const main = document.querySelector('.main');
            const grid = document.querySelector('.dashboard-grid');
            const viewportHeight = window.innerHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            const footerHeight = document.querySelector('.footer').offsetHeight;
            const availableHeight = viewportHeight - headerHeight - footerHeight - 40; // 40px для отступов

            if (main && grid) {
                main.style.height = availableHeight + 'px';
                grid.style.height = '100%';

                // Дополнительное выравнивание для больших экранов
                alignCardContentHeights();
            }
        }
    }

    // Функция для выравнивания высоты контента внутри карточек на больших экранах
    function alignCardContentHeights() {
        if (window.innerWidth >= 1920) {
            const cards = document.querySelectorAll('.cube-card');
            const icons = document.querySelectorAll('.card-icon');
            const titles = document.querySelectorAll('.cube-card h2');
            const paragraphs = document.querySelectorAll('.cube-card p');

            let maxIconHeight = 0;
            let maxTitleHeight = 0;
            let maxParagraphHeight = 0;

            // Находим максимальные высоты
            icons.forEach(icon => {
                const height = icon.offsetHeight;
                if (height > maxIconHeight) maxIconHeight = height;
            });

            titles.forEach(title => {
                const height = title.offsetHeight;
                if (height > maxTitleHeight) maxTitleHeight = height;
            });

            paragraphs.forEach(paragraph => {
                const height = paragraph.offsetHeight;
                if (height > maxParagraphHeight) maxParagraphHeight = height;
            });

            // Применяем максимальные высоты
            icons.forEach(icon => {
                icon.style.minHeight = maxIconHeight + 'px';
            });

            titles.forEach(title => {
                title.style.minHeight = maxTitleHeight + 'px';
            });

            paragraphs.forEach(paragraph => {
                paragraph.style.minHeight = maxParagraphHeight + 'px';
            });
        }
    }

    window.addEventListener('resize', optimizeDesktopLayout);
    optimizeDesktopLayout();

    // Вызываем выравнивание контента после полной загрузки
    window.addEventListener('load', function() {
        setTimeout(alignCardContentHeights, 100);
    });

    console.log('КУБ система запущена!');
});

// Системные функции
const KUBSystem = {
    // Метод для добавления новых блоков
    addNewBlock: function(title, description, icon, url) {
        const grid = document.querySelector('.dashboard-grid');
        const newCard = document.createElement('a');
        newCard.href = url;
        newCard.className = 'cube-card active-card';
        newCard.innerHTML = `
            <div class="card-content">
                <div class="card-icon">${icon}</div>
                <h2>${title}</h2>
                <p>${description}</p>
                <div class="card-footer">
                    <span class="status-indicator active">Активно</span>
                </div>
            </div>
        `;
        grid.appendChild(newCard);
        return newCard;
    }
};