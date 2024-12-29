import { Router } from "express";
import restaurantController from "../controllers/restaurant/restaurant.controller.js";
import authanticate from "../middleware/authanticate.js";
const restaurantRouter = Router();

restaurantRouter.get("/", restaurantController.getRestaurants);
restaurantRouter.get("/:rest_id", authanticate, restaurantController.getRestaurantDetails);
restaurantRouter.get("/:rest_id/menu", restaurantController.getRestaurantMenu);

export default restaurantRouter;