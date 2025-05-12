require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 3000;

// === MySQL Connection
console.log('\n=== ENV CHECK ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  multipleStatements: false
});

db.connect((err) => {
  if (err) {
    console.error('MySQL CONNECTION FAILED:', err.message || err);
    process.exit(1);
  }
  console.log('✔️ Connected to MySQL database.');
});

// === GET SERVICES ===
app.get('/api/services', (req, res) => {
  const { location, category, searchTerm } = req.query;

  let query = 'SELECT * FROM neighborly1 WHERE 1=1';
  const params = [];

  if (location) {
    query += ' AND LOWER(city) = ?';
    params.push(location.toLowerCase().trim());
  }

  if (category) {
    query += ' AND LOWER(category) LIKE ?';
    params.push(`%${category.toLowerCase().trim()}%`);
  }

  if (searchTerm) {
    const likeTerm = `%${searchTerm.toLowerCase().trim()}%`;
    query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
    params.push(likeTerm, likeTerm);
  }

  console.log('\n=== FINAL SQL ===\n', query);
  console.log('Params:', params);

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('\n❌ DATABASE ERROR:', err);
      return res.status(500).json({
        error: 'Database query failed.',
        sql: query,
        params,
        message: err.message,
        sqlMessage: err.sqlMessage,
        stack: err.stack
      });
    }

    console.log(`✔️ Returned ${results.length} services`);
    res.json(results);
  });
});

// === SUBMIT SERVICE ===
app.post('/api/submit', (req, res) => {
  const allowedCategories = [
    'food assistance',
    'housing',
    'legal aid',
    'employment services',
    'health care',
    'education',
    'mental health',
    'seniors care',
    'child care',
    'entertainment',
    'indigenous services'
  ];

  const {
    city, region, name, category, description,
    address, contact, url, website, hours, latitude, longitude
  } = req.body;

  // === CATEGORY SAFETY CHECK
  if (!allowedCategories.includes((category || '').toLowerCase())) {
    return res.status(400).json({ error: 'Invalid category submitted.' });
  }

  const query = `
    INSERT INTO neighborly1
    (city, region, name, category, description, address, contact, url, website, hours, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    city?.trim().toLowerCase() || null,
    region?.trim().toLowerCase() || null,
    name?.trim().toLowerCase() || null,
    category?.trim().toLowerCase() || null,
    description?.trim() || null,
    address?.trim().toLowerCase() || null,
    contact?.trim() || null,
    url?.trim() || null,
    website?.trim() || null,
    hours?.trim() || null,
    parseFloat(latitude) || null,
    parseFloat(longitude) || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ INSERT FAILED:', err.message);
      console.error('SQL:', err.sqlMessage);
      console.error('Stack:', err.stack);

      const errorResponse = {
        error: 'Insert failed.',
        message: err.message,
        sqlMessage: err.sqlMessage,
        stack: err.stack
      };

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Duplicate entry.' });
      }

      return res.status(500).json(errorResponse);
    }

    console.log('✔️ Inserted service successfully.');
    res.status(200).json({ message: 'Service submitted successfully.' });
  });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`\n✔️ Neighborly server running at http://localhost:${PORT}`);
});