import Router from "express";
import { getUserController } from "../controller/user.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/getUser", authMiddleWare, getUserController);

export default userRouter;
