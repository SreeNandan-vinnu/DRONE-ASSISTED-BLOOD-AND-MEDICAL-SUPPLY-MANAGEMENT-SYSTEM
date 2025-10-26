// ========== ROLE SELECTION ==========
function selectRole(role) {
    localStorage.setItem('selectedRole', role);
    window.location.href = 'login.html';
}

// ========== LOGIN HANDLER ==========
async function handleLogin(event) {
    event.preventDefault();
    const role = localStorage.getItem('selectedRole') || 'hospital';
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username && password) {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const user = await response.json();
                // Store user data in localStorage or session
                localStorage.setItem('username', user.username);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.user_id);

                // Redirect based on role
                switch(user.role) {
                    case 'hospital':
                        window.location.href = 'hospital.html';
                        break;
                    case 'distribution':
                        window.location.href = 'distribution.html';
                        break;
                    case 'drone':
                        window.location.href = 'drone.html';
                        break;
                    case 'admin':
                        window.location.href = 'admin.html';
                        break;
                    default:
                        window.location.href = 'hospital.html';
                }
            } else {
                showNotification('Invalid username or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
        }
    }
    return false;
}

// ========== SIGN UP HANDLER ==========
async function handleSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return false;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'error');
        return false;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                email,
                fullName: name,
                role: 'hospital' // default role
            }),
        });

        if (response.ok) {
            const user = await response.json();
            showNotification('Account created successfully! Please login.');
            showLogin();
        } else {
            const error = await response.text();
            showNotification(error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }

    return false;
}

// ========== TOGGLE BETWEEN LOGIN AND SIGN UP ==========
function showSignUp() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signUpFormContainer').style.display = 'block';
}

function showLogin() {
    document.getElementById('signUpFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
}

// ========== DISPLAY ROLE ON LOGIN PAGE ==========
window.addEventListener('DOMContentLoaded', () => {
    // Display selected role on login page
    if (document.getElementById('roleDisplay')) {
        const role = localStorage.getItem('selectedRole') || 'hospital';
        const roleNames = {
            'hospital': 'Hospital Staff',
            'distribution': 'Distribution Center Operator',
            'drone': 'Drone Operator',
            'admin': 'System Administrator'
        };
        document.getElementById('roleDisplay').textContent = roleNames[role];
    }
    
    // Display username on dashboard
    if (document.getElementById('userName')) {
        const username = localStorage.getItem('username') || 'User';
        document.getElementById('userName').textContent = username;
    }
});

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== SORT TABLE ==========
function sortTable(columnIndex) {
    const table = event.target.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return aText.localeCompare(bText);
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// ========== CLOSE MODAL ON OUTSIDE CLICK ==========
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
