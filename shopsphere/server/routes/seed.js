const { initDB, getDB, saveDB } = require('./models/db');

async function seed() {
  await initDB();
  const db = getDB();
  if (db.products && db.products.length > 0) {
    console.log('Already seeded');
    return;
  }
  db.products = [
    { id: '1', name: 'Wireless Headphones', description: 'Noise cancelling over-ear', price: 199.99, category: 'electronics', rating: 4.7, image: '🎧' },
    { id: '2', name: 'Running Shoes', description: 'Lightweight and comfortable', price: 89.99, category: 'fashion', rating: 4.5, image: '👟' },
    { id: '3', name: 'Smart Watch', description: 'Fitness tracker with heart rate', price: 149.99, category: 'electronics', rating: 4.8, image: '⌚' },
    { id: '4', name: 'Programming Book', description: 'Learn full-stack development', price: 39.99, category: 'books', rating: 4.9, image: '📚' },
    { id: '5', name: 'Coffee Maker', description: 'Drip coffee maker 12-cup', price: 79.99, category: 'home', rating: 4.4, image: '☕' },
    { id: '6', name: 'Yoga Mat', description: 'Non-slip exercise mat', price: 29.99, category: 'sports', rating: 4.6, image: '🧘' },
    { id: '7', name: 'Backpack', description: 'Water-resistant laptop backpack', price: 59.99, category: 'fashion', rating: 4.3, image: '🎒' },
    { id: '8', name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 34.99, category: 'home', rating: 4.5, image: '💡' }
  ];
  db.users = [];
  db.orders = [];
  await saveDB();
  console.log('Seeded products');
}

seed().catch(console.error);