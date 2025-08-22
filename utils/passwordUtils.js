const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generatePassword = (length = 8) => {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = { generatePassword, hashPassword, comparePassword };
