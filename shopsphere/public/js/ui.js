function renderHeader() {
  const header = document.getElementById('app-header');
  if (!header) return;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  header.innerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="logo">🛍️ ShopSphere</a>
        <nav>
          <a href="index.html">Shop</a>
          <a href="orders.html">Orders</a>
          <a href="cart.html" class="cart-link">Cart <span class="badge">${count}</span></a>
          ${user ? `<span class="user">Hi, ${user.name}</span><button class="btn-link" id="logout-btn">Logout</button>` : `<a href="login.html" class="btn btn-outline btn-sm">Login</a>`}
        </nav>
      </div>
    </header>
  `;
  const logout = document.getElementById('logout-btn');
  if (logout) logout.onclick = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); location.reload(); };
}

function renderFooter() {
  const footer = document.getElementById('app-footer');
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container">© ${new Date().getFullYear()} ShopSphere. All rights reserved.</div></footer>`;
}

function toast(msg, type = 'success') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function formatPrice(n) { return '$' + Number(n).toFixed(2); }

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});