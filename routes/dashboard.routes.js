const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.js');
const db = require('../db/db.js');

router.get('/', verifyToken, (req, res) => {
  const userId = req.user.userId;
  
  const query = `
    SELECT u.first_name, u.last_name, u.role, wl.region, wl.district, wl.work_location
    FROM users u
    LEFT JOIN work_locations wl ON u.work_location_id = wl.id
    WHERE u.user_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching dashboard data:", error.message);
      return res.status(500).send("Error fetching dashboard data: " + error.message);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found.");
    }

    res.json(results[0]);
  });
});

module.exports = router;
