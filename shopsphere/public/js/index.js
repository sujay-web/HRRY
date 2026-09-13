let allProducts = [];
let filtered = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'newest';
let page = 1;
const PER_PAGE = 6;

async function loadProducts() {
  try {
    const params = new URLSearchParams();
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (currentSearch) params.set('search', currentSearch);
    if (currentSort) params.set('sort', currentSort);
    allProducts = await api.getProducts('?' + params.toString());
    filtered = allProducts;
    render();
  } catch (err) { toast(err.message, 'error'); }
}

function renderCategories() {
  const cats = ['all', ...new Set(allProducts.map(p => p.category))];
  const chips = document.getElementById('category-chips');
  chips.innerHTML = cats.map(c => `<button class="chip ${c === currentCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');
  chips.querySelectorAll('.chip').forEach(b => b.onclick = () => {
    currentCategory = b.dataset.cat;
    page = 1;
    loadProducts();
  });
}

function render() {
  const grid = document.getElementById('product-grid');
  const start = (page - 1) * PER_PAGE;
  const items = filtered.slice(start, start + PER_PAGE);
  document.getElementById('results-meta').textContent = `${filtered.length} products`;
  if (!items.length) {
    grid.innerHTML = '';
    document.getElementById('empty-state').classList.remove('hidden');
  } else {
    document.getElementById('empty-state').classList.add('hidden');
    grid.innerHTML = items.map(p => `
      <article class="card">
        <div class="card-img">${p.image || '📦'}</div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="desc">${p.description}</p>
          <div class="card-meta"><span class="price">${formatPrice(p.price)}</span><span class="rating">★ ${p.rating}</span></div>
          <button class="btn btn-primary btn-block add-to-cart" data-id="${p.id}">Add to cart</button>
        </div>
      </article>
    `).join('');
    grid.querySelectorAll('.add-to-cart').forEach(b => b.onclick = () => addToCart(b.dataset.id));
  }
  renderPagination();
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderHeader();
  toast(`${product.name} added to cart`);
}

function renderPagination() {
  const total = Math.ceil(filtered.length / PER_PAGE);
  const el = document.getElementById('pagination');
  if (total <= 1) { el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= total; i++) html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  el.innerHTML = html;
  el.querySelectorAll('.page-btn').forEach(b => b.onclick = () => { page = +b.dataset.page; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sort-select').onchange = e => { currentSort = e.target.value; page = 1; loadProducts(); };
  document.getElementById('reset-filters').onclick = () => { currentCategory = 'all'; currentSearch = ''; currentSort = 'newest'; document.getElementById('sort-select').value = 'newest'; page = 1; loadProducts(); };
  loadProducts().then(renderCategories);
});