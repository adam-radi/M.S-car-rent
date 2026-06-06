const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a given user ID
 * @param {string} userId - The user ID to encode in the token
 * @returns {string} The signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Verifies a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {object|null} The decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
