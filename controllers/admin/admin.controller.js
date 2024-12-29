import { request, response } from 'express'

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const updateOrderStatus = async (req, resp) => {
    try {
        const { new_status } = req.body;
        const { sqlClient } = global;
        const { order_id } = req.params;
        await sqlClient.query(`update Order set status="${new_status}" where order_id=${order_id}`);
        return resp.status(200).json({ message: "Order status updated successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to update order status." })
    }
}


export default { updateOrderStatus };