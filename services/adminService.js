const AssistantWarden = require("../models/assist_warden");
const SeniorWarden = require("../models/senior_warden");
const { generatePassword, hashPassword, comparePassword } = require("../utils/passwordUtils");

const createWarden = async (wardenType, data) => {
  const { name, employee_id, hostel, phone, email } = data;

  // ✅ Check if hostel already has a warden of this type
  if (wardenType === "assistant") {
    const existingAsst = await AssistantWarden.findOne({ hostel });
    if (existingAsst) throw new Error(`Hostel ${hostel} already has an Assistant Warden`);
  } else if (wardenType === "senior") {
    const existingSenior = await SeniorWarden.findOne({ hostel });
    if (existingSenior) throw new Error(`Hostel ${hostel} already has a Senior Warden`);
  } else {
    throw new Error("Invalid warden type");
  }

  const plainPassword = generatePassword(10);
  const password_hash = await hashPassword(plainPassword);

  let newWarden;
  if (wardenType === "assistant") {
    newWarden = new AssistantWarden({
      asst_warden_Id: "ASST-" + employee_id,
      name,
      hostel,
      employee_id,
      password_hash,
      phone,
      email
    });
  } else if (wardenType === "senior") {
    newWarden = new SeniorWarden({
      sen_warden_Id: "SEN-" + employee_id,
      name,
      hostel,
      employee_id,
      password_hash,
      phone,
      email
    });
  } else {
    throw new Error("Invalid warden type");
  }

  await newWarden.save();
  return { warden: newWarden, plainPassword };
};


module.exports = { createWarden };
