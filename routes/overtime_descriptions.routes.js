// src/routes/overtime_descriptions.routes.js

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

// Fetch all overtime descriptions
router.get('/', (req, res) => {
  const query = 'SELECT * FROM overtime_descriptions';

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching overtime descriptions:", error.message);
      return res.status(500).send("Error fetching overtime descriptions: " + error.message);
    }

    res.json(results);
  });
});

module.exports = router;
