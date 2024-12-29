import dotenv from "dotenv"
dotenv.config()
import sqlClient from "./utils/database.js";
import redisClient from "./utils/redis.js";
import express from "express"
import router from "./router.js";

const app = express()
const PORT = process.env.PORT

app.use(router)

app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
})