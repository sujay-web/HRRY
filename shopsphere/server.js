const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./server/models/db');
const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`ShopSphere running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to init DB', err);
  process.exit(1);
});