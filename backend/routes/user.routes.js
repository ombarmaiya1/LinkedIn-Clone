import { Router } from "express";
import {
  acceptConnectionRequestController,
  getUserController,
  getNetworkOverviewController,
  rejectConnectionRequestController,
  removeConnectionController,
  sendConnectionRequestController,
  updateAboutController,
  updateEducationController,
  updateExperienceController,
  updateSkillsController,
  updateImagesController,
} from "../controller/user.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.get("/getUser", authMiddleWare, getUserController);
userRouter.get("/network/overview", authMiddleWare, getNetworkOverviewController);
userRouter.post(
  "/network/request/:targetUserId",
  authMiddleWare,
  sendConnectionRequestController,
);
userRouter.post(
  "/network/accept/:requesterUserId",
  authMiddleWare,
  acceptConnectionRequestController,
);
userRouter.post(
  "/network/reject/:requesterUserId",
  authMiddleWare,
  rejectConnectionRequestController,
);
userRouter.delete(
  "/network/remove/:targetUserId",
  authMiddleWare,
  removeConnectionController,
);
userRouter.put("/updatebio", authMiddleWare, updateAboutController);
userRouter.put("/updateskills", authMiddleWare, updateSkillsController);
userRouter.put("/updateexperience", authMiddleWare, updateExperienceController);
userRouter.put("/updateeducation", authMiddleWare, updateEducationController);
userRouter.put(
  "/updateimages",
  authMiddleWare,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateImagesController,
);

export default userRouter;
