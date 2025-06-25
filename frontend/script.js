const API = 'http://localhost:3000/api/auth';

async function register() {
  const first_name = document.getElementById('reg_name').value;
  const email = document.getElementById('reg_email').value;
  const password = document.getElementById('reg_password').value;
  const role = document.getElementById('reg_role').value;

  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, email, password, role })
  });

  const data = await res.json();
  document.getElementById('message').textContent = data.message || 'OK';
}

async function login() {
  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;

  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    const tokenData = parseJwt(data.token);
    localStorage.setItem('user', JSON.stringify(tokenData));
    window.location = 'dashboard.html';
  } else {
    document.getElementById('message').textContent = data.message || 'Помилка';
  }
}

function parseJwt(token) {
  const base64 = token.split('.')[1];
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

