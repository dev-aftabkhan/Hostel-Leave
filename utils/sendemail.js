// create a email sending utility
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// Load environment variables from .env file
require("dotenv").config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to send credential email
const sendCredentialEmail = async (user, plainPassword, roleName) => {
  console.log(`Preparing to send ${roleName} credentials to:`, user.email);
  const subject = "Hostel Leave Account Credentials";
  const loginId = user.enrollment_no || user.emp_id;
  
  const html = `
    <p>Dear <b>${user.name}</b>,</p>
    <p>Your <b>${roleName}</b> account has been created successfully. Here are your login credentials:</p>
    <ul>
      <li><b>${roleName === "Student" ? "Enrollment Number" : "Employee ID"}:</b> ${loginId}</li>
      <li><b>Password:</b> ${plainPassword}</li>
    </ul>
    <p>Please change your password after your first login.</p>
    <p>Regards,<br/>Hostel Management Team</p>
  `;
  await sendEmail(user.email, subject, html);
};

// Function to send email
const sendEmail = async (to, subject, html) => {
  try {
    console.log("Sending email via:", process.env.EMAIL_FROM);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("CRITICAL ERROR: Failed to send email to", to, ":", error);
  }
};

module.exports = { sendEmail, isValidEmail, sendCredentialEmail };
