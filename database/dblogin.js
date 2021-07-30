const mysql = require("mysql2");

require('dotenv').config()
const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
}

// 一般使用
//module.exports.pool = mysql.createPool(connection)

// promise用
module.exports.promisePool = mysql.createPool(connection).promise()
