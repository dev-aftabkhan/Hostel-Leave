const jwt = require("jsonwebtoken");
const { encryptData, decryptData } = require("./cryptoUtils");
require("dotenv").config();

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "infinity" });
  return encryptData({ token }); // encrypt the token
};

const verifyToken = (encryptedToken) => {
  try {
    const { token } = decryptData(encryptedToken);
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };
