
    // ... (существующий код для меню и вкладок) ...
    
    // Глобальные переменные для детализации
    let detailData = {};
    let currentChart = null;
    
    // Загрузка данных для детализации
    fetch('detail_data.json')
        .then(response => response.json())
        .then(data => {
            detailData = data;
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
    
    // Обработчики кнопок детализации
    document.addEventListener('click', function(e) {
        if (e.target.closest('.detail-btn')) {
            const btn = e.target.closest('.detail-btn');
            const category = btn.dataset.category;
            const subcategory = btn.dataset.subcategory;
            showDetailView(category, subcategory);
        }
    });
    
    // Кнопка "Назад" в детализации
    document.getElementById('detail-back-btn').addEventListener('click', function() {
        document.getElementById('detail-view').classList.add('hidden');
        document.querySelector('.container').style.display = 'block';
        document.querySelector('.sidebar-toggle').style.display = 'flex';
        
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
    });
    
    // Показать детализацию
    function showDetailView(category, subcategory) {
        const key = `${category};${subcategory}`;
        const data = detailData[key];
        
        if (!data || data.length === 0) {
            alert('Данные для детализации не найдены');
            return;
        }
        
        // Обновляем заголовок
        document.getElementById('detail-title').textContent = 
            `${category} - ${subcategory}`;
        
        // Сортируем данные по дате
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Получаем минимальную и максимальную даты
        const minDate = data[0].date;
        const maxDate = data[data.length - 1].date;
        
        // Устанавливаем диапазон дат
        document.getElementById('min-date').textContent = minDate;
        document.getElementById('max-date').textContent = maxDate;
        document.getElementById('start-date').value = minDate;
        document.getElementById('end-date').value = maxDate;
        
        // Строим график и таблицу
        renderChart(data);
        renderTable(data);
        
        // Показываем блок детализации, скрываем основной контент
        document.getElementById('detail-view').classList.remove('hidden');
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.sidebar-toggle').style.display = 'none';
    }
    
    // Построение графика
    function renderChart(data) {
        const ctx = document.getElementById('detail-chart').getContext('2d');
        
        // Уничтожаем предыдущий график, если есть
        if (currentChart) {
            currentChart.destroy();
        }
        
        // Подготавливаем данные
        const labels = data.map(item => item.date);
        const values = data.map(item => parseFloat(item.value));
        const unit = data[0]?.unit || '';
        
        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Значение (${unit})`,
                    data: values,
                    borderColor: '#5a7ae9',
                    backgroundColor: 'rgba(90, 122, 233, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#5a7ae9',
                    pointBorderWidth: 2,
                    tension: 0.2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Построение таблицы
    function renderTable(data) {
        const tableBody = document.getElementById('detail-table-body');
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.textContent = item.date;
            
            const valueCell = document.createElement('td');
            valueCell.textContent = parseFloat(item.value).toLocaleString('ru-RU');
            
            const unitCell = document.createElement('td');
            unitCell.textContent = item.unit;
            
            row.appendChild(dateCell);
            row.appendChild(valueCell);
            row.appendChild(unitCell);
            
            tableBody.appendChild(row);
        });
    }
    
    // Фильтрация данных по дате
    document.getElementById('apply-filter').addEventListener('click', function() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        const category = document.getElementById('detail-title').textContent.split(' - ')[0];
        const subcategory = document.getElementById('detail-title').textContent.split(' - ')[1];
        const key = `${category};${subcategory}`;
        
        const allData = detailData[key];
        if (!allData) return;
        
        const filteredData = allData.filter(item => {
            return item.date >= startDate && item.date <= endDate;
        });
        
        if (filteredData.length === 0) {
            alert('Нет данных для выбранного диапазона дат');
            return;
        }
        
        // Сортируем отфильтрованные данные
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Обновляем график и таблицу
        renderChart(filteredData);
        renderTable(filteredData);
    });
    