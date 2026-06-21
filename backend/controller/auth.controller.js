import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SignUpController = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    if (!(firstName && lastName && userName && email && password)) {
      return res.status(400).json({message: "Enter all the details"});
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existUserName = await User.findOne({ userName });
    if (existUserName) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
    });

    res.status(201).send({
      success: true,
      message: "New User is Created",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Register API",
    });
  }
};

const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not Found",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credential",
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.json({accessToken});

    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken,
        
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Login Api not Working",
      
    });
  }
};
const RefreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).send({
        success: false,
        message: "Refresh Token Not found",
      });
    }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decode.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).send({
        success: false,
        message: "invalid refresh Token",
      });
    }

    const accessToken = jwt.sign({ id: decode.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { id: decode.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Refresh token expired, please login again"
    });
  }
};
const LogOutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).send({
        success: false,
        message: "Already logged Out",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    await User.findOneAndUpdate({ _id: decoded.id }, { refreshToken: null });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).send({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  SignUpController,
  LoginController,
  LogOutController,
  RefreshController,
};
