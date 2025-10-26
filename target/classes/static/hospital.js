document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        renderOrders([]); // Show empty state on error
    }
}

function renderOrders(orders) {
    const recentOrdersTableBody = document.querySelector('.recent-orders-section tbody');
    const trackOrdersTableBody = document.getElementById('trackOrdersTableBody');

    recentOrdersTableBody.innerHTML = '';
    trackOrdersTableBody.innerHTML = '';

    if (orders.length === 0) {
        // Show empty placeholders
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" style="text-align: center; color: #666;">No orders found</td>';
        recentOrdersTableBody.appendChild(emptyRow);

        const emptyTrackRow = document.createElement('tr');
        emptyTrackRow.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No orders to track</td>';
        trackOrdersTableBody.appendChild(emptyTrackRow);
        return;
    }

    orders.forEach(order => {
        // Render recent orders
        const recentRow = document.createElement('tr');
        recentRow.innerHTML = `
            <td>${order.orderId || 'N/A'}</td>
            <td>${order.item || 'N/A'}</td>
            <td>${order.quantity || 'N/A'}</td>
            <td><span class="badge-status ${order.status ? order.status.toLowerCase().replace(' ', '-') : 'unknown'}">${order.status || 'Unknown'}</span></td>
            <td>${order.eta || 'N/A'}</td>
            <td>
                ${order.status !== 'Delivered' ?
                `<button class="btn-action" onclick="openDeliveryConfirmationModal('${order.orderId}')">Confirm</button>` :
                `<button class="btn-action-secondary" onclick="viewReceipt('${order.orderId}')">Receipt</button>`}
            </td>
        `;
        recentOrdersTableBody.appendChild(recentRow);

        // Render track orders
        const trackRow = document.createElement('tr');
        trackRow.setAttribute('data-order-id', order.orderId);
        trackRow.setAttribute('data-status', order.status);
        trackRow.innerHTML = `
            <td>${order.orderId || 'N/A'}</td>
            <td>${order.item || 'N/A'}</td>
            <td><span class="badge-status ${order.status ? order.status.toLowerCase().replace(' ', '-') : 'unknown'}">${order.status || 'Unknown'}</span></td>
            <td>${order.eta || 'N/A'}</td>
            <td class="actions">
                ${order.status !== 'Delivered' ?
                `<button class="btn-action" onclick="trackOnMap('${order.orderId}')">Track</button>
                <button class="btn-action-secondary" onclick="cancelOrder('${order.orderId}')">Cancel</button>` :
                `<button class="btn-action-secondary" onclick="viewReceipt('${order.orderId}')">Receipt</button>`}
            </td>
        `;
        trackOrdersTableBody.appendChild(trackRow);
    });
}

// ========== PLACE ORDER MODAL ==========
function openPlaceOrderModal() {
    document.getElementById('placeOrderModal').style.display = 'block';
}

function closePlaceOrderModal() {
    document.getElementById('placeOrderModal').style.display = 'none';
    document.getElementById('orderForm').reset();
    document.getElementById('bloodGroupSection').style.display = 'none';
}

function updateBloodGroupVisibility() {
    const itemType = document.getElementById('itemType').value;
    const bloodGroupSection = document.getElementById('bloodGroupSection');
    bloodGroupSection.style.display = itemType === 'blood' ? 'block' : 'none';
}

function updateTempValue(value) {
    document.getElementById('tempValue').textContent = value;
}

async function submitOrder(event) {
    event.preventDefault();

    const itemType = document.getElementById('itemType').value;
    const quantity = document.getElementById('quantity').value;
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const bloodGroup = document.getElementById('bloodGroup').value;

    const newOrder = {
        item: itemType === 'blood' ? `Blood (${bloodGroup})` : itemType,
        quantity: `${quantity} Units`,
        urgency: urgency,
        status: 'Preparing',
        eta: '15 mins',
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });

        if (!response.ok) throw new Error('Failed to submit order');

        const savedOrder = await response.json();
        closePlaceOrderModal();
        showNotification(`Order ${savedOrder.orderId} placed successfully! Your ${itemType} will be delivered soon.`);

        // Fetch and update the table with real data
        await fetchOrders();
    } catch (error) {
        console.error('Error submitting order:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }

    return false;
}

// ========== TRACK ORDERS MODAL ==========
function openTrackOrdersModal() {
    document.getElementById('trackOrdersModal').style.display = 'block';
}

function closeTrackOrdersModal() {
    document.getElementById('trackOrdersModal').style.display = 'none';
}

function filterOrders(searchText) {
    const rows = document.querySelectorAll('#trackOrdersTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText.toLowerCase()) ? '' : 'none';
    });
}

function trackOnMap(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order && order.status === 'Delivered') {
        showNotification('This order has already been delivered.', 'info');
        return;
    }
    closeTrackOrdersModal();
    openLiveMapModal();
    showNotification(`Now tracking order ${orderId} on live map`);
}

async function cancelOrder(orderId) {
    if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        try {
            // Find the order ID to get the database ID
            const response = await fetch('/api/orders');
            const orders = await response.json();
            const order = orders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');

            const deleteResponse = await fetch(`/api/orders/${order.id}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) throw new Error('Failed to cancel order');

            showNotification(`Order ${orderId} cancelled successfully!`);
            // Fetch and update the table
            await fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            showNotification('Failed to cancel order. Please try again.', 'error');
        }
    }
}

function viewOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderId === orderId);
    alert(`Order Details for ${orderId}\n\nItem: ${order.item}\nQuantity: ${order.quantity}\nUrgency: High\nStatus: ${order.status}\nTemperature: 4-6°C\nETA: ${order.eta}`);
}

function viewReceipt(orderId) {
    alert(`Receipt for ${orderId}\n\nDelivered: October 16, 2024\nTime: 10:38 AM\nDelivery Drone: DRONE-047\nReceived By: Dr. Sarah Johnson\nCondition: Excellent\nTemperature: 4.5°C`);
}

// ========== LIVE MAP MODAL ==========
function openLiveMapModal() {
    document.getElementById('liveMapModal').style.display = 'block';
    startTelemetryUpdates();
}

function closeLiveMapModal() {
    document.getElementById('liveMapModal').style.display = 'none';
    stopTelemetryUpdates();
}

let telemetryInterval;

function startTelemetryUpdates() {
    // Simulate real-time telemetry updates
    telemetryInterval = setInterval(() => {
        const speed = Math.floor(40 + Math.random() * 10);
        const battery = Math.max(70, parseFloat(document.getElementById('batteryPercent').textContent) - Math.random() * 0.5);
        const altitude = Math.floor(115 + Math.random() * 10);
        const temp = (4 + Math.random()).toFixed(1);
        
        if (document.getElementById('droneSpeed')) {
            document.getElementById('droneSpeed').textContent = speed + ' km/h';
            document.getElementById('batteryPercent').textContent = battery.toFixed(0) + '%';
            document.getElementById('batteryLevel').style.width = battery + '%';
            
            // Change battery color based on level
            const batteryElement = document.getElementById('batteryLevel');
            if (battery < 20) {
                batteryElement.style.background = 'linear-gradient(90deg, #F44336, #E53935)';
            } else if (battery < 50) {
                batteryElement.style.background = 'linear-gradient(90deg, #FFC107, #FFB300)';
            } else {
                batteryElement.style.background = 'linear-gradient(90deg, #4CAF50, #66BB6A)';
            }
        }
    }, 2000);
}

function stopTelemetryUpdates() {
    if (telemetryInterval) {
        clearInterval(telemetryInterval);
    }
}

function refreshTelemetry() {
    showNotification('Telemetry data refreshed successfully!');
}

// ========== DELIVERY CONFIRMATION MODAL ==========
function openDeliveryConfirmationModal(orderId) {
    document.getElementById('deliveryConfirmationModal').style.display = 'block';
    const form = document.querySelector('#deliveryConfirmationModal form');
    form.onsubmit = (event) => confirmDelivery(event, orderId);
}

function closeDeliveryConfirmationModal() {
    document.getElementById('deliveryConfirmationModal').style.display = 'none';
    document.getElementById('otpInput').value = '';
}

function simulateScan() {
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('otpInput').value = otp;
    showNotification('QR Code scanned successfully! OTP populated.');
}

async function confirmDelivery(event, orderId) {
    event.preventDefault();
    const otp = document.getElementById('otpInput').value;

    if (otp.length === 6) {
        try {
            // Find the order to get the database ID
            const response = await fetch('/api/orders');
            const orders = await response.json();
            const order = orders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');

            const updateResponse = await fetch(`/api/orders/${order.id}/status?status=Delivered`, {
                method: 'PUT',
            });

            if (!updateResponse.ok) throw new Error('Failed to confirm delivery');

            closeDeliveryConfirmationModal();
            showNotification('Delivery confirmed successfully! Thank you.');

            // Fetch and update the table
            await fetchOrders();

            setTimeout(() => {
                alert(`Package delivered and confirmed!\n\nOrder ID: ${orderId}\nReceived by: Dr. Sarah Johnson\nTime: ` + new Date().toLocaleTimeString());
            }, 500);
        } catch (error) {
            console.error('Error confirming delivery:', error);
            showNotification('Failed to confirm delivery. Please try again.', 'error');
        }
    } else {
        showNotification('Please enter a valid 6-digit OTP', 'error');
    }

    return false;
}

