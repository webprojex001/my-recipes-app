// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render provides this
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper: basic matching count
function countMatches(recipeIngredients, userIngredients) {
  const ri = recipeIngredients.map(i => i.toLowerCase());
  return userIngredients.reduce((acc, u) => acc + (ri.some(r => r.includes(u)) ? 1 : 0), 0);
}

app.get('/recipes', async (req, res) => {
  try {
    const q = req.query.ingredients || '';
    const userIngredients = q.split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0);

    if (userIngredients.length === 0) {
      // default: return a few recipes
      const { rows } = await pool.query('SELECT id, name, ingredients, instructions, image FROM recipes LIMIT 10;');
      return res.json(rows);
    }

    // Query recipes that have at least one overlapping ingredient
    // We pass a text[] parameter to Postgres
    const { rows } = await pool.query(
      'SELECT id, name, ingredients, instructions, image FROM recipes WHERE ingredients && $1::text[];',
      [userIngredients]
    );

    // Compute matches locally & sort
    const results = rows.map(r => {
      return {
        ...r,
        matches: countMatches(r.ingredients, userIngredients)
      };
    }).sort((a,b) => b.matches - a.matches);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server berjalan di port ${port}`));
