// Конфигурация (замените на свои данные)
const LOGIN_URL = "https://vm-f0f0f249.na4u.ru/login/";
const DASHBOARD_URL = "https://vm-f0f0f249.na4u.ru/superset/dashboard/14/";
const USERNAME = "demo";
const PASSWORD = "demo";

const iframe = document.getElementById('dashboardFrame');
const statusEl = document.getElementById('status');

// Этап 1: Загружаем страницу логина в iframe
function startLoginProcess() {
    statusEl.textContent = "Загрузка страницы входа...";
    iframe.src = LOGIN_URL + "?next=" + encodeURIComponent(DASHBOARD_URL);
}

// Этап 2: Вводим учетные данные (вызывается после загрузки iframe)
function fillLoginForm() {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Находим элементы формы
        const usernameInput = iframeDoc.querySelector('input[name="username"]');
        const passwordInput = iframeDoc.querySelector('input[name="password"]');
        const submitButton = iframeDoc.querySelector('button[type="submit"]');
        
        if (usernameInput && passwordInput && submitButton) {
            statusEl.textContent = "Ввод учетных данных...";
            
            // Заполняем форму
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;
            
            // Отправляем форму
            setTimeout(() => {
                submitButton.click();
                statusEl.textContent = "Выполняется вход...";
                checkDashboardLoaded();
            }, 1000);
        } else {
            statusEl.textContent = "Ошибка: Не удалось найти форму входа";
        }
    } catch (error) {
        statusEl.textContent = "Ошибка доступа: " + error.message;
        console.error("CORS error:", error);
    }
}

// Этап 3: Проверяем загрузку дашборда
function checkDashboardLoaded() {
    setTimeout(() => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const dashboardElement = iframeDoc.querySelector('.dashboard');
            
            if (dashboardElement) {
                statusEl.textContent = "Дашборд успешно загружен!";
            } else {
                statusEl.textContent = "Проверка состояния...";
                checkDashboardLoaded(); // Рекурсивная проверка
            }
        } catch (error) {
            statusEl.textContent = "Ожидание загрузки...";
            checkDashboardLoaded(); // Продолжаем проверку
        }
    }, 2000);
}

// Инициализация
iframe.addEventListener('load', () => {
    const currentUrl = iframe.contentWindow.location.href;
    
    if (currentUrl.includes('/login/')) {
        fillLoginForm();
    } else if (currentUrl.includes('/dashboard/')) {
        statusEl.textContent = "Дашборд загружен";
    }
});

// Запускаем процесс
startLoginProcess();