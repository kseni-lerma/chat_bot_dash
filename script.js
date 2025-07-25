
    // Переключение бокового меню
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const body = document.body;

    sidebarToggle.addEventListener('click', () => {
        body.classList.toggle('sidebar-open');

        // Обновляем иконку
        const icon = sidebarToggle.querySelector('i');
        if (body.classList.contains('sidebar-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Переключение вкладок
    const menuItems = document.querySelectorAll('.menu-item');
    const contents = document.querySelectorAll('.content');
    const currentTabElement = document.getElementById('current-tab');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabName = this.querySelector('span').textContent;

            // Обновляем название текущей вкладки
            currentTabElement.textContent = tabName;

            // Убираем активный класс у всех пунктов меню
            menuItems.forEach(i => i.classList.remove('active'));
            // Добавляем активный класс текущему пункту
            this.classList.add('active');

            // Скрываем все вкладки контента
            contents.forEach(c => c.classList.remove('active'));
            // Показываем выбранную вкладку
            document.getElementById(tabId).classList.add('active');

            // На мобильных устройствах закрываем меню после выбора
            if (window.innerWidth <= 768) {
                body.classList.remove('sidebar-open');
                sidebarToggle.querySelector('i').classList.remove('fa-times');
                sidebarToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Детализация показателей
    const detailView = document.getElementById('detail-view');
    const backBtn = document.getElementById('back-btn');
    const detailTitle = document.getElementById('detail-title');
    const detailComment = document.getElementById('detail-comment');
    const dateRangeText = document.getElementById('date-range-text');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const detailChartCtx = document.getElementById('detail-chart').getContext('2d');
    const detailTableBody = document.getElementById('detail-table-body');

    let currentChart = null;
    let currentData = null;
    let minDate = null;
    let maxDate = null;
    let currentKey = null;
    let currentCategory = null;

    // Обработчики для кнопок детализации
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            const category = this.getAttribute('data-category');
            const subcategory = this.getAttribute('data-subcategory');

            // Показываем экран детализации
            showDetailView(key, category, subcategory);
        });
    });

    // Обработчик для кнопки "Назад"
    backBtn.addEventListener('click', function() {
        hideDetailView();
    });

    // Обработчики для фильтров даты
    startDateInput.addEventListener('change', updateDetailView);
    endDateInput.addEventListener('change', updateDetailView);

    // Функция форматирования чисел
    function formatNumber(value) {
        if (typeof value !== 'number') {
            value = parseFloat(value);
            if (isNaN(value)) return value;
        }

        // Для больших чисел используем сокращения
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(2).replace('.', ',') + ' млрд';
        } else if (value >= 1000000) {
            return (value / 1000000).toFixed(2).replace('.', ',') + ' млн';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1).replace('.', ',') + ' тыс';
        }

        return value.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('.', ',');
    }

    // Показать экран детализации
    function showDetailView(key, category, subcategory) {
        // Получаем данные для показателя
        const data = historicalData[key];
        if (!data || data.length === 0) return;

        // Сохраняем данные
        currentData = data;
        currentKey = key;
        currentCategory = category;

        // Устанавливаем заголовок
        detailTitle.textContent = `${category} - ${subcategory}`;

        // Устанавливаем комментарий
        if (data.length > 0 && data[0].comment) {
            detailComment.textContent = `Данные указаны: ${data[0].comment}`;
        } else {
            detailComment.textContent = '';
        }

        // Определяем диапазон дат
        minDate = data[0].date;
        maxDate = data[0].date;

        data.forEach(item => {
            if (item.date < minDate) minDate = item.date;
            if (item.date > maxDate) maxDate = item.date;
        });

        // Устанавливаем текст с диапазоном дат
        dateRangeText.textContent = `Доступные данные: с ${formatDate(minDate)} по ${formatDate(maxDate)}`;

        // Устанавливаем фильтры дат
        startDateInput.value = minDate;
        endDateInput.value = maxDate;
        startDateInput.min = minDate;
        startDateInput.max = maxDate;
        endDateInput.min = minDate;
        endDateInput.max = maxDate;

        // Обновляем представление
        updateDetailView();

        // Показываем экран детализации
        body.classList.add('detail-view-active');
        detailView.classList.remove('hidden');
    }

    // Скрыть экран детализации
    function hideDetailView() {
        body.classList.remove('detail-view-active');
        detailView.classList.add('hidden');

        // Уничтожаем текущий график
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }

        // Очищаем данные
        currentData = null;
        minDate = null;
        maxDate = null;
        currentKey = null;
        currentCategory = null;
    }

    // Обновить представление детализации
    function updateDetailView() {
        if (!currentData) return;

        // Получаем выбранные даты
        const startDate = startDateInput.value || minDate;
        const endDate = endDateInput.value || maxDate;

        // Фильтруем данные
        let filteredData = currentData.filter(item => {
            return item.date >= startDate && item.date <= endDate;
        });

        // Сортируем по дате
        filteredData.sort((a, b) => a.date.localeCompare(b.date));

        // Обновляем таблицу
        updateTable(filteredData);

        // Обновляем график
        updateChart(filteredData);
    }

    // Обновить таблицу
    function updateTable(data) {
        detailTableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(item.date);

            const valueCell = document.createElement('td');
            valueCell.textContent = formatNumber(item.value) + (item.unit ? ' ' + item.unit : '');

            row.appendChild(dateCell);
            row.appendChild(valueCell);
            detailTableBody.appendChild(row);
        });
    }

    // Обновить график
    function updateChart(data) {
        // Уничтожаем предыдущий график
        if (currentChart) {
            currentChart.destroy();
        }

        // Подготавливаем данные для графика
        const labels = data.map(item => item.date);
        const values = data.map(item => parseFloat(item.value));
        const unit = data.length > 0 ? data[0].unit : '';

        // Проверяем, является ли текущий показатель льготной ипотекой
        const isSpecial = currentCategory === "Объем выданных кредитов" &&
                         currentKey.includes("Льготная ипотека");

        let datasets = [];
        let chartType = 'line';

        if (isSpecial) {
            // Создаем два набора данных: линия до 2025 и столбцы с 2025
            const lineData = [];
            const barData = [];
            const lineLabels = [];
            const barLabels = [];

            data.forEach(item => {
                if (new Date(item.date) < new Date('2025-01-01')) {
                    lineData.push(parseFloat(item.value));
                    lineLabels.push(item.date);
                } else {
                    barData.push(parseFloat(item.value));
                    barLabels.push(item.date);
                }
            });

            datasets = [
                {
                    label: 'До 2025 года',
                    data: lineData,
                    borderColor: 'rgba(90, 122, 233, 1)',
                    backgroundColor: 'rgba(90, 122, 233, 0.1)',
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.2,
                    fill: false,
                    type: 'line'
                },
                {
                    label: '2025 год (накопленный)',
                    data: barData,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    type: 'bar'
                }
            ];
        } else {
            datasets = [{
                label: 'Значение',
                data: values,
                backgroundColor: 'rgba(90, 122, 233, 0.1)',
                borderColor: 'rgba(90, 122, 233, 1)',
                borderWidth: 3,
                pointRadius: 0, // Убираем точки
                tension: 0.2,
                fill: true
            }];
        }

        // Создаем новый график
        currentChart = new Chart(detailChartCtx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 14
                        },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Значение: ${formatNumber(context.parsed.y)} ${unit}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)'
                        },
                        title: {
                            display: true,
                            text: unit
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                hover: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    