
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
    const premiumChartCtx = document.getElementById('premium-chart').getContext('2d');
    const premiumChartContainer = document.getElementById('premium-chart-container');
    const detailTableBody = document.getElementById('detail-table-body');

    let currentChart = null;
    let premiumChart = null;
    let currentData = null;
    let minDate = null;
    let maxDate = null;
    let currentUnit = '';

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

    // Показать экран детализации
    function showDetailView(key, category, subcategory) {
        // Получаем данные для показателя
        const data = historicalData[key];
        if (!data || data.length === 0) return;

        // Сохраняем данные
        currentData = data;

        // Устанавливаем заголовок
        detailTitle.textContent = `${category} - ${subcategory}`;

        // Устанавливаем комментарий
        const comment = data.length > 0 ? data[0].comm_ : '';
        detailComment.textContent = comment;

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

        // Скрываем дополнительный график для льготной ипотеки
        premiumChartContainer.classList.add('hidden');

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
        
        if (premiumChart) {
            premiumChart.destroy();
            premiumChart = null;
        }

        // Очищаем данные
        currentData = null;
        minDate = null;
        maxDate = null;
        currentUnit = '';
    }

    // Обновить представление детализации
    function updateDetailView() {
        if (!currentData) return;

        // Получаем выбранные даты
        const startDate = startDateInput.value || minDate;
        const endDate = endDateInput.value || maxDate;

        // Фильтруем данные
        const filteredData = currentData.filter(item => {
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
            // Форматируем число в зависимости от единиц измерения
            let displayValue;
            if (item.unit === 'ед.' || item.unit === 'млн ед.') {
                displayValue = parseInt(item.value).toLocaleString('ru-RU');
            } else {
                const numValue = parseFloat(item.value);
                displayValue = numValue.toLocaleString('ru-RU', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0
                });
            }
            valueCell.textContent = `${displayValue} ${item.unit}`;

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
            currentChart = null;
        }
        
        if (premiumChart) {
            premiumChart.destroy();
            premiumChart = null;
        }

        // Скрываем дополнительный график
        premiumChartContainer.classList.add('hidden');

        if (data.length === 0) return;

        // Проверяем, является ли текущий показатель льготной ипотекой
        const isPremiumMortgage = detailTitle.textContent.includes('Льготная ипотека') && 
                                detailTitle.textContent.includes('Объем выданных кредитов');

        if (isPremiumMortgage) {
            renderPremiumMortgageChart(data);
        } else {
            renderStandardChart(data);
        }
    }

    // Рендеринг стандартного графика
    function renderStandardChart(data) {
        // Подготавливаем данные для графика
        const labels = data.map(item => item.date);
        const values = data.map(item => parseFloat(item.value));
        currentUnit = data.length > 0 ? data[0].unit : '';

        // Создаем новый график
        currentChart = new Chart(detailChartCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Значение',
                    data: values,
                    backgroundColor: 'rgba(90, 122, 233, 0.1)',
                    borderColor: 'rgba(90, 122, 233, 1)',
                    borderWidth: 3,
                    pointRadius: 0, // Убираем точки
                    tension: 0.2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                                let value = context.parsed.y;
                                // Форматируем число для tooltip
                                let displayValue;
                                if (currentUnit === 'ед.' || currentUnit === 'млн ед.') {
                                    displayValue = parseInt(value).toLocaleString('ru-RU');
                                } else {
                                    displayValue = value.toLocaleString('ru-RU', {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 0
                                    });
                                }
                                return `Значение: ${displayValue} ${currentUnit}`;
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
                            text: currentUnit
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

    // Рендеринг графика для льготной ипотеки
    function renderPremiumMortgageChart(data) {
        // Разделяем данные на периоды: до 2025 и после
        const pre2025Data = data.filter(item => item.date < '2025-01-01');
        const post2025Data = data.filter(item => item.date >= '2025-01-01');
        currentUnit = data.length > 0 ? data[0].unit : '';

        // Рендерим основной график (до 2025)
        if (pre2025Data.length > 0) {
            const labels = pre2025Data.map(item => item.date);
            const values = pre2025Data.map(item => parseFloat(item.value));

            currentChart = new Chart(detailChartCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Значение (до 2025)',
                        data: values,
                        backgroundColor: 'rgba(90, 122, 233, 0.1)',
                        borderColor: 'rgba(90, 122, 233, 1)',
                        borderWidth: 3,
                        pointRadius: 0,
                        tension: 0.2,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
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
                                    let value = context.parsed.y;
                                    let displayValue = value.toLocaleString('ru-RU', {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 0
                                    });
                                    return `Значение: ${displayValue} ${currentUnit}`;
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
                                text: currentUnit
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

        // Рендерим дополнительный график (с 2025)
        if (post2025Data.length > 0) {
            // Форматируем даты для подписей
            const monthNames = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
            const labels = post2025Data.map(item => {
                const date = new Date(item.date);
                const year = date.getFullYear();
                const month = date.getMonth();
                
                // Создаем подпись вида "янв 2025", "янв-фев 2025" и т.д.
                let label = '';
                for (let i = 0; i <= month; i++) {
                    if (i > 0) label += '-';
                    label += monthNames[i];
                }
                return `${label} ${year}`;
            });

            const values = post2025Data.map(item => parseFloat(item.value));

            premiumChartContainer.classList.remove('hidden');
            premiumChart = new Chart(premiumChartCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Накопленный объем (2025)',
                        data: values,
                        backgroundColor: 'rgba(109, 90, 207, 0.7)',
                        borderColor: 'rgba(109, 90, 207, 1)',
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
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
                                    let value = context.parsed.y;
                                    let displayValue = value.toLocaleString('ru-RU', {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 0
                                    });
                                    return `Значение: ${displayValue} ${currentUnit}`;
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
                                text: currentUnit
                            }
                        }
                    }
                }
            });
        }
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
    