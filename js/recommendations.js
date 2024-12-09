// Sample Recommendations Data
const recommendationsData = [
    {
        id: 1,
        title: 'Install LED Light Bulbs',
        description: 'Replace incandescent bulbs with energy-efficient LED bulbs to reduce electricity consumption.',
        category: 'electricity',
        impact: 'High'
    },
    {
        id: 2,
        title: 'Unplug Idle Electronics',
        description: 'Unplug devices when not in use to prevent phantom energy draw.',
        category: 'behavior',
        impact: 'Medium'
    },
    {
        id: 3,
        title: 'Upgrade to Energy Star Appliances',
        description: 'Replace old appliances with Energy Star certified models to save energy.',
        category: 'appliance',
        impact: 'High'
    },
    {
        id: 4,
        title: 'Fix Leaky Faucets',
        description: 'Repair leaks to conserve water and reduce water heating costs.',
        category: 'water',
        impact: 'Low'
    },
    {
        id: 5,
        title: 'Improve Home Insulation',
        description: 'Enhance insulation to reduce heating and cooling energy usage.',
        category: 'gas',
        impact: 'High'
    },
    {
        id: 6,
        title: 'Adjust Thermostat Settings',
        description: 'Set thermostat to an energy-saving temperature when away from home.',
        category: 'behavior',
        impact: 'Medium'
    },
    {
        id: 7,
        title: 'Use Cold Water for Laundry',
        description: 'Wash clothes in cold water to save energy used for heating.',
        category: 'behavior',
        impact: 'Low'
    },
    {
        id: 8,
        title: 'Install Low-Flow Showerheads',
        description: 'Reduce water usage by installing low-flow fixtures.',
        category: 'water',
        impact: 'Medium'
    },
    {
        id: 9,
        title: 'Regular HVAC Maintenance',
        description: 'Service heating and cooling systems annually for optimal efficiency.',
        category: 'appliance',
        impact: 'Medium'
    },
    {
        id: 10,
        title: 'Plant Shade Trees',
        description: 'Plant trees around your home to reduce cooling costs in summer.',
        category: 'behavior',
        impact: 'Low'
    }
];

// Map impact levels to numerical values for sorting
const impactLevels = {
    'High': 3,
    'Medium': 2,
    'Low': 1
};

// Function to render recommendations
function renderRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    const filterType = document.getElementById('filterType').value;
    const sortOrder = document.getElementById('sortOrder').value;

    // Filter recommendations
    let filteredRecommendations = recommendationsData.filter(rec => {
        return filterType === 'all' || rec.category === filterType;
    });

    // Sort recommendations
    filteredRecommendations.sort((a, b) => {
        const impactA = impactLevels[a.impact];
        const impactB = impactLevels[b.impact];
        return sortOrder === 'high-to-low' ? impactB - impactA : impactA - impactB;
    });

    // Clear current list
    recommendationsList.innerHTML = '';

    // Generate recommendation items
    filteredRecommendations.forEach(rec => {
        const li = document.createElement('li');
        li.setAttribute('data-id', rec.id);

        const title = document.createElement('h3');
        title.textContent = rec.title;

        const description = document.createElement('p');
        description.textContent = rec.description;

        const impact = document.createElement('div');
        impact.className = 'impact';
        impact.textContent = rec.impact + ' Impact';

        const category = document.createElement('div');
        category.className = 'category';
        category.textContent = 'Category: ' + rec.category.charAt(0).toUpperCase() + rec.category.slice(1);

        li.appendChild(title);
        li.appendChild(description);
        li.appendChild(impact);
        li.appendChild(category);

        recommendationsList.appendChild(li);
    });
}

// Event Listeners for Filters
document.getElementById('filterType').addEventListener('change', renderRecommendations);
document.getElementById('sortOrder').addEventListener('change', renderRecommendations);

// Initial Render
renderRecommendations();
