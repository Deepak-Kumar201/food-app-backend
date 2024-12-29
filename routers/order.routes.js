import { Router } from "express";
import authanticate from "../middleware/authanticate.js";
import orderController from "../controllers/order/order.controller.js";
const orderRouter = Router();

orderRouter.get("/", authanticate, orderController.getAllOrder);
orderRouter.post("/", authanticate, orderController.createOrder);
orderRouter.get("/:order_id", authanticate, orderController.getOrder);
orderRouter.put("/:order_id/cancel", authanticate, orderController.cancelOrder);

// admin endpoint
orderRouter.put("/:order_id/", authanticate, orderController.cancelOrder);


export default orderRouter;