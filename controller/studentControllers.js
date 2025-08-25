const { loginStudent } = require("../services/studentService");
const { encryptData, decryptData } = require("../utils/cryptoUtils");

// ✅ Student Login
exports.loginStudent = async (req, res) => {
  try {
    // 🔓 Decrypt body
    const decryptedBody = decryptData(req.body.encrypted);
    const { enrollment_no, password } = decryptedBody;

    const { token, student } = await loginStudent(enrollment_no, password);

    // 🔐 Encrypt response
    res.status(200).json(encryptData({
      message: "Login successful",
      enrollment_no: student.enrollment_no,
      name: student.name,
      token
    }));
  } catch (err) {
    res.status(401).json(encryptData({ error: err.message }));
  }
};
