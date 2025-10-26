function createSidebar(role) {
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';

    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'sidebar-header';

    const sidebarIcon = document.createElement('i');
    const sidebarTitle = document.createElement('h3');

    let iconClass = 'fas fa-question-circle';
    let titleText = 'Dashboard';

    switch (role) {
        case 'admin':
            iconClass = 'fas fa-cog';
            titleText = 'Admin Panel';
            break;
        case 'distribution':
            iconClass = 'fas fa-warehouse';
            titleText = 'Distribution';
            break;
        case 'drone':
            iconClass = 'fas fa-drone';
            titleText = 'Drone Ops';
            break;
        case 'hospital':
            iconClass = 'fas fa-heartbeat';
            titleText = 'MedDrone';
            break;
    }

    sidebarIcon.className = iconClass;
    sidebarTitle.textContent = titleText;

    sidebarHeader.appendChild(sidebarIcon);
    sidebarHeader.appendChild(sidebarTitle);

    const navMenu = document.createElement('ul');
    navMenu.className = 'nav-menu';

    let navItems = [];

    switch (role) {
        case 'admin':
            navItems = [
                { icon: 'fa-tachometer-alt', text: 'Overview', active: true },
                { icon: 'fa-users', text: 'Users' },
                { icon: 'fa-chart-bar', text: 'Reports' },
                { icon: 'fa-file-alt', text: 'Logs' },
                { icon: 'fa-sign-out-alt', text: 'Logout', href: 'index.html' },
            ];
            break;
        case 'distribution':
            navItems = [
                { icon: 'fa-home', text: 'Dashboard', active: true },
                { icon: 'fa-clipboard-check', text: 'Orders' },
                { icon: 'fa-boxes', text: 'Inventory' },
                { icon: 'fa-bell', text: 'Notifications', badge: 5 },
                { icon: 'fa-sign-out-alt', text: 'Logout', href: 'index.html' },
            ];
            break;
        case 'drone':
            navItems = [
                { icon: 'fa-home', text: 'Control Center', active: true },
                { icon: 'fa-list', text: 'Missions' },
                { icon: 'fa-chart-line', text: 'Analytics' },
                { icon: 'fa-bell', text: 'Alerts', badge: 2 },
                { icon: 'fa-sign-out-alt', text: 'Logout', href: 'index.html' },
            ];
            break;
        case 'hospital':
            navItems = [
                { icon: 'fa-home', text: 'Dashboard', active: true },
                { icon: 'fa-box', text: 'My Orders' },
                { icon: 'fa-map', text: 'Live Tracking' },
                { icon: 'fa-bell', text: 'Notifications', badge: 3 },
                { icon: 'fa-cog', text: 'Settings' },
                { icon: 'fa-sign-out-alt', text: 'Logout', href: 'index.html' },
            ];
            break;
    }

    navItems.forEach(item => {
        const li = document.createElement('li');
        if (item.active) {
            li.className = 'active';
        }

        const a = document.createElement('a');
        a.href = item.href || '#';

        const icon = document.createElement('i');
        icon.className = `fas ${item.icon}`;

        a.appendChild(icon);
        a.appendChild(document.createTextNode(` ${item.text}`));

        if (item.badge) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = item.badge;
            a.appendChild(badge);
        }

        li.appendChild(a);
        navMenu.appendChild(li);
    });

    sidebar.appendChild(sidebarHeader);
    sidebar.appendChild(navMenu);

    return sidebar;
}

function createHeader(role, username) {
    const header = document.createElement('header');
    header.className = 'dashboard-header';

    const title = document.createElement('h1');
    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';

    let titleText = 'Dashboard';
    let welcomeText = `Welcome, <strong>${username}</strong>`;

    switch (role) {
        case 'admin':
            titleText = 'System Administration';
            welcomeText = `Admin: <strong>${username}</strong>`;
            break;
        case 'distribution':
            titleText = 'Distribution Center - Operator Panel';
            welcomeText = `Welcome, <strong>${username}</strong>`;
            break;
        case 'drone':
            titleText = 'Drone Operations Control';
            welcomeText = `Operator: <strong>${username}</strong>`;
            break;
        case 'hospital':
            titleText = 'Hospital Dashboard';
            welcomeText = `Welcome, <strong id="userName">${username}</strong>`;
            break;
    }

    title.textContent = titleText;

    const currentTime = document.createElement('span');
    currentTime.className = 'current-time';
    currentTime.id = 'currentTime';

    const welcome = document.createElement('span');
    welcome.className = 'welcome-text';
    welcome.innerHTML = welcomeText;

    headerRight.appendChild(currentTime);
    headerRight.appendChild(welcome);

    if (role === 'hospital') {
        const notificationIcon = document.createElement('div');
        notificationIcon.className = 'notification-icon';
        notificationIcon.innerHTML = '<i class="fas fa-bell"></i><span class="notification-badge">3</span>';
        headerRight.appendChild(notificationIcon);
    }

    header.appendChild(title);
    header.appendChild(headerRight);

    return header;
}
