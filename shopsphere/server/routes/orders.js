const express = require('express');
const { getDB, saveDB } = require('../models/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { items, shipping } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'No items' });
  const db = getDB();
  const order = {
    id: Date.now().toString(),
    userId: req.user.id,
    items,
    shipping,
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  await saveDB();
  res.status(201).json(order);
});

router.get('/', auth, (req, res) => {
  const db = getDB();
  const orders = db.orders.filter(o => o.userId === req.user.id);
  res.json(orders);
});

module.exports = router;