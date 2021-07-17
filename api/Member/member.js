const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
let A = await connection.queryAsync("SELECT * FROM 資料表");
let b = await connection.queryAsync("SELECT * FROM 資料表");
let c = await connection.queryAsync("SELECT * FROM 資料表");

D =  a+b+c

console.log(D)
res.json(D);
});

module.exports = router;