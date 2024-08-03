const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_generated_secret_key"; // Ensure this matches the one used for signing the token

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    console.error("No token provided");
    return res.status(403).send('A token is required for authentication');
  }

  try {
    console.log("Token provided:", token);
    const tokenPart = token.split(' ')[1];
    console.log("Token part:", tokenPart);
    const decoded = jwt.verify(tokenPart, SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.user = decoded;
  } catch (err) {
    console.error("Token validation error:", err);
    return res.status(401).send('Invalid Token');
  }

  return next();
}

module.exports = verifyToken;
