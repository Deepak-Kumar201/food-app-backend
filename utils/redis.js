import { createClient } from 'redis';

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
console.log(REDIS_HOST, REDIS_PORT)
const redisConnection = createClient({
    // password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
}).connect();

redisConnection.then((redisClient) =>{
    console.log("Connected to Redis")
    global = {...global, redisClient}
}).catch((err)=>{
    console.log(err);
});

export default redisConnection;