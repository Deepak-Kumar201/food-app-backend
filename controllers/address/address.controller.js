import { request, response } from 'express'
/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const addAddress = async (req, resp) => {
    try {
        const { user_id } = req;
        const { name, phone, street, city, state, pincode, latitude = -360, longitude = -360 } = req.body;
        const { sqlClient } = global;
        const [result] = await sqlClient.query(`insert into Address(user_id, name, phone, street, city, state, pincode, latitude, longitude) values(${user_id}, "${name}", "${phone}", "${street}", "${city}", "${state}", ${pincode}, ${latitude}, ${longitude})`);
        resp.status(201).json({ "message": "Address Added Successfully" });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Address Addition Failed." });
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} resp 
 * @returns 
 */
const getAddress = async (req, resp) => {
    try {
        const { user_id } = req;
        const { sqlClient } = global;
        const [result] = await sqlClient.query(`select * from Address where user_id=${user_id} and status="active"`)
        resp.status(200).json({ data: { addresses: result }, "message": "Addresses Fetched Successfully" });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Address Fetching Failed, Please try again.rs" });
    }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} resp 
 * @returns 
 */
const deleteAddress = async (req, resp) => {
    try {
        const { user_id } = req;
        const { address_id } = req.params;

        const { sqlClient } = global;
        const [result] = await sqlClient.query(`update Address set status="inactive" where user_id=${user_id} and address_id=${address_id}`)
        resp.status(200).json({ "message": "Address Deleted Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to delete address." });
    }
}

export default { addAddress, getAddress, deleteAddress };