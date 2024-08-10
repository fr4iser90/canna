import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getConnection } from "../config/dbConnections.js";
import createUserModel from "../models/User.js";

// Fetch profile of the authenticated user
export const getProfile = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send({ message: "Error fetching profile" });
  }
};

// Change password for the authenticated user
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).send({ message: "Error changing password" });
  }
};

// Update profile of the authenticated user
export const updateProfile = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send({ message: "Error updating profile" });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email, // Ensure email is included when adding a user
      role: req.body.role,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).send({ message: "Error adding user" });
  }
};

// Fetch all users
export const getUsers = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ message: "Error fetching users" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ message: "Error updating user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send({ message: "Error deleting user" });
  }
};

// Transporter for Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text:
        "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        `http://${req.headers.host}/reset-password/${token}\n\n` +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).send({ message: "Error sending email" });
      }
      res.status(200).send({ message: "Email sent" });
    });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).send({ message: "Error in forgot password" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const dbConnection = await getConnection("userDb");
    const User = createUserModel(dbConnection);
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Password reset token is invalid or has expired" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send({ message: "Password has been reset" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send({ message: "Error resetting password" });
  }
};
