// Mock user goals data (this should be fetched from the backend in a real application)
let userGoals = [
    {
        id: 1,
        type: 'reduce-usage',
        target: 10,
        unit: '%',
        duration: 1, // in months
        startDate: '2023-04-01',
        progress: 40 // in percentage
    },
    {
        id: 2,
        type: 'reduce-cost',
        target: 50,
        unit: '$',
        duration: 3,
        startDate: '2023-03-15',
        progress: 25
    }
];

// Map goal types to units
const goalUnits = {
    'reduce-usage': '%',
    'reduce-cost': '$',
    'reduce-carbon': 'kg CO₂'
};

// Function to update the unit label based on selected goal type
document.getElementById('goalType').addEventListener('change', function () {
    const goalType = this.value;
    const unitLabel = document.getElementById('unitLabel');
    unitLabel.textContent = goalType ? `Target in ${goalUnits[goalType]}` : '';
});

// Handle goal form submission
document.getElementById('goalForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const goalType = document.getElementById('goalType').value;
    const goalTarget = parseFloat(document.getElementById('goalTarget').value);
    const goalDuration = parseInt(document.getElementById('goalDuration').value);

    // Simple validation
    if (!goalType || isNaN(goalTarget) || isNaN(goalDuration)) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    // Create new goal (replace with actual API call)
    const newGoal = {
        id: Date.now(),
        type: goalType,
        target: goalTarget,
        unit: goalUnits[goalType],
        duration: goalDuration,
        startDate: new Date().toISOString().split('T')[0],
        progress: 0 // Initial progress
    };

    userGoals.push(newGoal);
    alert('Goal set successfully!');
    document.getElementById('goalForm').reset();
    document.getElementById('unitLabel').textContent = '';
    renderGoalsList();
    updateProgressChart();
});

// Function to render the list of current goals
function renderGoalsList() {
    const goalsList = document.getElementById('goalsList');
    goalsList.innerHTML = '';

    if (userGoals.length === 0) {
        const noGoals = document.createElement('p');
        noGoals.textContent = 'You have not set any goals yet.';
        goalsList.appendChild(noGoals);
    } else {
        userGoals.forEach((goal, index) => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';

            const goalDetails = document.createElement('div');
            goalDetails.className = 'goal-details';

            const goalTypeText = {
                'reduce-usage': 'Reduce Energy Usage',
                'reduce-cost': 'Reduce Energy Cost',
                'reduce-carbon': 'Reduce Carbon Footprint'
            };

            goalDetails.innerHTML = `
                <strong>${goalTypeText[goal.type]}</strong>
                <p>Target: ${goal.target}${goal.unit} over ${goal.duration} month(s)</p>
                <p>Start Date: ${new Date(goal.startDate).toLocaleDateString()}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${goal.progress}%;">${goal.progress}%</div>
                </div>
            `;

            const goalActions = document.createElement('div');
            goalActions.className = 'goal-actions';

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteGoal(index));
            goalActions.appendChild(deleteBtn);

            goalItem.appendChild(goalDetails);
            goalItem.appendChild(goalActions);

            goalsList.appendChild(goalItem);
        });
    }
}

// Function to delete a goal
function deleteGoal(index) {
    if (confirm('Are you sure you want to delete this goal?')) {
        userGoals.splice(index, 1);
        renderGoalsList();
        updateProgressChart();
    }
}

// Function to update the progress chart
function updateProgressChart() {
    const ctx = document.getElementById('goalsProgressChart').getContext('2d');
    const goalLabels = userGoals.map(goal => {
        const goalTypeText = {
            'reduce-usage': 'Usage',
            'reduce-cost': 'Cost',
            'reduce-carbon': 'Carbon'
        };
        return `${goalTypeText[goal.type]} (${goal.target}${goal.unit})`;
    });
    const goalProgressData = userGoals.map(goal => goal.progress);

    if (window.goalsChart) {
        window.goalsChart.data.labels = goalLabels;
        window.goalsChart.data.datasets[0].data = goalProgressData;
        window.goalsChart.update();
    } else {
        window.goalsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: goalLabels,
                datasets: [{
                    label: 'Progress (%)',
                    data: goalProgressData,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Goals'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Progress (%)'
                        }
                    }
                }
            }
        });
    }
}

// Initialize
renderGoalsList();
updateProgressChart();
