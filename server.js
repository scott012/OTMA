const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000; // Change to a different port
const verifyToken = require('./middleware/auth.js');

// Middleware to handle CORS
app.use(cors());

// Middleware to parse requests of content-type - application/json
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Overtime App!" });
  console.log("Root endpoint hit");
});

// Import and use the user routes
const userRoutes = require("./routes/user.routes.js");
app.use("/api/users", userRoutes);
console.log("User routes registered");

// Import and use the shift routes
const shiftRoutes = require("./routes/shift.routes.js");
app.use("/api/shifts", verifyToken, shiftRoutes); // Apply the token verification middleware
console.log("Shift routes registered");

// Import and use the overtime routes
const overtimeRoutes = require("./routes/overtime.routes.js");
app.use("/api/overtime", verifyToken, overtimeRoutes); // Apply the token verification middleware
console.log("Overtime routes registered");

// Import and use the overtime descriptions routes
const overtimeDescriptionsRoutes = require('./routes/overtime_descriptions.routes.js');
app.use("/api/overtime-descriptions", verifyToken, overtimeDescriptionsRoutes);
console.log("Overtime descriptions routes registered");

// Import and use the work locations routes
const workLocationsRoutes = require('./routes/work_locations.routes.js');
app.use("/api/work-locations", verifyToken, workLocationsRoutes);
console.log("Work locations routes registered");

// Import and use the dashboard routes
const dashboardRoutes = require('./routes/dashboard.routes.js');
app.use("/api/dashboard", verifyToken, dashboardRoutes);
console.log("Dashboard routes registered");

// Test database connection
const db = require("./db/db.js");
app.get("/testdb", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (error, results) => {
    if (error) {
      console.error("Error testing DB connection:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.log("Test DB endpoint hit");
      res.json({ solution: results[0].solution });
    }
  });
});

// Set port, listen for requests
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
