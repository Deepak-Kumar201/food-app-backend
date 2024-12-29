import jwt from "jsonwebtoken"

const authanticate = (req, resp, next) => {
    try {
        const authorization = req.headers["authorization"]
        const JWT_SECRET = process.env.JWT_SECRET;
        const { user_id } = jwt.verify(authorization, JWT_SECRET);
        req.user_id = user_id;
        next();
    } catch (error) {
        console.log(error)
        resp.error = error;
        resp.status(403).json({message: "Unable to authanticate user."})
    }
}

export default authanticate;