const express = require('express');
const { getDB } = require('../models/db');
const router = express.Router();

router.get('/', (req, res) => {
  const db = getDB();
  let products = db.products || [];
  const { category, search, sort } = req.query;
  if (category && category !== 'all') products = products.filter(p => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (sort) {
    switch (sort) {
      case 'price_asc': products.sort((a,b) => a.price - b.price); break;
      case 'price_desc': products.sort((a,b) => b.price - a.price); break;
      case 'rating': products.sort((a,b) => b.rating - a.rating); break;
      case 'name': products.sort((a,b) => a.name.localeCompare(b.name)); break;
      default: products.sort((a,b) => b.id - a.id);
    }
  }
  res.json(products);
});

router.get('/:id', (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

module.exports = router;