// ========== FETCH AND RENDER ORDERS ==========
document.addEventListener('DOMContentLoaded', () => {
    fetchPendingOrders();
});

async function fetchPendingOrders() {
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const orders = await response.json();
        // Filter for pending orders (not delivered)
        const pendingOrders = orders.filter(order => order.status !== 'Delivered');
        renderPendingOrders(pendingOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        renderPendingOrders([]); // Show empty state on error
    }
}

function renderPendingOrders(orders) {
    const orderTableBody = document.querySelector('tbody'); // Assuming it's the main table
    if (!orderTableBody) return;

    orderTableBody.innerHTML = '';

    if (orders.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No pending orders</td>';
        orderTableBody.appendChild(emptyRow);
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId || 'N/A'}</td>
            <td>${order.item || 'N/A'}</td>
            <td>${order.quantity || 'N/A'}</td>
            <td>${order.status || 'N/A'}</td>
            <td>
                <button class="btn-action" onclick="approveOrder('${order.orderId}', this)">Approve</button>
                <button class="btn-action-secondary" onclick="rejectOrder('${order.orderId}', this)">Reject</button>
            </td>
        `;
        orderTableBody.appendChild(row);
    });
}

// ========== APPROVE ORDER ==========
async function approveOrder(orderId, button) {
    try {
        // Find the order to get the database ID
        const response = await fetch('/api/orders');
        const orders = await response.json();
        const order = orders.find(o => o.orderId === orderId);
        if (!order) throw new Error('Order not found');

        // Update status to 'Approved' or similar
        const updateResponse = await fetch(`/api/orders/${order.id}/status?status=Approved`, {
            method: 'PUT',
        });

        if (!updateResponse.ok) throw new Error('Failed to approve order');

        // Generate payload ID
        const date = new Date();
        const payloadId = 'PLD-' +
                         date.getFullYear() + '-' +
                         String(date.getMonth() + 1).padStart(2, '0') +
                         String(date.getDate()).padStart(2, '0') + '-' +
                         String(Math.floor(Math.random() * 1000)).padStart(3, '0');

        // Update modal content
        document.getElementById('approvedOrderId').textContent = orderId;
        document.getElementById('payloadId').textContent = payloadId;
        document.getElementById('approvalModal').style.display = 'block';

        // Remove row from table after 2 seconds
        setTimeout(() => {
            button.closest('tr').remove();
            showNotification(`Order ${orderId} approved and queued for dispatch!`);
        }, 2000);
    } catch (error) {
        console.error('Error approving order:', error);
        showNotification('Failed to approve order. Please try again.', 'error');
    }
}

function closeApprovalModal() {
    document.getElementById('approvalModal').style.display = 'none';
}

// ========== REJECT ORDER ==========
async function rejectOrder(orderId, button) {
    if (confirm(`Are you sure you want to reject order ${orderId}?\n\nThis action cannot be undone.`)) {
        try {
            // Find the order to get the database ID
            const response = await fetch('/api/orders');
            const orders = await response.json();
            const order = orders.find(o => o.orderId === orderId);
            if (!order) throw new Error('Order not found');

            // Update status to 'Rejected'
            const updateResponse = await fetch(`/api/orders/${order.id}/status?status=Rejected`, {
                method: 'PUT',
            });

            if (!updateResponse.ok) throw new Error('Failed to reject order');

            button.closest('tr').remove();
            showNotification(`Order ${orderId} has been rejected.`, 'error');
        } catch (error) {
            console.error('Error rejecting order:', error);
            showNotification('Failed to reject order. Please try again.', 'error');
        }
    }
}

// ========== ADD STOCK MODAL ==========
function openAddStockModal() {
    document.getElementById('addStockModal').style.display = 'block';
}

function closeAddStockModal() {
    document.getElementById('addStockModal').style.display = 'none';
}

function addStock(event) {
    event.preventDefault();
    closeAddStockModal();
    showNotification('Stock added successfully to inventory!');
    
    // Optionally refresh inventory display here
    return false;
}

// ========== CHECKLIST FOR PAYLOAD ==========
function checkAllCompleted() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const dispatchBtn = document.getElementById('dispatchBtn');
    if (dispatchBtn) {
        dispatchBtn.disabled = !allChecked;
        
        if (allChecked) {
            dispatchBtn.style.opacity = '1';
            dispatchBtn.style.cursor = 'pointer';
        } else {
            dispatchBtn.style.opacity = '0.5';
            dispatchBtn.style.cursor = 'not-allowed';
        }
    }
}

// ========== READY FOR DISPATCH ==========
function readyForDispatch() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    if (allChecked) {
        showNotification('Package ready for dispatch! Notifying drone operator...');
        
        // Simulate dispatch process
        setTimeout(() => {
            alert('Dispatch Successful!\n\nPackage ID: PKG-2024-1016-001\nAssigned Drone: DRONE-052\nEstimated Departure: 2 minutes');
            
            // Reset checklist
            checkboxes.forEach(cb => cb.checked = false);
            checkAllCompleted();
        }, 1500);
    } else {
        showNotification('Please complete all checklist items before dispatching.', 'error');
    }
}

// Initialize checklist on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('dispatchBtn')) {
        checkAllCompleted();
    }
});
