import { Router } from "express";
import adminController from "../controllers/admin/admin.controller.js";
const adminRouter = Router();

adminRouter.post("/updateOrder", adminController.updateOrderStatus);

export default adminRouter;