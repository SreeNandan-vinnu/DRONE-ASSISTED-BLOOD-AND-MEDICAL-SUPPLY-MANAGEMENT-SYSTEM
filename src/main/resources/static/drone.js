// ========== FETCH AND RENDER DRONES ==========
document.addEventListener('DOMContentLoaded', () => {
    fetchDrones();
});

async function fetchDrones() {
    try {
        const response = await fetch('/api/drones');
        if (!response.ok) throw new Error('Failed to fetch drones');
        const drones = await response.json();
        // Store for later use
        window.drones = drones;
    } catch (error) {
        console.error('Error fetching drones:', error);
        window.drones = []; // Empty array on error
    }
}

// ========== MONITOR DRONE ==========
async function monitorDrone(droneId) {
    // Find drone from fetched data
    const drone = window.drones ? window.drones.find(d => d.id == droneId) : null;

    if (drone) {
        alert(`Monitoring ${droneId}\n\n` +
              `Model: ${drone.model || 'Unknown'}\n` +
              `Status: ${drone.status || 'Unknown'}\n` +
              `Battery Capacity: ${drone.batteryCapacity || 'N/A'} mAh\n` +
              `Mission: Blood Delivery\n` +
              `Destination: City General Hospital\n` +
              `Battery: 78%\n` +
              `Speed: 45 km/h\n` +
              `Altitude: 120m\n` +
              `Temperature: 4.5°C\n` +
              `ETA: 5 minutes\n\n` +
              `All systems nominal.`);
    } else {
        alert(`Drone ${droneId} not found or data unavailable.`);
    }
}

// ========== ASSIGN MISSION ==========
async function assignMission(droneId) {
    if (confirm(`Assign new mission to ${droneId}?`)) {
        try {
            // Update drone status to 'In Mission' or similar
            const updateResponse = await fetch(`/api/drones/${droneId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'In Mission' }),
            });

            if (!updateResponse.ok) throw new Error('Failed to update drone status');

            const missions = [
                'Blood delivery to Regional Hospital',
                'Insulin delivery to Memorial Medical',
                'Vaccine transport to City Clinic',
                'Emergency medicine to Rural Health Center'
            ];

            const randomMission = missions[Math.floor(Math.random() * missions.length)];

            showNotification(`Mission assigned to ${droneId}: ${randomMission}`);

            setTimeout(() => {
                alert(`Mission Details:\n\n` +
                      `Drone: ${droneId}\n` +
                      `Mission: ${randomMission}\n` +
                      `Priority: Medium\n` +
                      `Estimated Duration: 15 minutes\n` +
                      `Pre-flight checks: Required`);
            }, 500);
        } catch (error) {
            console.error('Error assigning mission:', error);
            showNotification('Failed to assign mission. Please try again.', 'error');
        }
    }
}

// ========== LAUNCH DRONE ==========
function launchDrone() {
    if (confirm('Launch drone for current mission?\n\nPre-flight checks must be completed.')) {
        showNotification('Drone launched successfully! Mission in progress...');
        
        setTimeout(() => {
            alert('Launch Successful!\n\n' +
                  'Drone: DRONE-047\n' +
                  'Status: Airborne\n' +
                  'Altitude: 50m (climbing)\n' +
                  'Speed: 25 km/h (accelerating)\n' +
                  'Battery: 100%\n\n' +
                  'Mission commenced at ' + new Date().toLocaleTimeString());
        }, 1000);
    }
}

// ========== ABORT MISSION ==========
function abortMission() {
    if (confirm('⚠️ ABORT CURRENT MISSION?\n\n' +
                'This will terminate the ongoing mission and return the drone to base.\n\n' +
                'This action should only be taken in emergency situations.')) {
        
        showNotification('Mission aborted! Drone returning to base...', 'error');
        
        setTimeout(() => {
            alert('Mission Aborted\n\n' +
                  'Drone Status: Returning to base\n' +
                  'Payload: Secured\n' +
                  'ETA to base: 8 minutes\n' +
                  'Battery: 65%\n\n' +
                  'Incident report required.');
        }, 1000);
    }
}

// ========== RETURN HOME ==========
function returnHome() {
    if (confirm('Return drone to base?\n\nCurrent mission will be marked as complete.')) {
        showNotification('Drone returning to home base!');
        
        setTimeout(() => {
            alert('Return to Base Initiated\n\n' +
                  'Drone: DRONE-047\n' +
                  'Current Position: 2.5 km from base\n' +
                  'ETA: 6 minutes\n' +
                  'Battery: 78%\n' +
                  'Flight Mode: AUTO RETURN\n\n' +
                  'Landing sequence will commence automatically.');
        }, 1000);
    }
}

// ========== AUTO-UPDATE TELEMETRY (Optional Enhancement) ==========
// Uncomment this if you want auto-updating telemetry on the drone operator page
/*
setInterval(() => {
    const elements = {
        lat: document.getElementById('lat'),
        speed: document.getElementById('speed'),
        battery: document.getElementById('battery')
    };
    
    if (elements.speed) {
        // Simulate changing values
        const newSpeed = Math.floor(40 + Math.random() * 15);
        elements.speed.textContent = newSpeed + ' km/h';
        
        const newBattery = Math.max(65, 78 - Math.random() * 2);
        elements.battery.textContent = newBattery.toFixed(0) + '%';
    }
}, 3000);
*/
