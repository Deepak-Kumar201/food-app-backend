
const getRestaurants = async (req, res) => {
    try {
        const { sqlClient } = global;
        const { city, is_delivering, page_size = 10, page_num = 1, sorting_order } = req.query;
        let { sort_by = 'rating' } = req.query;
        if (sort_by === 'rating') sort_by = "rating / ratingCount"
        if (!city) {
            return res.status(400).json({
                message: "City parameter is required.",
                data: {}
            });
        }

        const offset = (page_num - 1) * page_size;
        const is_deliveringQuery = is_delivering ? 'AND is_delivering = true' : '';

        let query = `SELECT rest_id, name, description, is_delivering, city, address, round(rating / ratingCount, 2) rating, price_for_two, image, cover_image FROM Restaurant WHERE city = '${city}' ${is_deliveringQuery} order by ${sort_by} ${sorting_order == 0 ? 'ASC' : 'DESC'} LIMIT ${page_size} OFFSET ${offset}`;
        let queryCount = `SELECT count(*) FROM Restaurant WHERE city = '${city}' ${is_deliveringQuery}`;

        const [result] = await sqlClient.query(query);
        const [count] = await sqlClient.query(queryCount);
        const total = count[0]["count(*)"];
        
        res.status(200).json({
            message: "Restaurants Data Fetched Successfully",
            data: {
                total,
                page_size: page_size,
                page_num: page_num,
                sort_by: sort_by,
                sorting_order: sorting_order,
                restaurants: result
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "An error occurred while fetching restaurants." })
    }

};
const getRestaurantDetails = async (req, res) => {
    try {
        const { sqlClient } = global;
        const { rest_id } = req.params;
        const { user_id } = req;
        if (!rest_id) {
            return res.status(400).json({ message: "Rest_id is required", data: {} });
        }
        let query = `SELECT rest_id, name, description, is_delivering, city, address, round(rating / ratingCount, 2) rating, price_for_two, image, cover_image FROM Restaurant WHERE rest_id= '${rest_id}';`
        const [result] = await sqlClient.query(query);
        
        const [isFav] = await sqlClient.query(`select count(*) from Favourites where user_id=${user_id} and rest_id=${rest_id}`)
        const favourite = isFav[0]["count(*)"]; 
        if (result.length == 0) {
            return res.status(400).json({ message: `No restaurant found with the id ${rest_id}`, data: {} });
        }
        return res.status(200).json({ message: "Restaurant Details Fetched Successfully", data: { result, favourite } });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "An error occurred while fetching restaurants." })
    }
}
const getRestaurantMenu = async (req, res) => {
    try {
        const { sqlClient } = global;
        const { rest_id } = req.params;
        const { page_size = 1000, page_num = 1 } = req.query;
        if (!rest_id) {
            return res.status(400).json({ message: "Rest_id is required", data: {} });
        }
        const offset = (page_num - 1) * page_size;
        let query = `SELECT dish_id, rest_id, price, name, cuisine, description, image, status FROM Dishes where rest_id=${rest_id} ORDER BY status DESC,dish_id LIMIT ${page_size} OFFSET ${offset};`
        const [result] = await sqlClient.query(query);
        return res.status(200).json({ message: "Restaurant Menu Fetched Successfully", data: result });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Fetching Restaurant Details Failed" })
    }
}

export default { getRestaurants, getRestaurantDetails, getRestaurantMenu };