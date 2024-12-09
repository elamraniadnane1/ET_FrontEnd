// Mock data for comparison (in a real application, fetch from backend)
const averageUsageData = {
    'default': {
        label: 'Average Household',
        data: [350, 330, 320, 340, 360, 370],
        backgroundColor: 'rgba(155, 89, 182, 0.2)',
        borderColor: 'rgba(155, 89, 182, 1)'
    },
    'filters': {
        'city': {
            'Ifrane': {
                label: 'Ifrane Average',
                data: [400, 390, 380, 370, 390, 400],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)'
            },
            'Fes': {
                label: 'Fes Average',
                data: [300, 310, 305, 295, 290, 300],
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                borderColor: 'rgba(39, 174, 96, 1)'
            },
            'Rabat': {
                label: 'Rabat Average',
                data: [280, 270, 275, 265, 260, 270],
                backgroundColor: 'rgba(241, 196, 15, 0.2)',
                borderColor: 'rgba(241, 196, 15, 1)'
            },
            'Tangier': {
                label: 'Tangier Average',
                data: [350, 340, 330, 320, 310, 300],
                backgroundColor: 'rgba(230, 126, 34, 0.2)',
                borderColor: 'rgba(230, 126, 34, 1)'
            }
            // Add more cities as needed
        },
        'householdSize': {
            '1': {
                label: '1-Person Household',
                data: [250, 240, 230, 235, 240, 245],
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)'
            },
            '2': {
                label: '2-Person Household',
                data: [300, 290, 280, 285, 290, 295],
                backgroundColor: 'rgba(241, 196, 15, 0.2)',
                borderColor: 'rgba(241, 196, 15, 1)'
            },
            '3': {
                label: '3-Person Household',
                data: [350, 340, 330, 335, 340, 345],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)'
            },
            '4': {
                label: '4-Person Household',
                data: [400, 390, 380, 385, 390, 395],
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)'
            },
            '5': {
                label: '5-Person Household',
                data: [450, 440, 430, 435, 440, 445],
                backgroundColor: 'rgba(155, 89, 182, 0.2)',
                borderColor: 'rgba(155, 89, 182, 1)'
            },
            '6': {
                label: '6+ Person Household',
                data: [500, 490, 480, 485, 490, 495],
                backgroundColor: 'rgba(39, 174, 96, 0.2)',
                borderColor: 'rgba(39, 174, 96, 1)'
            }
        },
        'homeType': {
            'apartment': {
                label: 'Apartment Average',
                data: [280, 270, 260, 265, 270, 275],
                backgroundColor: 'rgba(26, 188, 156, 0.2)',
                borderColor: 'rgba(26, 188, 156, 1)'
            },
            'detached': {
                label: 'Detached House Average',
                data: [400, 390, 380, 385, 390, 395],
                backgroundColor: 'rgba(192, 57, 43, 0.2)',
                borderColor: 'rgba(192, 57, 43, 1)'
            },
            'semi-detached': {
                label: 'Semi-Detached House Average',
                data: [350, 340, 330, 335, 340, 345],
                backgroundColor: 'rgba(127, 140, 141, 0.2)',
                borderColor: 'rgba(127, 140, 141, 1)'
            },
            'townhouse': {
                label: 'Townhouse Average',
                data: [320, 310, 300, 305, 310, 315],
                backgroundColor: 'rgba(142, 68, 173, 0.2)',
                borderColor: 'rgba(142, 68, 173, 1)'
            }
            // Add more home types as needed
        }
    }
};

// User's energy usage data (should be fetched from user's actual data)
const userEnergyUsage = [320, 310, 300, 315, 325, 330];

// Example households data
const exampleHouseholds = [
    {
        name: 'The Smith Family',
        location: 'Ifrane',
        householdSize: 4,
        homeType: 'Detached House',
        usage: [410, 400, 390, 395, 400, 405]
    },
    {
        name: 'Apartment Dweller',
        location: 'Fes',
        householdSize: 1,
        homeType: 'Apartment',
        usage: [260, 250, 245, 240, 235, 230]
    },
    {
        name: 'Green Living',
        location: 'Rabat',
        householdSize: 3,
        homeType: 'Townhouse',
        usage: [300, 290, 280, 275, 270, 265]
    },
    {
        name: 'Eco-Friendly Family',
        location: 'Tangier',
        householdSize: 5,
        homeType: 'Semi-Detached House',
        usage: [350, 340, 330, 335, 340, 345]
    }
];

// Initialize variables
let comparisonChart;

// Function to render comparison chart
function renderComparisonChart(comparisonData) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');

    if (comparisonChart) {
        comparisonChart.data.datasets = comparisonData;
        comparisonChart.update();
    } else {
        comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: comparisonData
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Energy Usage (kWh)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Function to generate insights based on comparison
function generateInsights(userData, averageData) {
    const insightsEl = document.getElementById('insights');
    insightsEl.innerHTML = '';

    const userAverage = userData.reduce((a, b) => a + b, 0) / userData.length;
    const comparisonAverage = averageData.reduce((a, b) => a + b, 0) / averageData.length;
    const difference = userAverage - comparisonAverage;
    const percentageDifference = ((difference) / comparisonAverage) * 100;

    const insightTitle = document.createElement('h4');
    insightTitle.textContent = 'Your Usage Compared to Average:';
    insightsEl.appendChild(insightTitle);

    const insightText = document.createElement('p');
    if (difference > 0) {
        insightText.textContent = `Your average energy usage is ${percentageDifference.toFixed(2)}% higher than similar households. Consider exploring our recommendations to reduce your consumption.`;
    } else if (difference < 0) {
        insightText.textContent = `Great job! Your average energy usage is ${Math.abs(percentageDifference).toFixed(2)}% lower than similar households. Keep up the good work!`;
    } else {
        insightText.textContent = 'Your energy usage is on par with similar households.';
    }
    insightsEl.appendChild(insightText);
}

// Function to render example households
function renderExampleHouseholds() {
    const householdsList = document.getElementById('householdsList');
    householdsList.innerHTML = '';

    exampleHouseholds.forEach(household => {
        const li = document.createElement('li');

        const name = document.createElement('h4');
        name.textContent = household.name;

        const details = document.createElement('p');
        details.textContent = `Location: ${household.location}, Household Size: ${household.householdSize}, Home Type: ${household.homeType}`;

        li.appendChild(name);
        li.appendChild(details);

        // Include a button to compare with this household
        const compareButton = document.createElement('button');
        compareButton.textContent = 'Compare with this Household';
        compareButton.addEventListener('click', () => compareWithHousehold(household));
        li.appendChild(compareButton);

        householdsList.appendChild(li);
    });
}

// Function to compare with a selected example household
function compareWithHousehold(household) {
    let comparisonData = [];

    // Add user's data
    comparisonData.push({
        label: 'Your Usage',
        data: userEnergyUsage,
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
    });

    // Add selected household data
    comparisonData.push({
        label: household.name,
        data: household.usage,
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
    });

    // Render the chart
    renderComparisonChart(comparisonData);

    // Generate insights
    generateInsights(userEnergyUsage, household.usage);
}

// Function to perform comparison logic
function performComparison() {
    const location = document.getElementById('location').value;
    const householdSize = document.getElementById('householdSize').value;
    const homeType = document.getElementById('homeType').value;

    let comparisonData = [];

    // Add user's data
    comparisonData.push({
        label: 'Your Usage',
        data: userEnergyUsage,
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
    });

    // Determine comparison datasets based on filters
    let averageDataSet = averageUsageData['default'];

    // Apply filters with priority: Household Size > Home Type > Location
    if (householdSize && averageUsageData['filters']['householdSize'][householdSize]) {
        averageDataSet = averageUsageData['filters']['householdSize'][householdSize];
    } else if (homeType && averageUsageData['filters']['homeType'][homeType]) {
        averageDataSet = averageUsageData['filters']['homeType'][homeType];
    } else if (location && averageUsageData['filters']['city'][location]) {
        averageDataSet = averageUsageData['filters']['city'][location];
    }

    comparisonData.push({
        label: averageDataSet.label,
        data: averageDataSet.data,
        backgroundColor: averageDataSet.backgroundColor,
        borderColor: averageDataSet.borderColor,
        borderWidth: 2,
        fill: false,
        tension: 0.4
    });

    // Render the chart
    renderComparisonChart(comparisonData);

    // Generate insights
    generateInsights(userEnergyUsage, averageDataSet.data);
}

// Handle comparison form submission
document.getElementById('comparisonForm').addEventListener('submit', function (event) {
    event.preventDefault();
    performComparison();
});

// Initial render with default comparison
window.addEventListener('load', () => {
    performComparison();
    renderExampleHouseholds();
});
