import { request, response } from 'express'

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const addFavourites = async (req, resp) => {
    try {
        const { user_id } = req;
        const { rest_id } = req.params;

        const { sqlClient } = global;
        const [result] = await sqlClient.query(`insert into Favourites(user_id, rest_id) values(${user_id}, ${rest_id})`);
        resp.status(201).json({ "message": "Favourites Added Successfully" });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Favourites Addition Failed." });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const getFavourites = async (req, resp) => {
    try {
        const { user_id } = req;
        const { sqlClient } = global;
        const [result] = await sqlClient.query(`select rest.rest_id rest_id, name, description, is_delivering, address, longitude, latitude, round(rating/ratingCount, 2) rating, price_for_two, image, cover_image, city from Favourites fav join Restaurant rest on fav.rest_id = rest.rest_id where fav.user_id=${user_id}`)
        resp.status(200).json({ data: { favourites: result }, "message": "Favouriteses Fetched Successfully" });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Favourites Fetching Failed, Please try again.rs" });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const deleteFavourites = async (req, resp) => {
    try {
        const { user_id } = req;
        const { rest_id } = req.params;

        const { sqlClient } = global;
        const [result] = await sqlClient.query(`delete from Favourites where user_id=${user_id} and rest_id=${rest_id}`)
        resp.status(200).json({ "message": "Favourites Deleted Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to delete favourites." });
    }
}

export default { addFavourites, getFavourites, deleteFavourites };