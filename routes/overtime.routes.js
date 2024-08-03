const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const verifyToken = require('../middleware/auth.js');
const roleCheck = require('../middleware/roleCheck.js');

// Fetch all overtime offers
router.get('/offers', verifyToken, (req, res) => {
  const query = 'SELECT * FROM overtime_offers';

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching overtime offers:", error.message);
      return res.status(500).send("Error fetching overtime offers: " + error.message);
    }
    res.json(results);
  });
});

// Create an overtime offer
router.post('/create-offer', verifyToken, roleCheck('admin'), (req, res) => {
  const { description_id, date, start_time, end_time, region, district, work_location, instances } = req.body;

  if (!description_id || !date || !start_time || !end_time || !region || !district || !work_location || !instances) {
    return res.status(400).send("All fields are required.");
  }

  const offers = [];
  for (let i = 0; i < instances; i++) {
    offers.push([description_id, date, start_time, end_time, region, district, work_location]);
  }

  const query = 'INSERT INTO overtime_offers (description_id, date, start_time, end_time, region, district, work_location) VALUES ?';

  db.query(query, [offers], (error, results) => {
    if (error) {
      console.error("Error creating overtime offer:", error.message);
      return res.status(500).send("Error creating overtime offer: " + error.message);
    }
    res.status(201).send("Overtime offer(s) created successfully!");
  });
});

// Express interest in an overtime offer
router.post('/express-interest', verifyToken, (req, res) => {
  const { offer_id } = req.body;
  const user_id = req.user.userId;

  if (!offer_id) {
    return res.status(400).send("Offer ID is required.");
  }

  const query = 'INSERT INTO overtime_interests (user_id, offer_id) VALUES (?, ?)';

  db.query(query, [user_id, offer_id], (error, results) => {
    if (error) {
      console.error("Error expressing interest in overtime offer:", error.message);
      return res.status(500).send("Error expressing interest in overtime offer: " + error.message);
    }
    res.status(201).send("Interest expressed successfully!");
  });
});

// Remove interest in an overtime offer
router.post('/remove-interest', verifyToken, (req, res) => {
  const { offer_id } = req.body;
  const user_id = req.user.userId;

  if (!offer_id) {
    return res.status(400).send("Offer ID is required.");
  }

  const query = 'DELETE FROM overtime_interests WHERE user_id = ? AND offer_id = ?';

  db.query(query, [user_id, offer_id], (error, results) => {
    if (error) {
      console.error("Error removing interest in overtime offer:", error.message);
      return res.status(500).send("Error removing interest in overtime offer: " + error.message);
    }
    res.status(200).send("Interest removed successfully!");
  });
});

// Update an overtime offer
router.put('/update-offer/:id', verifyToken, roleCheck('admin'), (req, res) => {
  const { id } = req.params;
  const { description_id, date, start_time, end_time, region, district, work_location } = req.body;

  if (!description_id || !date || !start_time || !end_time || !region || !district || !work_location) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    UPDATE overtime_offers 
    SET description_id = ?, date = ?, start_time = ?, end_time = ?, region = ?, district = ?, work_location = ? 
    WHERE id = ?
  `;

  db.query(query, [description_id, date, start_time, end_time, region, district, work_location, id], (error, results) => {
    if (error) {
      console.error("Error updating overtime offer:", error.message);
      return res.status(500).send("Error updating overtime offer: " + error.message);
    }
    res.status(200).send("Overtime offer updated successfully!");
  });
});

// Fetch a single overtime offer
router.get('/offer/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM overtime_offers WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error fetching overtime offer:", error.message);
      return res.status(500).send("Error fetching overtime offer: " + error.message);
    }
    if (results.length === 0) {
      return res.status(404).send("Overtime offer not found.");
    }
    res.json(results[0]);
  });
});

module.exports = router;
