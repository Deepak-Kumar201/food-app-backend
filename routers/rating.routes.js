import { Router } from "express";
import authanticate from "../middleware/authanticate.js";
import ratingController from "../controllers/rating/rating.controller.js";
const ratingRouter = Router();

ratingRouter.post("/:rest_id", authanticate, ratingController.addRating);

export default ratingRouter;