import { Router } from "express";
import searchController from "../controllers/search/search.controller.js";
import authanticate from "../middleware/authanticate.js";
const searchRouter = Router();

searchRouter.get("/", authanticate, searchController.search);
searchRouter.get("/categories", authanticate, searchController.categories);
searchRouter.get("/findByDistance", authanticate, searchController.findByDistance);

export default searchRouter;