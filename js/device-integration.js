// Mock list of connected devices (replace with actual data retrieval)
let connectedDevices = [
    {
        name: 'Smart Meter',
        type: 'smart-meter',
        id: 'SM-123456'
    },
    {
        name: 'Thermostat Living Room',
        type: 'thermostat',
        id: 'TH-654321'
    }
];

// Function to render the list of connected devices
function renderConnectedDevices() {
    const deviceList = document.getElementById('connectedDevices');
    deviceList.innerHTML = '';

    if (connectedDevices.length === 0) {
        const noDevices = document.createElement('p');
        noDevices.textContent = 'No devices connected.';
        deviceList.appendChild(noDevices);
    } else {
        connectedDevices.forEach((device, index) => {
            const li = document.createElement('li');

            const deviceInfo = document.createElement('div');
            deviceInfo.className = 'device-info';
            deviceInfo.innerHTML = `
                <strong>${device.name}</strong>
                <span>Type: ${device.type}</span>
                <span>ID: ${device.id}</span>
            `;

            const deviceActions = document.createElement('div');
            deviceActions.className = 'device-actions';
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeDevice(index));
            deviceActions.appendChild(removeBtn);

            li.appendChild(deviceInfo);
            li.appendChild(deviceActions);

            deviceList.appendChild(li);
        });
    }
}

// Function to handle adding a new device
document.getElementById('addDeviceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const deviceName = document.getElementById('deviceName').value.trim();
    const deviceType = document.getElementById('deviceType').value;
    const deviceID = document.getElementById('deviceID').value.trim();

    // Simple validation
    if (deviceName === '' || deviceType === '' || deviceID === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Add the new device to the list (replace with actual integration logic)
    connectedDevices.push({
        name: deviceName,
        type: deviceType,
        id: deviceID
    });

    alert('Device added successfully!');
    document.getElementById('addDeviceForm').reset();
    renderConnectedDevices();
});

// Function to remove a device
function removeDevice(index) {
    if (confirm('Are you sure you want to remove this device?')) {
        // Remove device from the list (replace with actual removal logic)
        connectedDevices.splice(index, 1);
        renderConnectedDevices();
    }
}

// Initialize
renderConnectedDevices();
