const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "60d" });
  return token; // encrypt the token
};

const verifyToken = (encryptedToken) => {
  try {
    //const { token } = encryptedToken;
    return jwt.verify(encryptedToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };
