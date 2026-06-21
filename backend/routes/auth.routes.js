import express from "express";
import {
  LoginController,
  LogOutController,
  RefreshController,
  SignUpController,
} from "../controller/auth.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";

const authrouter = express.Router();

authrouter.post("/signup", SignUpController);
authrouter.post("/login", LoginController);
authrouter.post("/refresh", RefreshController);
authrouter.post("/logout", LogOutController);

export default authrouter;
