// routes/shift.routes.js

const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

// Create a new shift
router.post('/create', (req, res) => {
  const { date, start_time, end_time, duration, type, apply_by_date } = req.body;

  if (!date || !start_time || !end_time || !duration || !type || !apply_by_date) {
    return res.status(400).send("All fields are required.");
  }

  const query = 'INSERT INTO shifts (date, start_time, end_time, duration, type, apply_by_date) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [date, start_time, end_time, duration, type, apply_by_date];

  db.query(query, values, (error, results) => {
    if (error) {
      return res.status(500).send("Error creating shift: " + error.message);
    }
    res.status(201).send("Shift created successfully!");
  });
});

// Fetch all shifts
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM shifts';
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send("Error fetching shifts: " + error.message);
    }
    res.json(results);
  });
});

module.exports = router;
