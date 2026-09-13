document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  document.getElementById('show-register').onclick = (e) => { e.preventDefault(); loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); };

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const data = await api.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast('Logged in');
      setTimeout(() => location.href = 'index.html', 800);
    } catch (err) { toast(err.message, 'error'); }
  };

  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    try {
      const data = await api.register({ name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast('Account created');
      setTimeout(() => location.href = 'index.html', 800);
    } catch (err) { toast(err.message, 'error'); }
  };
});