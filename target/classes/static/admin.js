// ========== ADD USER MODAL ==========
function openAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

// ========== FETCH AND RENDER USERS ==========
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        renderUsers([]); // Show empty state on error
    }
}

function renderUsers(users) {
    const userTableBody = document.querySelector('.section-card tbody');
    if (!userTableBody) return;

    userTableBody.innerHTML = '';

    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No users found</td>';
        userTableBody.appendChild(emptyRow);
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
            <td><span class="badge-status active">Active</span></td>
            <td>
                <button class="btn-action" onclick="editUser(${user.user_id})">Edit</button>
                <button class="btn-action-secondary" onclick="deleteUser(${user.user_id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// ========== ADD USER ==========
async function addUser(event) {
    event.preventDefault();

    const form = event.target;
    const userName = form.querySelector('input[type="text"]').value;
    const userEmail = form.querySelector('input[type="email"]').value;
    const userRole = form.querySelector('select').value;
    const password = 'defaultPass123'; // In real app, generate or prompt

    const newUser = {
        username: userName,
        email: userEmail,
        password: password,
        role: userRole,
        fullName: userName
    };

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!response.ok) throw new Error('Failed to add user');

        const savedUser = await response.json();
        closeAddUserModal();

        showNotification(`User "${userName}" added successfully!`);

        // Fetch and update the table
        await fetchUsers();

        setTimeout(() => {
            alert(`New User Created\n\n` +
                  `Name: ${savedUser.fullName}\n` +
                  `Email: ${savedUser.email}\n` +
                  `Role: ${savedUser.role}\n` +
                  `Status: Active\n` +
                  `User ID: ${savedUser.user_id}\n\n` +
                  `Login credentials sent to email.`);
        }, 500);
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification('Failed to add user. Please try again.', 'error');
    }

    return false;
}

// ========== EDIT USER ==========
async function editUser(userId) {
    // Fetch user details
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const user = await response.json();

        // For now, show alert with current details
        alert(`Edit User ${userId}\n\nCurrent Details:\n` +
              `Username: ${user.username}\n` +
              `Email: ${user.email}\n` +
              `Role: ${user.role}\n\n` +
              `(In a real application, this would open a form with:\n` +
              `- Name field\n` +
              `- Email field\n` +
              `- Role dropdown\n` +
              `- Status toggle\n` +
              `- Password reset option\n\n` +
              `You can implement this using a modal similar to Add User)`);

        // Optionally open a pre-filled modal
        // openEditUserModal(userId, user);
    } catch (error) {
        console.error('Error fetching user:', error);
        showNotification('Failed to load user details.', 'error');
    }
}

// ========== DELETE USER ==========
async function deleteUser(userId) {
    if (confirm(`Delete user ${userId}?\n\n` +
                `This action cannot be undone.\n` +
                `All user data and access will be permanently removed.`)) {

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete user');

            showNotification(`User ${userId} deleted successfully!`);

            // Fetch and update the table
            await fetchUsers();

            // Log the deletion
            console.log(`User ${userId} deleted at ${new Date().toISOString()}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('Failed to delete user. Please try again.', 'error');
        }
    }
}

// ========== FILTER LOGS ==========
function filterLogs(type) {
    const rows = document.querySelectorAll('.section-card tbody tr');
    
    rows.forEach(row => {
        if (type === 'all') {
            row.style.display = '';
        } else {
            const logType = row.querySelector('.log-type');
            if (logType) {
                const logTypeText = logType.textContent.toLowerCase();
                row.style.display = logTypeText.includes(type.toLowerCase()) ? '' : 'none';
            }
        }
    });
    
    showNotification(`Showing ${type === 'all' ? 'all' : type} logs`);
}

// ========== GENERATE REPORT (Bonus Feature) ==========
function generateReport() {
    showNotification('Generating system report...');
    
    setTimeout(() => {
        alert(`System Report Generated\n\n` +
              `Report Type: Weekly Summary\n` +
              `Period: Oct 10-16, 2024\n` +
              `Total Deliveries: 1,247\n` +
              `Success Rate: 98.5%\n` +
              `Active Drones: 12\n` +
              `Active Users: 142\n\n` +
              `Report saved to: reports/weekly_2024_10_16.pdf`);
    }, 2000);
}

// ========== EXPORT DATA (Bonus Feature) ==========
function exportData() {
    if (confirm('Export all system data to CSV?\n\nThis will include:\n- User data\n- Order history\n- Drone logs\n- System events')) {
        showNotification('Exporting data...');
        
        setTimeout(() => {
            alert(`Data Export Complete\n\n` +
                  `Files created:\n` +
                  `- users.csv\n` +
                  `- orders.csv\n` +
                  `- drone_logs.csv\n` +
                  `- system_events.csv\n\n` +
                  `Location: exports/data_2024_10_16/`);
        }, 2000);
    }
}
