const crypto = require("crypto");
require("dotenv").config();

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto.createHash("sha256").update(String(process.env.CRYPTO_SECRET)).digest("base64").substr(0, 32);
const IV = Buffer.from(process.env.CRYPTO_IV, "hex"); // must be 16 bytes

const encryptData = (data) => {
  const jsonData = JSON.stringify(data);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(jsonData, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

module.exports = { encryptData, decryptData };
