// Dashboard Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupEventListeners();
    loadUserPreferences();
});


// Main Initialization Function
const initializeDashboard = async () => {
    try {
        console.log('Initializing date and time...');
        updateDateTime();

        console.log('Loading weather data...');
        await loadWeatherData();

        console.log('Initializing charts...');
        initializeCharts();

        console.log('Updating device status...');
        updateDeviceStatus();

        console.log('Checking system alerts...');
        checkSystemAlerts();

        console.log('Updating user info...');
        updateUserInfo();

        console.log('Loading notifications...');
        loadNotifications();

        console.log('Loading activity feed...');
        loadActivityFeed();

        console.log('Setting up periodic updates...');
        setInterval(updateDateTime, 60000); // Update time every minute
        setInterval(loadWeatherData, 900000); // Update weather every 15 minutes
        setInterval(updateDeviceStatus, 300000); // Update device status every 5 minutes
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showToast('Error initializing dashboard', 'error');
    }
};


// Device State Management
const deviceStates = {
    ac: {
        id: 'ac',
        name: 'Smart AC',
        power: true,
        temperature: 22,
        mode: 'cool',
        energy: 2.4
    },
    lights: {
        id: 'lights',
        name: 'Smart Lights',
        power: true,
        brightness: 80,
        zone: 'all',
        energy: 0.8
    },
    waterHeater: {
        id: 'waterHeater',
        name: 'Water Heater',
        power: true,
        temperature: 60,
        mode: 'eco',
        energy: 1.6
    },
    evCharger: {
        id: 'evCharger',
        name: 'EV Charger',
        power: false,
        connected: false,
        chargingMode: 'fast',
        energy: 0
    },
    smartFridge: {
        id: 'smartFridge',
        name: 'Smart Fridge',
        power: true,
        temperature: 4,
        mode: 'normal',
        energy: 1.2
    }
};

// Device Control Functions
const toggleDevice = (deviceId) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    device.power = !device.power;
    updateDeviceUI(deviceId);
    logActivity(`${device.name} turned ${device.power ? 'on' : 'off'}`);
    showToast(`${device.name} ${device.power ? 'enabled' : 'disabled'}`, 'success');

    calculateEnergyConsumption(deviceId);
};

const adjustTemperature = (deviceId, direction) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    const step = direction === 'increase' ? 1 : -1;
    let minTemp, maxTemp;

    if (deviceId === 'ac') {
        minTemp = 16;
        maxTemp = 30;
    } else if (deviceId === 'waterHeater') {
        minTemp = 40;
        maxTemp = 80;
    }

    const newTemp = device.temperature + step;
    if (newTemp >= minTemp && newTemp <= maxTemp) {
        device.temperature = newTemp;
        updateDeviceUI(deviceId);
        logActivity(`${device.name} temperature set to ${newTemp}°C`);

        checkTemperatureEfficiency(deviceId, newTemp);
    }
};

const adjustFridgeTemperature = (direction) => {
    const device = deviceStates['smartFridge'];
    if (!device) return;

    const step = direction === 'increase' ? 1 : -1;
    const minTemp = 1;
    const maxTemp = 7;

    const newTemp = device.temperature + step;
    if (newTemp >= minTemp && newTemp <= maxTemp) {
        device.temperature = newTemp;
        updateDeviceUI('smartFridge');
        logActivity(`${device.name} temperature set to ${newTemp}°C`);
        calculateEnergyConsumption('smartFridge');
    }
};

const adjustBrightness = () => {
    const device = deviceStates['lights'];
    if (!device) return;

    const brightnessSlider = document.getElementById('brightness');
    const newBrightness = parseInt(brightnessSlider.value);
    device.brightness = newBrightness;

    const brightnessDisplay = document.querySelector('.brightness-value');
    if (brightnessDisplay) {
        brightnessDisplay.textContent = `${newBrightness}%`;
    }

    calculateEnergyConsumption('lights');
    logActivity(`${device.name} brightness set to ${newBrightness}%`);
};

const changeZone = () => {
    const device = deviceStates['lights'];
    if (!device) return;

    const zoneSelect = document.getElementById('lightingZone');
    const newZone = zoneSelect.value;
    device.zone = newZone;

    updateDeviceUI('lights');
    logActivity(`${device.name} zone changed to ${newZone}`);
};

const changeMode = (deviceId) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    const modeSelect = document.getElementById(`${deviceId}Mode`);
    const newMode = modeSelect.value;
    device.mode = newMode;

    updateDeviceUI(deviceId);
    logActivity(`${device.name} mode changed to ${newMode}`);
};

// Device UI Updates
const updateDeviceUI = (deviceId) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    const deviceCard = document.querySelector(`[data-device="${deviceId}"]`);
    if (!deviceCard) return;

    // Update power state
    const powerBtn = deviceCard.querySelector('.power-btn');
    if (powerBtn) {
        powerBtn.classList.toggle('active', device.power);
    }

    // Update temperature display
    if (device.temperature !== undefined) {
        const tempDisplay = deviceCard.querySelector('.temp-display span');
        if (tempDisplay) {
            tempDisplay.textContent = `${device.temperature}°C`;
        }
    }

    // Update brightness display
    if (device.brightness !== undefined) {
        const brightnessDisplay = deviceCard.querySelector('.brightness-value');
        if (brightnessDisplay) {
            brightnessDisplay.textContent = `${device.brightness}%`;
        }
    }

    // Update energy consumption
    const energyDisplay = deviceCard.querySelector('.energy-value');
    if (energyDisplay) {
        energyDisplay.textContent = `${device.energy.toFixed(1)} kWh`;
    }

    // Update status indicator
    const statusIndicator = deviceCard.querySelector('.status');
    if (statusIndicator) {
        statusIndicator.className = `status ${device.power ? 'online' : 'offline'}`;
        statusIndicator.textContent = device.power ? 'Online' : 'Offline';
    }
};

// Energy Calculations
const calculateEnergyConsumption = (deviceId) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    const baseConsumption = {
        ac: 2.0,
        lights: 0.5,
        waterHeater: 1.5,
        evCharger: 7.0,
        smartFridge: 1.0
    };

    let consumption = baseConsumption[deviceId];

    if (!device.power) {
        consumption = 0;
    } else {
        // Apply modifiers based on device settings
        switch (deviceId) {
            case 'ac':
                consumption *= (device.temperature - 18) * 0.05 + 1;
                break;
            case 'lights':
                consumption *= device.brightness / 100;
                break;
            case 'waterHeater':
                consumption *= (device.temperature - 50) * 0.02 + 1;
                break;
            case 'evCharger':
                consumption *= device.chargingMode === 'fast' ? 1.5 : 1;
                break;
            case 'smartFridge':
                consumption *= (7 - device.temperature) * 0.1 + 1;
                break;
        }
    }

    device.energy = consumption;
    updateTotalEnergyConsumption();
};

// Update Total Energy Consumption
const updateTotalEnergyConsumption = () => {
    const totalEnergy = Object.values(deviceStates).reduce((total, device) => total + device.energy, 0);
    document.querySelector('.overview-card .value').textContent = `${totalEnergy.toFixed(1)} kWh`;
};

// Charts Initialization
let usageChart, breakdownChart;

const initializeCharts = () => {
    initializeUsageChart();
    initializeBreakdownChart();
    updateChartData();
};

const initializeUsageChart = () => {
    const ctx = document.getElementById('usageTrendChart').getContext('2d');

    usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [] // Datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { drawBorder: false }
                }
            }
        }
    });
};

const initializeBreakdownChart = () => {
    const ctx = document.getElementById('usageBreakdownChart').getContext('2d');

    breakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['AC', 'Lights', 'Water Heater', 'EV Charger', 'Smart Fridge'],
            datasets: [{
                data: [], // Energy consumption data
                backgroundColor: ['#3498db', '#f1c40f', '#e67e22', '#9b59b6', '#1abc9c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
};

// Update Chart Data
const updateChartData = () => {
    const timeRange = document.querySelector('.time-btn.active').dataset.range;
    const usageData = generateUsageData(timeRange);
    const breakdownData = generateBreakdownData();

    // Update usage trend chart
    updateUsageChart(usageData);

    // Update breakdown chart based on the selected time range
    updateBreakdownChart(breakdownData);
};

const updateUsageChart = (data) => {
    if (!usageChart) return;

    usageChart.data.labels = data.map(d => d.time);
    usageChart.data.datasets = [
        {
            label: 'Total Usage (kWh)',
            data: data.map(d => d.usage),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true
        },
        {
            label: 'Solar Generation (kWh)',
            data: data.map(d => d.solar),
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            tension: 0.4,
            fill: true
        }
    ];

    usageChart.update();
};

const updateBreakdownChart = (data) => {
    if (!breakdownChart) return;

    breakdownChart.data.datasets[0].data = data;
    breakdownChart.update();
};

// Generate Mock Data for Charts
const generateUsageData = (timeRange) => {
    const data = [];
    const now = new Date();
    let points;

    switch (timeRange) {
        case 'day':
            points = 24;
            for (let i = 0; i < points; i++) {
                data.push({
                    time: `${i}:00`,
                    usage: Math.random() * 2 + 1,
                    solar: Math.random() * 1
                });
            }
            break;
        case 'week':
            points = 7;
            for (let i = 0; i < points; i++) {
                data.push({
                    time: moment(now).subtract(6 - i, 'days').format('ddd'),
                    usage: Math.random() * 15 + 5,
                    solar: Math.random() * 8
                });
            }
            break;
        case 'month':
            points = 30;
            for (let i = 0; i < points; i++) {
                data.push({
                    time: `${i + 1}`,
                    usage: Math.random() * 50 + 20,
                    solar: Math.random() * 25
                });
            }
            break;
        case 'year':
            points = 12;
            for (let i = 0; i < points; i++) {
                data.push({
                    time: moment(now).month(i).format('MMM'),
                    usage: Math.random() * 500 + 200,
                    solar: Math.random() * 250
                });
            }
            break;
    }

    return data;
};

const generateBreakdownData = () => {
    const acEnergy = deviceStates.ac.energy;
    const lightsEnergy = deviceStates.lights.energy;
    const waterHeaterEnergy = deviceStates.waterHeater.energy;
    const evChargerEnergy = deviceStates.evCharger.energy;
    const fridgeEnergy = deviceStates.smartFridge.energy;

    return [acEnergy, lightsEnergy, waterHeaterEnergy, evChargerEnergy, fridgeEnergy];
};

// Weather Integration
const loadWeatherData = async () => {
    try {
        const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
        if (!apiKey) {
            console.error('Weather API key is missing');
            showToast('Weather API key is not configured.', 'error');
            return;
        }

        const city = 'Ifrane';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        updateWeatherWidget(data);
        adjustDeviceRecommendations(data);
    } catch (error) {
        console.error('Error loading weather data:', error);
        showToast('Unable to update weather information', 'error');
    }
};


const updateWeatherWidget = (data) => {
    const temperature = Math.round(data.main.temp);
    const condition = data.weather[0].main.toLowerCase();
    const location = data.name;
    const description = data.weather[0].description;

    const iconMap = {
        clear: 'sun',
        clouds: 'cloud',
        rain: 'cloud-rain',
        snow: 'snowflake',
        thunderstorm: 'bolt',
        drizzle: 'cloud-drizzle',
        mist: 'smog'
    };

    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('location').textContent = location;
    document.getElementById('weatherDescription').textContent = description;

    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.className = `fas fa-${iconMap[condition] || 'sun'}`;
};

// Scheduling System
const scheduleDevice = (deviceId) => {
    const device = deviceStates[deviceId];
    if (!device) return;

    const modal = document.getElementById('scheduleModal');
    const selectedDevice = document.getElementById('selectedDevice');
    selectedDevice.textContent = device.name;

    modal.dataset.deviceId = deviceId;
    modal.style.display = 'block';
};

const saveSchedule = () => {
    const modal = document.getElementById('scheduleModal');
    const deviceId = modal.dataset.deviceId;
    const device = deviceStates[deviceId];

    if (!device) return;

    const schedule = {
        startTime: document.getElementById('scheduleStart').value,
        endTime: document.getElementById('scheduleEnd').value,
        repeat: document.getElementById('scheduleRepeat').value,
        mode: document.getElementById('scheduleMode').value,
        active: true
    };

    device.schedule = schedule;
    logActivity(`Schedule set for ${device.name}`);
    showToast('Schedule saved successfully', 'success');
    closeModal();
};

// Activity Logging and Notifications
const activityLog = [];

const logActivity = (activity) => {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <span class="activity-text">${activity}</span>
        <span class="activity-time">${formatTime(new Date())}</span>
    `;

    activityList.insertBefore(activityItem, activityList.firstChild);
    activityLog.push({ activity, timestamp: new Date() });

    if (activityList.children.length > 50) {
        activityList.removeChild(activityList.lastChild);
    }
};

const loadActivityFeed = () => {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    activityList.innerHTML = '';
    activityLog.slice(-50).reverse().forEach(entry => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-text">${entry.activity}</span>
            <span class="activity-time">${formatTime(entry.timestamp)}</span>
        `;
        activityList.appendChild(activityItem);
    });
};

const notifications = [];

const createNotification = (notification) => {
    notifications.push(notification);
    updateNotifications();
};

const loadNotifications = () => {
    updateNotifications();
};

const updateNotifications = () => {
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;

    notificationsList.innerHTML = '';
    notifications.slice(-5).reverse().forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.type}`;
        notificationItem.innerHTML = `
            <div class="notification-content">
                <span class="notification-title">${notification.title}</span>
                <p class="notification-message">${notification.message}</p>
                <span class="notification-time">${formatTime(notification.timestamp)}</span>
            </div>
            <button class="dismiss-btn" onclick="dismissNotification(${notification.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        notificationsList.appendChild(notificationItem);
    });
};

const dismissNotification = (id) => {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
        notifications.splice(index, 1);
        updateNotifications();
    }
};

// Utility Functions
// Example: Check if element exists before updating
const updateDateTime = () => {
    const dateTimeElement = document.getElementById('currentDateTime');
    if (!dateTimeElement) {
        console.error('DateTime element not found!');
        return;
    }
    dateTimeElement.textContent = moment().format('LLLL');
};

const formatTime = (date) => {
    return moment(date).format('h:mm A');
};

const closeModal = () => {
    document.getElementById('scheduleModal').style.display = 'none';
};

const showToast = (message, type = 'info') => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
};

// Event Listeners Setup
const setupEventListeners = () => {
    // Time range buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
    
            // Update both usage and breakdown charts
            updateChartData();
        });
    });
    
    // Export button
    document.getElementById('exportDataBtn')?.addEventListener('click', exportData);

    // Schedule button
    document.getElementById('scheduleBtn')?.addEventListener('click', () => {
        document.getElementById('scheduleModal').style.display = 'block';
    });

    // Modal close button
    document.querySelector('.close-btn')?.addEventListener('click', closeModal);

    // Window click for modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('scheduleModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Language selector
    document.getElementById('languageSelect')?.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    // Device controls
    document.querySelectorAll('.power-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const deviceId = e.target.closest('.device-card').dataset.device;
            toggleDevice(deviceId);
        });
    });

    document.querySelectorAll('.temp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const deviceId = e.target.closest('.device-card').dataset.device;
            const direction = e.target.classList.contains('fa-plus') ? 'increase' : 'decrease';
            adjustTemperature(deviceId, direction);
        });
    });

    document.getElementById('brightness')?.addEventListener('input', adjustBrightness);
    document.getElementById('lightingZone')?.addEventListener('change', changeZone);
    document.getElementById('acMode')?.addEventListener('change', () => changeMode('ac'));
    document.getElementById('waterHeaterMode')?.addEventListener('change', () => changeMode('waterHeater'));
};

// User Preferences
const loadUserPreferences = () => {
    const userName = localStorage.getItem('loggedInUser')
        ? JSON.parse(localStorage.getItem('loggedInUser')).username
        : 'User';

    document.getElementById('userName').textContent = userName;
    document.getElementById('userNameDisplay').textContent = userName;
};

// Update User Info
const updateUserInfo = () => {
    // Fetch and display user info if needed
};

// System Alerts
const checkSystemAlerts = () => {
    // Check for system alerts or notifications
};

const collectExportData = () => {
    const devices = Object.values(deviceStates).map(device => ({
        id: device.id,
        name: device.name,
        power: device.power,
        temperature: device.temperature || '',
        brightness: device.brightness || '',
        mode: device.mode || '',
        energy: device.energy
    }));
    const activities = activityLog.map(entry => ({
        activity: entry.activity,
        timestamp: entry.timestamp.toISOString()
    }));

    const data = {
        devices,
        activities,
        totalEnergy: document.querySelector('.overview-card .value').textContent
    };

    return data;
};


// Export Data Function
// Implement Export Data Function
const exportData = () => {
    try {
        const data = collectExportData();
        const csvContent = convertToCSV(data);
        downloadCSV(csvContent, 'dashboard_data.csv');
        showToast('Data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showToast('Error exporting data', 'error');
    }
};

const convertToCSV = (data) => {
    let csv = 'Category,Data\n';
    csv += 'Total Energy,' + data.totalEnergy + '\n\n';

    csv += 'Devices\n';
    csv += 'ID,Name,Power,Temperature,Brightness,Mode,Energy\n';
    data.devices.forEach(device => {
        csv += `${device.id},${device.name},${device.power},${device.temperature},${device.brightness},${device.mode},${device.energy}\n`;
    });

    csv += '\nActivities\n';
    csv += 'Activity,Timestamp\n';
    data.activities.forEach(activity => {
        csv += `"${activity.activity}",${activity.timestamp}\n`;
    });

    return csv;
};

const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Language Change Function
const changeLanguage = (language) => {
    // Implement language change functionality
    showToast(`Language changed to ${language}`, 'info');
};

// Real-time Data Management System
class RealTimeMonitor {
    constructor() {
        this.updateInterval = null; // To hold the interval ID
        this.isLiveUpdating = true;
        this.gauges = new Map();
        this.charts = new Map();
        this.lastReadings = new Map();
        this.alerts = [];
        
        this.initialize();
    }

    initialize() {
        this.initializePowerQualityCharts();
        this.initializeDemandGauge();
        this.initializeSolarChart();
        this.startLiveUpdates();
        this.setupEventListeners();
    }

    startLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            if (this.isLiveUpdating) {
                this.updatePowerQuality();
                this.updateSolarProduction();
                this.updateBatteryStorage();
                this.updatePredictions();
            }
        }, 5000);
    }

    toggleLiveUpdates() {
        this.isLiveUpdating = !this.isLiveUpdating;
        const statusElem = document.querySelector('.update-status');
        const pauseBtn = document.querySelector('.pause-btn i');

        if (this.isLiveUpdating) {
            statusElem.textContent = 'Updating live...';
            pauseBtn.className = 'fas fa-pause';
            this.updateAllMetrics();
        } else {
            statusElem.textContent = 'Updates paused';
            pauseBtn.className = 'fas fa-play';
        }
    }

    // ... include all methods from both class definitions ...

    // Ensure updatePredictions calls updatePredictionCards
    updatePredictions() {
        const predictions = this.generatePredictions();
        this.updatePredictionCards(predictions);
    }

    updatePredictionCards(predictions) {
        document.getElementById('predictedUsage').textContent = predictions.dailyUsage.toFixed(1) + ' kWh';
        document.getElementById('predictedPeakTime').textContent = predictions.peakTime + ':00';
        document.getElementById('savingsPotential').textContent = predictions.savingsPotential.toFixed(1) + '%';
        document.getElementById('predictionConfidence').textContent = predictions.confidence.toFixed(1) + '%';
    }
}

// Initialize Real-time Monitor
const realTimeMonitor = new RealTimeMonitor();

// Export for global access
window.realTimeMonitor = realTimeMonitor;
