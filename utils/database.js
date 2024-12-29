import dotenv from "dotenv"
dotenv.config()

import mysql from 'mysql';

const SQL_USERNAME = process.env.SQL_USERNAME
const SQL_PASSWORD = process.env.SQL_PASSWORD
const SQL_HOST = process.env.SQL_HOST
const SQL_DATABASE = process.env.SQL_DATABASE

console.log(SQL_DATABASE, SQL_HOST, SQL_USERNAME, SQL_PASSWORD)

const sqlClient = mysql.createConnection({
  host: SQL_HOST,
  user: SQL_USERNAME,
  password: SQL_PASSWORD,
  database : SQL_DATABASE
});

sqlClient.connect();

global = {
  ...global, sqlClient
}

export default sqlClient;