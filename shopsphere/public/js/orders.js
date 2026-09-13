document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('orders-list');
  const token = localStorage.getItem('token');
  if (!token) { list.innerHTML = '<p>Please <a href="login.html">login</a> to see orders.</p>'; return; }
  try {
    const orders = await api.getOrders();
    if (!orders.length) { list.innerHTML = '<p>No orders yet.</p>'; return; }
    list.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-head"><strong>Order #${o.id.slice(-6)}</strong><span class="status ${o.status}">${o.status}</span></div>
        <div class="order-items">${o.items.map(i => `<div>${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}</div>`).join('')}</div>
        <div class="order-total">Total: ${formatPrice(o.total)}</div>
      </div>
    `).join('');
  } catch (err) { list.innerHTML = `<p class="error">${err.message}</p>`; }
});