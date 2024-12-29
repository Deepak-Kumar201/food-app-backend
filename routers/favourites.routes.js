import { Router } from "express";
import authanticate from "../middleware/authanticate.js";
import favouritesController from "../controllers/favourites/favourites.controller.js";
const favouritesRouter = Router();

favouritesRouter.post("/:rest_id", authanticate, favouritesController.addFavourites);
favouritesRouter.get("/", authanticate, favouritesController.getFavourites);
favouritesRouter.delete("/:rest_id", authanticate, favouritesController.deleteFavourites);

export default favouritesRouter;