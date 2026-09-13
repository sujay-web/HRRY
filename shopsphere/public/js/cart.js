document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('cart-summary');
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) {
      container.innerHTML = '<p>Your cart is empty. <a href="index.html">Go shopping</a></p>';
      summary.classList.add('hidden');
      return;
    }
    summary.classList.remove('hidden');
    container.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-img">${i.image || '📦'}</div>
        <div class="cart-info"><h3>${i.name}</h3><p>${formatPrice(i.price)}</p></div>
        <div class="cart-qty">
          <button class="qty-btn" data-id="${i.id}" data-d="-1">−</button>
          <span>${i.quantity}</span>
          <button class="qty-btn" data-id="${i.id}" data-d="1">+</button>
        </div>
        <div class="cart-total">${formatPrice(i.price * i.quantity)}</div>
        <button class="btn-link remove" data-id="${i.id}">✕</button>
      </div>
    `).join('');
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(subtotal);

    container.querySelectorAll('.qty-btn').forEach(b => b.onclick = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = cart.find(i => i.id === b.dataset.id);
      if (!item) return;
      item.quantity += +b.dataset.d;
      if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart(); renderHeader();
    });
    container.querySelectorAll('.remove').forEach(b => b.onclick = () => {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.filter(i => i.id !== b.dataset.id);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart(); renderHeader();
    });
  }

  document.getElementById('checkout-btn').onclick = async () => {
    const token = localStorage.getItem('token');
    if (!token) { toast('Please login first', 'error'); return location.href = 'login.html'; }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) return;
    try {
      await api.createOrder({ items: cart, shipping: { name: 'Demo User', address: '123 Main St' } });
      localStorage.removeItem('cart');
      toast('Order placed!');
      setTimeout(() => location.href = 'orders.html', 800);
    } catch (err) { toast(err.message, 'error'); }
  };

  renderCart();
});