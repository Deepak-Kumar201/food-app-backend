import { Router } from "express";
import userController from "../controllers/user/user.controller.js";
import authanticate from "../middleware/authanticate.js";
const userRouter = Router();

userRouter.post("/send-otp", userController.sendOtp);
userRouter.post("/login", userController.login);
userRouter.get("/profile", authanticate, userController.getProfile);
userRouter.put("/profile", authanticate, userController.updateProfile);

export default userRouter;