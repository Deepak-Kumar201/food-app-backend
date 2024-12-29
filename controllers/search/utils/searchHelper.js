import squel from 'squel';

const hotelSearch = (query, order_by, lowest_first, page, limit) => {
    const { sqlClient } = global;
    if (order_by === 'rating') order_by = "rating/ratingCount"
    let sqlQuery = squel.select()
        .from('Restaurant')
        .field('rest_id')
        .field('name')
        .field('description')
        .field('is_delivering')
        .field('round(rating / ratingCount, 2)', "rating")
        .field('price_for_two')
        .field('image')
        .field('cover_image')
        .where('MATCH(name, description) AGAINST(?)', query);

    if (order_by === "rating/ratingCount" || order_by === 'price_for_two') {
        sqlQuery = sqlQuery.order(order_by, lowest_first === 'true' ? 'ASC' : 'DESC');
    }

    sqlQuery = sqlQuery.limit(limit).offset((page - 1) * limit);

    return sqlClient.query(sqlQuery.toString())
}

const hotelCount = (query) => {
    const { sqlClient } = global;

    let sqlQuery = squel.select()
        .from('Restaurant')
        .field('count(*)')
        .where('MATCH(name, description) AGAINST(?)', query);

    return sqlClient.query(sqlQuery.toString())
}

const dishSearch = (query, order_by, lowest_first, page, limit) => {
    const { sqlClient } = global;
    if (order_by === 'rating') order_by = "rating/ratingCount"
    let sqlQuery = squel.select()
        .from('Dishes dish')
        .field('dish.rest_id', 'rest_id')
        .field('dish.dish_id', 'dish_id')
        .field('dish.price', 'price')
        .field('dish.name', 'name')
        .field('dish.cuisine', 'cuisine')
        .field('dish.description', 'description')
        .field('dish.image', 'image')
        .field('dish.status', 'status')
        .field('rest.name', 'rest_name')
        .field('round(rest.rating / rest.ratingCount, 2)', 'rest_rating')
        .join('Restaurant rest on dish.rest_id = rest.rest_id')
        .where('MATCH(dish.name, dish.description, cuisine) AGAINST(?)', query);

    if (order_by === "rating/ratingCount" || order_by === 'price') {
        sqlQuery = sqlQuery.order(order_by, lowest_first === 'true' ? 'ASC' : 'DESC');
    }

    sqlQuery = sqlQuery.limit(limit).offset((page - 1) * limit);

    return sqlClient.query(sqlQuery.toString())
}

const dishCount = (query) => {
    const { sqlClient } = global;

    let sqlQuery = squel.select()
        .from('Dishes dish')
        .field('count(*)')
        .where('MATCH(dish.name, dish.description, cuisine) AGAINST(?)', query);

    return sqlClient.query(sqlQuery.toString())
}

export default { hotelSearch, dishSearch, dishCount, hotelCount };