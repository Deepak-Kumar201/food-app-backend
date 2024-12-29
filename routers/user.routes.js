import { Router } from "express";
import userController from "../controllers/user/user.controller.js";
const userRouter = Router();

userRouter.get("/sayHI", userController.helloWorld);

export default userRouter;