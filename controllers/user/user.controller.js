import optgenerator from 'otp-generator'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import sendSms from './utils/sendSms.js'
import { request, response } from 'express'
import squel from 'squel'

const MOBILE_REGEX = /^\d{10}$/;

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const sendOtp = async (req, resp) => {
    try {
        const { phone = "" } = req.body;
        const { redisClient, sqlClient } = global;
        if (!MOBILE_REGEX.test(phone)) {
            return resp.status(400).json({ message: "An error occurred while sending the OTP. Please try again." });
        }
        const otp = optgenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const [result, fields] = await sqlClient.query(`select count(*) from swaad.User where phone=${phone};`);
        if (result[0]["count(*)"] == 0) {
            await sqlClient.execute(`insert into User(phone) values("${phone}")`);
        }
        await sendSms(phone, otp)
        const redisSetup = await redisClient.set(phone + "_OTP", otp, { EX: 5 * 60 });
        return resp.status(201).json({ message: "Otp sent successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "An error occurred while sending the OTP. Please try again." })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const login = async (req, resp) => {
    try {
        const { phone = "", otp = "" } = req.body;
        const { redisClient, sqlClient } = global;
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!MOBILE_REGEX.test(phone)) {
            return resp.status(400).json({ message: "Login failed, Please try again" })
        }

        const actualOtp = await redisClient.get(phone + "_OTP");
        if (actualOtp != otp) {
            return resp.status(403).json({ message: "Failed to match OTP." });
        }
        await redisClient.del(phone + "_OTP");

        const [result] = await sqlClient.query(`select user_id from swaad.User where phone=${phone};`);
        if (result.length == 0) {
            return resp.status(404).json({ message: "User not found." });
        }
        const { user_id } = result[0];
        const [addressCount] = await sqlClient.query(`select count(*) from Address where user_id=${user_id}`);

        const address_taken = Boolean(addressCount[0]["count(*)"])
        const jwt_token = jwt.sign({ user_id }, JWT_SECRET);

        return resp.status(200).json({ data: { jwt_token, address_taken }, message: "User logged in successfully." })
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Failed to match OTP." })
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const getProfile = async (req, resp) => {
    try {
        const { user_id } = req;
        const { sqlClient } = global;
        const [result] = await sqlClient.query(`select * from User where user_id=${user_id}`);
        const { name, dob, gender, phone, email } = result[0];
        const data = { name, dob, gender, phone, email };

        return resp.status(200).json({ data, message: "User Profile Fetched Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(400).json({ message: "Unable to fetch user profile." });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} resp 
 * @returns 
 */
const updateProfile = async (req, resp) => {
    try {
        const { user_id } = req;
        const { name, dob, gender, email } = req.body;
        const { sqlClient } = global;
        const parsedDate = moment(dob);

        let sqlQuery = squel.update().table('User').where('user_id = ?', user_id);
        name && (sqlQuery = sqlQuery.set('name', name));
        dob && (sqlQuery = sqlQuery.set('dob', parsedDate.format('YYYY-MM-DD')));
        gender && (sqlQuery = sqlQuery.set('gender', gender));
        email && (sqlQuery = sqlQuery.set('email', email));

        const [result] = await sqlClient.query(sqlQuery.toString());

        return resp.status(200).json({ message: "Profile Updated Successfully." });
    } catch (error) {
        console.log(error);
        resp.error = error;
        return resp.status(401).json({ message: "Profile Updation Failed." });
    }
}


export default { sendOtp, login, getProfile, updateProfile };