// Initialize energy usage data array
let energyUsageData = [];

// Handle form submission
document.getElementById('energyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const date = document.getElementById('date').value;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const gas = parseFloat(document.getElementById('gas').value) || 0;
    const water = parseFloat(document.getElementById('water').value) || 0;

    // Validate date
    if (!date) {
        alert('Please select a date.');
        return;
    }

    // Add entry to data array
    energyUsageData.push({
        date: date,
        electricity: electricity,
        gas: gas,
        water: water
    });

    // Reset form
    document.getElementById('energyForm').reset();

    // Update chart and table
    updateChart();
    renderTable();
});

// Render energy usage table
function renderTable() {
    const tbody = document.getElementById('usageTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    energyUsageData.forEach((entry, index) => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(entry.date).toLocaleDateString();
        row.appendChild(dateCell);

        const electricityCell = document.createElement('td');
        electricityCell.textContent = entry.electricity.toFixed(2);
        row.appendChild(electricityCell);

        const gasCell = document.createElement('td');
        gasCell.textContent = entry.gas.toFixed(2);
        row.appendChild(gasCell);

        const waterCell = document.createElement('td');
        waterCell.textContent = entry.water.toFixed(2);
        row.appendChild(waterCell);

        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteEntry(index));
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

// Delete entry
function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        energyUsageData.splice(index, 1);
        updateChart();
        renderTable();
    }
}

// Prepare data for chart
function getChartData() {
    const labels = energyUsageData.map(entry => new Date(entry.date).toLocaleDateString());
    const electricityData = energyUsageData.map(entry => entry.electricity);
    const gasData = energyUsageData.map(entry => entry.gas);
    const waterData = energyUsageData.map(entry => entry.water);

    return {
        labels: labels,
        datasets: [
            {
                label: 'Electricity (kWh)',
                data: electricityData,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Gas (therms)',
                data: gasData,
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Water (gallons)',
                data: waterData,
                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };
}

// Render energy usage chart
let energyChart;
function updateChart() {
    const ctx = document.getElementById('energyUsageChart').getContext('2d');
    const chartData = getChartData();

    if (energyChart) {
        energyChart.data = chartData;
        energyChart.update();
    } else {
        energyChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize
updateChart();
renderTable();
