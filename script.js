
// Переключение бокового меню
const sidebarToggle = document.querySelector('.sidebar-toggle');
const body = document.body;

sidebarToggle.addEventListener('click', () => {
    body.classList.toggle('sidebar-open');
});

// Обработчики для подменю
document.querySelectorAll('.submenu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const menuItem = this.closest('.menu-item');
        menuItem.classList.toggle('active');
    });
});

// Переключение разделов
const menuItems = document.querySelectorAll('.menu-item:not(.has-submenu)');
const submenuItems = document.querySelectorAll('.submenu-item');
const contents = document.querySelectorAll('.content');
const currentSectionElement = document.getElementById('current-section');

// Функция для активации раздела
function activateSection(sectionId, sectionName) {
    // Скрываем все контенты
    contents.forEach(c => c.classList.remove('active'));
    
    // Показываем выбранный контент
    const contentElement = document.getElementById(`content-${sectionId}`);
    if (contentElement) {
        contentElement.classList.add('active');
    }
    
    // Обновляем название текущего раздела
    currentSectionElement.textContent = sectionName;
    
    // Сохраняем активный раздел в localStorage
    localStorage.setItem('activeSection', sectionId);
}

// Функция для активации группы
function activateGroup(section, group) {
    const sectionId = `${section}-${group}`;
    activateSection(sectionId, `${section} / ${group}`);
    
    // Сохраняем активную группу в localStorage
    localStorage.setItem('activeGroup', group);
}

// Обработчики для пунктов меню
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        activateSection(section, section);
        
        // На мобильных устройствах закрываем меню после выбора
        if (window.innerWidth <= 768) {
            body.classList.remove('sidebar-open');
        }
    });
});

// Обработчики для пунктов подменю
submenuItems.forEach(item => {
    item.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        const group = this.getAttribute('data-group');
        activateGroup(section, group);
        
        // На мобильных устройствах закрываем меню после выбора
        if (window.innerWidth <= 768) {
            body.classList.remove('sidebar-open');
        }
    });
});

// Восстановление активного раздела при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const savedSection = localStorage.getItem('activeSection');
    const savedGroup = localStorage.getItem('activeGroup');
    
    if (savedSection && savedGroup) {
        activateGroup(savedSection, savedGroup);
    } else if (savedSection) {
        activateSection(savedSection, savedSection);
    } else {
        // Активируем первый раздел по умолчанию
        const firstSection = document.querySelector('.menu-item');
        if (firstSection) {
            const section = firstSection.getAttribute('data-section') || 'Основные показатели';
            activateSection(section, section);
        }
    }
});

// ... (остальной JavaScript код остается без изменений) ...
