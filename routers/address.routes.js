import { Router } from "express";
import authanticate from "../middleware/authanticate.js";
import addressController from "../controllers/address/address.controller.js";
const addressRouter = Router();

addressRouter.post("/", authanticate, addressController.addAddress);
addressRouter.get("/", authanticate, addressController.getAddress);
addressRouter.delete("/:address_id", authanticate, addressController.deleteAddress);

export default addressRouter;