import dotenv from "dotenv"
dotenv.config()
import sqlClient from "./utils/database.js";
import redisClient from "./utils/redis.js";
import readDictonary from "./utils/loadDictonary.js";
import express from "express"
import router from "./router.js";
import modifyResponse from "./middleware/modifyResponse.js";
import cors from 'cors'
import morgan from "./utils/morgan.js";

const app = express()
const PORT = process.env.PORT
app.use(cors())
app.use(express.json());

app.use(morgan);
app.use(modifyResponse);
app.use(router)

app.listen(PORT, () => {
    console.log(`connected to port ${PORT}`);
})