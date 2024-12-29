import { request, response } from 'express'

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const getAllOrder = async (req, resp) => {
    try {
        const { user_id } = req;
        const { page = 1, limit = 10 } = req.query;
        const { sqlClient } = global;
        const [ count ] = await sqlClient.query(`select count(*) from swaad.Order where user_id=${user_id}`);
        const total = count[0]["count(*)"];
        const [orders] = await sqlClient.query(`select order_id, ord.rest_id, name rest_name, total_quantity, amount, status, address_id from swaad.Order ord join swaad.Restaurant rest on ord.rest_id = rest.rest_id where user_id=${user_id} limit ${(page - 1) * limit}, ${limit}`)
        resp.status(200).json({ data: { orders, total }, "message": "User Orders Fetched Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to get User Orders." });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const createOrder = async (req, resp) => {
    const { sqlClient } = global;
    try {
        const { user_id } = req;
        const { rest_id, totalQuantity, amount, order_items, address_id } = req.body;
        await sqlClient.query("START TRANSACTION;")
        let [result] = await sqlClient.query(`insert into swaad.Order(user_id, rest_id, total_quantity, amount, address_id) values(${user_id}, ${rest_id}, ${totalQuantity}, ${amount}, ${address_id})`)
        const { insertId: order_id } = result;
        let orderItems = "";
        order_items.forEach(item => {
            orderItems = orderItems + `(${order_id}, ${item.dish_id}, "${item.dish_name}", ${item.dish_price}, ${item.quantity}),`;
        });
        orderItems = orderItems.substring(0, orderItems.length - 1);
        let [orderItemResult] = await sqlClient.query(`insert into swaad.OrderItems(order_id, dish_id, dist_name, dish_price, quantity) values ${orderItems}`);
        await sqlClient.query("commit;");
        resp.status(201).json({ "message": "Order created Successfully." });
    } catch (error) {
        await sqlClient.query("rollback;");
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to creater Order." });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const getOrder = async (req, resp) => {
    try {
        const { user_id } = req;
        const { order_id } = req.params;
        const { sqlClient } = global;
        
        const { redisClient } = global;
        const redisKey = "ORDER_DETAILS_" + user_id + order_id;
        const data = await redisClient.get(redisKey);
        if (data) {
            return resp.status(200).json(JSON.parse(data));
        }
        resp.cacheKey = redisKey;

        const [orders] = await sqlClient.query(`select order_id, ord.rest_id, name rest_name, total_quantity, amount, status, address_id from swaad.Order ord join swaad.Restaurant rest on ord.rest_id = rest.rest_id where user_id=${user_id} and order_id=${order_id}`);
        if (orders.length == 0) {
            return resp.status(404).json({ message: "Order not found." })
        }
        const [orderItems] = await sqlClient.query(`select order_id, dish_id, dist_name, dish_price, quantity from swaad.OrderItems where order_id=${order_id}`);
        orders[0].order_items = orderItems;
        return resp.status(200).json({ data: { order: orders[0] }, "message": "Order Fetched Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to get Order." });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const cancelOrder = async (req, resp) => {
    try {
        const { user_id } = req;
        const { order_id } = req.params;
        const { sqlClient } = global;
        const [order] = await sqlClient.query(`select status from swaad.Order where order_id=${order_id} and user_id=${user_id}`);
        if (order.length == 0) {
            return resp.status(404).json({ "message": "Order not found." });
        }
        if (order[0].status != 'Placed') {
            return resp.status(400).json({ message: "Order can't be cancelled now." });
        }
        const [orderUpdate] = await sqlClient.query(`update swaad.Order set status="cancelled" where user_id=${user_id} and order_id=${order_id}`);
        
        const { redisClient } = global;
        const redisKey = "ORDER_DETAILS_" + user_id + order_id;
        await redisClient.del(redisKey)

        return resp.status(200).json({ "message": "Order cancelled successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to cancel Order." });
    }
}

export default { getAllOrder, createOrder, getOrder, cancelOrder };