const parentService = require("../services/parentService");
const Student = require("../models/student");
const Parent = require("../models/parent");
const { decryptData, encryptData } = require("../utils/cryptoUtils");

// login parent
const loginParent = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);
    const { phone_no, student_enrollment_no } = decryptedBody;
     
    // check if phone_no is registered
     
    const parent = await Parent.findOne({ phone_no });
    
    if (!parent) throw new Error("Please enter registered parent phone number");
    // check if student_enrollment_no is valid
    const student = await Student.findOne({ enrollment_no: student_enrollment_no });
    if (!student) throw new Error("Please enter valid student enrollment number");

    // check entered student_enrollment_no matches with parent's student_enrollment_no
    if (!parent.student_enrollment_no.includes(student_enrollment_no)) {
      throw new Error("Enter yours student's enrollment number");
    }

    const { token } = await parentService.loginParent(phone_no, student_enrollment_no);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//get parent by ID
const getParentById = async (req, res) => {
  try {
    const parentId = req.user.id;
    const parent = await parentService.getParentById(parentId);
    res.json(parent);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  loginParent,
  getParentById,
};
