const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');
let db = { users: [], products: [], orders: [] };

async function initDB() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const data = await fs.readFile(DB_PATH, 'utf8');
    db = JSON.parse(data);
  } catch (err) {
    await saveDB();
  }
}

async function saveDB() {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

function getDB() { return db; }

module.exports = { initDB, saveDB, getDB };