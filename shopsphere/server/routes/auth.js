const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, saveDB } = require('../models/db');
const { SECRET } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const db = getDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hash };
  db.users.push(user);
  await saveDB();
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;