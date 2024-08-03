const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

// Fetch all work locations
router.get('/', (req, res) => {
  const query = 'SELECT * FROM work_locations';

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching work locations:", error.message);
      return res.status(500).send("Error fetching work locations: " + error.message);
    }

    res.json(results);
  });
});

module.exports = router;
