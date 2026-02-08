// Data Initialization
const EXAMPLE_DATA = {
    users: [
       
    ],
    categories: [
      
    ],
    products: [
      
    ],
    orders: [
  
    ]
};

// Initialize LocalStorage if empty
function initData() {
    if (!localStorage.getItem('admin_users')) {
        localStorage.setItem('admin_users', JSON.stringify(EXAMPLE_DATA.users));
    }
    if (!localStorage.getItem('admin_categories')) {
        localStorage.setItem('admin_categories', JSON.stringify(EXAMPLE_DATA.categories));
    }
    if (!localStorage.getItem('admin_products')) {
        localStorage.setItem('admin_products', JSON.stringify(EXAMPLE_DATA.products));
    }
    if (!localStorage.getItem('admin_orders')) {
        localStorage.setItem('admin_orders', JSON.stringify(EXAMPLE_DATA.orders));
    }
    if (!localStorage.getItem('admin_auth_users')) {
        localStorage.setItem('admin_auth_users', JSON.stringify([]));
    }
}

// Auth Functions
function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('admin_auth_users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('User already exists');
        return false;
    }
    users.push({ name, email, password });
    localStorage.setItem('admin_auth_users', JSON.stringify(users));
    return true;
}

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('admin_auth_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        return true;
    }
    // Backdoor for demo
    if (email === 'admin@admin.com' && password === 'admin') {
         localStorage.setItem('current_user', JSON.stringify({ name: 'Super Admin', email: 'admin@admin.com' }));
         return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('current_user');
    window.location.href = 'login.html';
}

// function //checkauth() {
//     const user = localStorage.getItem('current_user');
//     if (!user && !window.location.href.includes('login.html') && !window.location.href.includes('signup.html')) {
//         window.location.href = 'login.html';
//     }
//     if (user && (window.location.href.includes('login.html') || window.location.href.includes('signup.html'))) {
//         window.location.href = 'dashboard.html';
//     }
// }

// Helper: Get Data
function getData(key) {
    return JSON.parse(localStorage.getItem(`admin_${key}`) || '[]');
}

// Helper: Save Data
function setData(key, data) {
    localStorage.setItem(`admin_${key}`, JSON.stringify(data));
}

// Sidebar HTML
function getSidebar() {
    const pathname = window.location.pathname;
    const items = [
        { name: 'Dashboard', href: 'dashboard.html' },
        { name: 'Categories', href: 'categories.html' },
        { name: 'Products', href: 'products.html' },
        { name: 'Orders', href: 'orders.html' },
        { name: 'Users', href: 'users.html' }
    ];

    return `
        <div class="sidebar">
            <div class="logo">⚡ AdminPro</div>
            ${items.map(item => `
                <a href="${item.href}" class="nav-item ${pathname.includes(item.href) ? 'active' : ''}">
                    ${item.name}
                </a>
            `).join('')}
            <button onclick="logout()" class="nav-item logout-btn">Logout</button>
        </div>
    `;
}

// Init everything
initData();
