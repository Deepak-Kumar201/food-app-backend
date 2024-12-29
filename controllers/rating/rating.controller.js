import { request, response } from 'express'

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const addRating = async (req, resp) => {
    try {
        const { user_id } = req;
        const { rest_id } = req.params;
        let { rating } = req.body;
        const { sqlClient } = global;
        if(rating > 5 || rating <= 0){
            return resp.status(400).json({message: "Rating must be between 1 and 5"});
        }
        const [ currentRating ] = await sqlClient.query(`select * from Rating where user_id=${user_id} and rest_id=${rest_id}`);
        console.log(currentRating)
        if(currentRating.length != 0){
            await sqlClient.query(`update Rating set rating=${rating} where user_id=${user_id} and rest_id=${rest_id}`);
            rating -= currentRating[0].rating;
        }else{
            await sqlClient.query(`insert into Rating(user_id, rest_id, rating) values(${user_id}, ${rest_id}, ${rating})`);
        }
        await sqlClient.query(`update Restaurant set rating = rating + ${rating}, ratingCount = ratingCount + ${currentRating.length ? 0 : 1} where rest_id=${rest_id}`);
        resp.status(201).json({ "message": "Rating Added Successfully" });
    } catch (error) {
        console.log(error);
        return resp.status(400).json({ message: "Failed to add rating." });
    }
}

export default { addRating };