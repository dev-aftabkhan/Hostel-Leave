const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

// match backend values
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = crypto.createHash("sha256").update(String("myencryptionsecret123")).digest("base64").substr(0, 32);
const IV = Buffer.from("9f8b7e6a5c4d3e2f1a0b9c8d7e6f5a4b", "hex"); // must be 16 bytes
console.log("IV length:", IV.length);
console.log("IV hex:", process.env.CRYPTO_IV || "hardcoded");

// encryption
const encryptData = (data) => {
  const jsonData = JSON.stringify(data);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(jsonData, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

// decryption
const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

(async () => {
  try {
    // 👤 mock admin input
    const payload = {
      name: "Test Admin",
      email: "admin1@example.com",
      employee_id: "EMP103",
      phone: "9876543213",
      createdby: "SUPERADMIN"
    };

    // 🔐 encrypt request
    const encryptedPayload = encryptData(payload);

    console.log("Encrypted Request:", encryptedPayload);

    // 📡 send to API
    const res = await axios.post("http://localhost:4242/api/admin/create-admin", {
      encrypted: encryptedPayload
    });

    console.log("Encrypted Response:", res.data);

    // 🔓 decrypt response
    const decryptedResponse = decryptData(res.data);
    console.log("Decrypted Response:", decryptedResponse);

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
})();
