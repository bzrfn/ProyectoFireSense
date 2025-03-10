const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const role = document.querySelector('#role').value; // Captura el rol seleccionado

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Credenciales incorrectas');
        return;
    }

    if (user.role !== role) {
        alert('Rol incorrecto para este usuario');
        return;
    }

    // Redirige según el rol
    if (role === 'administrador') {
        window.location.href = 'admin_dashboard.html';
    } else {
        window.location.href = 'user_dashboard.html';
    }
});
