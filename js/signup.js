const signupForm = document.querySelector('#signupForm');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const role = document.querySelector('#role').value; // Captura el rol

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserRegistered = users.find(user => user.email === email);

    if (isUserRegistered) {
        alert('El usuario ya está registrado');
        return;
    }

    users.push({ name, email, password, role }); // Almacena el rol junto con el usuario
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso');
    window.location.href = 'index.html';
});
