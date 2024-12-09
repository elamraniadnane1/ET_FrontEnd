// Update Date and Time
function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Sample Energy Usage Data
const energyData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        label: 'Energy Usage (kWh)',
        data: [400, 380, 350, 370, 390, 360],
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2
    }]
};

// Render Energy Usage Chart
const ctx = document.getElementById('energyChart').getContext('2d');
const energyChart = new Chart(ctx, {
    type: 'line',
    data: energyData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Generate Recommendations
function generateRecommendations() {
    const recommendationsEl = document.getElementById('recommendations-list');
    recommendationsEl.innerHTML = '';

    // Sample recommendations
    const recommendations = [
        'Consider installing energy-efficient light bulbs.',
        'Unplug devices when not in use to save standby energy.',
        'Schedule energy-intensive tasks during off-peak hours.',
        'Upgrade to Energy Star certified appliances.',
        'Improve home insulation to reduce heating and cooling costs.'
    ];

    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsEl.appendChild(li);
    });
}

// Initialize
generateRecommendations();
