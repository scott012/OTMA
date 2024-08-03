const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db.js');
const verifyToken = require('../middleware/auth.js');

const SECRET_KEY = "your_generated_secret_key"; // Replace with your generated secret key

// Register a new user
router.post('/register', async (req, res) => {
  console.log("Register endpoint hit");
  const { username, password, email, role, continuous_service_date, region, district, work_location, first_name, last_name } = req.body;

  if (!username || !password || !email || !role || !region || !district || !work_location || !first_name || !last_name) {
    console.log("Missing required fields");
    return res.status(400).send("All fields are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the work location exists, if not, insert it
    const locationQuery = 'SELECT id FROM work_locations WHERE region = ? AND district = ? AND work_location = ?';
    const locationValues = [region, district, work_location];

    db.query(locationQuery, locationValues, (error, results) => {
      if (error) {
        console.error("Error querying work location:", error.message);
        return res.status(500).send("Error querying work location: " + error.message);
      }

      let workLocationId;
      if (results.length > 0) {
        workLocationId = results[0].id;
        insertUser(workLocationId);
      } else {
        const insertLocationQuery = 'INSERT INTO work_locations (region, district, work_location) VALUES (?, ?, ?)';
        db.query(insertLocationQuery, locationValues, (error, results) => {
          if (error) {
            console.error("Error inserting work location:", error.message);
            return res.status(500).send("Error inserting work location: " + error.message);
          }
          workLocationId = results.insertId;
          insertUser(workLocationId);
        });
      }
    });

    function insertUser(workLocationId) {
      const query = 'INSERT INTO users (username, password, email, role, continuous_service_date, work_location_id, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [username, hashedPassword, email, role, continuous_service_date, workLocationId, first_name, last_name];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error("Error registering user:", error.message);
          return res.status(500).send("Error registering user: " + error.message);
        }
        console.log("User registered successfully");
        res.status(201).send("User registered successfully!");
      });
    }

  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).send("Error registering user: " + error.message);
  }
});

// User login
router.post('/login', (req, res) => {
  console.log("Login endpoint hit");
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing required fields");
    return res.status(400).send("All fields are required.");
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (error, results) => {
    if (error) {
      console.error("Error logging in:", error.message);
      return res.status(500).send("Error logging in: " + error.message);
    }

    if (results.length === 0) {
      console.log("User not found");
      return res.status(400).send("User not found.");
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Incorrect password");
      return res.status(400).send("Incorrect password.");
    }

    const token = jwt.sign({ userId: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    console.log("Login successful");
    res.json({ token });
  });
});


// Retrieve employee details
router.get('/employee/:id', verifyToken, (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT u.username, u.email, u.role, u.continuous_service_date, u.first_name, u.last_name, wl.region, wl.district, wl.work_location, ch.hours, ch.date
    FROM users u
    LEFT JOIN work_locations wl ON u.work_location_id = wl.id
    LEFT JOIN charged_hours ch ON u.user_id = ch.user_id
    WHERE u.user_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving employee details:", error.message);
      return res.status(500).send("Error retrieving employee details: " + error.message);
    }

    if (results.length === 0) {
      return res.status(404).send("Employee not found.");
    }

    res.json(results[0]);
  });
});

// Modify employee's charged hours
router.post('/modify-charged-hours', verifyToken, (req, res) => {
  console.log("Modify charged hours endpoint hit");
  const { userId } = req.body;

  if (!userId) {
    console.log("Missing required fields");
    return res.status(400).send("All fields are required.");
  }

  // Get the user's work location
  const userQuery = 'SELECT work_location_id FROM users WHERE user_id = ?';
  db.query(userQuery, [userId], (error, results) => {
    if (error) {
      console.error("Error querying user:", error.message);
      return res.status(500).send("Error querying user: " + error.message);
    }

    if (results.length === 0) {
      console.log("User not found");
      return res.status(400).send("User not found.");
    }

    const workLocationId = results[0].work_location_id;

    // Calculate the average charged hours for the work location
    const avgHoursQuery = 'SELECT AVG(hours) AS avg_hours FROM charged_hours WHERE work_location_id = ?';
    db.query(avgHoursQuery, [workLocationId], (error, results) => {
      if (error) {
        console.error("Error calculating average hours:", error.message);
        return res.status(500).send("Error calculating average hours: " + error.message);
      }

      const avgHours = results[0].avg_hours;

      // Update the user's charged hours to the average hours
      const updateHoursQuery = 'INSERT INTO charged_hours (user_id, work_location_id, hours, date) VALUES (?, ?, ?, CURDATE())';
      const updateValues = [userId, workLocationId, avgHours];
      db.query(updateHoursQuery, updateValues, (error, results) => {
        if (error) {
          console.error("Error updating charged hours:", error.message);
          return res.status(500).send("Error updating charged hours: " + error.message);
        }

        console.log("Charged hours updated successfully");
        res.status(200).send("Charged hours updated successfully");
      });
    });
  });
});

// Fetch all employees
router.get('/employees', verifyToken, (req, res) => {
  const query = `
    SELECT u.user_id, u.username, u.email, u.role, u.continuous_service_date, u.first_name, u.last_name, wl.region, wl.district, wl.work_location
    FROM users u
    LEFT JOIN work_locations wl ON u.work_location_id = wl.id;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching employees:", error.message);
      return res.status(500).send("Error fetching employees: " + error.message);
    }

    res.json(results);
  });
});

// Fetch recent activities for the logged-in user
router.get('/recent-activities', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT activity_description
    FROM user_activities
    WHERE user_id = ?
    ORDER BY activity_date DESC
    LIMIT 10;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching recent activities:", error.message);
      return res.status(500).send("Error fetching recent activities: " + error.message);
    }

    res.json(results.map(result => result.activity_description));
  });
});

// Get logged-in user's details
router.get('/me', verifyToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT u.username, u.email, u.role, u.continuous_service_date, u.first_name, u.last_name, wl.region, wl.district, wl.work_location
    FROM users u
    LEFT JOIN work_locations wl ON u.work_location_id = wl.id
    WHERE u.user_id = ?;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user details:", error.message);
      return res.status(500).send("Error fetching user details: " + error.message);
    }

    if (results.length === 0) {
      return res.status(404).send("User not found.");
    }

    res.json(results[0]);
  });
});

module.exports = router;
