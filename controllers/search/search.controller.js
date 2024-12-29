import correctSpellings from './utils/queryEnhancer.js';
import searchHelper from './utils/searchHelper.js'
import { request, response } from 'express'
import calculateBoundingBox from './utils/getBoundingBox.js';

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const search = async (req, resp) => {
    try {
        const { user_id } = req;
        const { dictonary } = global;
        const { query: rawSearchQuery, order_by = null, lowest_first = false, page = 1, limit = 10, type = "default" } = req.query;
        const query = correctSpellings(rawSearchQuery, dictonary)
        if (query.length == 0) {
            return resp.status(400).json({ message: "Query cann't be empty." });
        }
        resp.custom = { "Corrected Query": query };
        const { redisClient } = global;
        const redisKey = query + order_by + lowest_first + page + limit + type;
        const data = await redisClient.get(redisKey);
        if (data) {
            return resp.status(200).json(JSON.parse(data));
        }
        resp.cacheKey = redisKey;

        if (type == "default") {
            const [hotelSearchQuery, schema] = await searchHelper.hotelSearch(query, order_by, lowest_first, page, limit);
            if (hotelSearchQuery.length == 0) {
                const [count] = await searchHelper.dishCount(query);
                const total = count[0]["count(*)"];
                const [dishSearchQuery, schema] = await searchHelper.dishSearch(query, order_by, lowest_first, page, limit);
                return resp.status(200).json({ data: { dishes: dishSearchQuery, total }, message: "Search results fetched successfully." })
            } else {
                const [count] = await searchHelper.hotelCount(query);
                const total = count[0]["count(*)"];
                return resp.status(200).json({ data: { restaurants: hotelSearchQuery, total }, message: "Search results fetched successfully." })
            }
        } else if (type === "restaurant") {
            const [hotelSearchQuery, schema] = await searchHelper.hotelSearch(query, order_by, lowest_first, page, limit);
            const [count] = await searchHelper.hotelCount(query);
            const total = count[0]["count(*)"];
            return resp.status(200).json({ data: { restaurants: hotelSearchQuery, total }, message: "Search results fetched successfully." })
        } else {
            const [dishSearchQuery, schema] = await searchHelper.dishSearch(query, order_by, lowest_first, page, limit);
            const [count] = await searchHelper.dishCount(query);
            const total = count[0]["count(*)"];
            return resp.status(200).json({ data: { dishes: dishSearchQuery, total }, message: "Search results fetched successfully." })
        }
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "An error occurred while searching." })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const categories = async (req, resp) => {
    try {
        const { sqlClient } = global;
        const [categoriesQuery, schema] = await sqlClient.query(`select name from Categories`);
        const categories = categoriesQuery.map(category => category.name);
        return resp.status(200).json({ data: { categories }, message: "Categories fetched successfully." })
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(500).json({ message: "An error occurred while categories." })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const findByDistance = async (req, resp) => {
    try {
        const { sqlClient } = global;
        const { distance = 15, latitude = 90, longitude = 90, page = 1, limit = 10 } = req.query;

        const { redisClient } = global;
        const redisKey = "DistanceSearch" + latitude + longitude + distance + page + limit;
        const data = await redisClient.get(redisKey);
        if (data) {
            return resp.status(200).json(JSON.parse(data));
        }
        resp.cacheKey = redisKey;

        const { latitudeMin, latitudeMax, longitudeMax, longitudeMin } = calculateBoundingBox(latitude, longitude, distance);
        const [restaurants, schema] = await sqlClient.query(`select rest_id, name, description, is_delivering, address, longitude, latitude, round(rating/ratingCount, 2) rating, price_for_two, image, cover_image, city from Restaurant where
            latitude_500 in (WITH RECURSIVE num_series AS (
                SELECT ${latitudeMin} AS number
                UNION ALL
                SELECT number + 1
                FROM num_series
                WHERE number < ${latitudeMax}
            ) SELECT number FROM num_series) and (longitude between ${longitudeMin} and ${longitudeMax}) and
            ST_Distance_Sphere(
                point(longitude, latitude),
                point(${longitude}, ${latitude})
            ) <= ${distance * 1000} limit ${(page - 1) * limit}, ${limit}`);

        const [count] = await sqlClient.query(`select count(*) from Restaurant where
            latitude_500 in (WITH RECURSIVE num_series AS (
                SELECT ${latitudeMin} AS number
                UNION ALL
                SELECT number + 1
                FROM num_series
                WHERE number < ${latitudeMax}
            ) SELECT number FROM num_series) and (longitude between ${longitudeMin} and ${longitudeMax}) and
            ST_Distance_Sphere(
                point(longitude, latitude),
                point(${longitude}, ${latitude})
            ) <= ${distance * 1000}`);
        const total = count[0]["count(*)"];

        return resp.status(200).json({ data: { restaurants, total }, message: "Restaurants fetched successfully." })
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(500).json({ message: "An error occurred while fetching Restaurants." })
    }
}

export default { search, categories, findByDistance };
