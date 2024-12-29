import addressRouter from './routers/address.routes.js';
import favouritesRouter from './routers/favourites.routes.js';
import orderRouter from './routers/order.routes.js';
import searchRouter from './routers/search.routes.js';
import adminRouter from './routers/admin.routes.js';
import userRouter from './routers/user.routes.js';
import restaurantRouter from './routers/restaurant.routes.js';

import { Router } from 'express';
import ratingRouter from './routers/rating.routes.js';
const router = Router();

router.get("/", (req, resp) => {
    resp.json({message: "Hi, from Swaad."})
})
router.use("/user", userRouter)
router.use("/address", addressRouter)
router.use("/favourites", favouritesRouter)
router.use("/order", orderRouter)
router.use("/search", searchRouter)
router.use("/admin", adminRouter)
router.use("/rating", ratingRouter)

router.use("/restaurant",restaurantRouter)

export default router;