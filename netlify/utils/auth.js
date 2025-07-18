const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT token
const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Generate random token for verification/reset
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Hash a string using crypto
const hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

// Generate a secure random string
const generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

// Create reset token with expiration
const createResetToken = () => {
  const resetToken = generateRandomToken();
  const hashedToken = hashString(resetToken);
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return {
    token: resetToken,
    hashedToken,
    expires,
  };
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Sanitize user data for client response
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.verificationToken;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;
  return userObj;
};

// Parse JWT token without verification (for debugging)
const parseToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Calculate token expiry time
const getTokenExpiry = (token) => {
  const decoded = parseToken(token);
  return decoded ? new Date(decoded.exp * 1000) : null;
};

module.exports = {
  generateToken,
  generateRandomToken,
  verifyToken,
  hashString,
  generateSecureRandom,
  createResetToken,
  isValidEmail,
  isValidPassword,
  sanitizeUser,
  parseToken,
  getTokenExpiry,
};
