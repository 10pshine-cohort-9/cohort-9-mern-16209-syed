const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// REGISTER 

exports.register = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // Convert email to lowercase
    const normalizedEmail =
      email.toLowerCase().trim();

    // Check if user already exists
    const exists =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Create user
    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,
      });

    // Send response
    res.status(201).json({
      success: true,

      message:
        "Registration successful",

      token:
        generateToken(
          user._id
        ),

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER

exports.login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Email and password are required",
      });
    }

    // Find user
    const user =
      await User.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      });

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid email or password",
      });
    }

    // Compare passwords
    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    // Incorrect password
    if (!match) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid email or password",
      });
    }

    // Login successful
    res.status(200).json({
      success: true,

      message:
        "Login successful",

      token:
        generateToken(
          user._id
        ),

      // Send user data to frontend
      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};