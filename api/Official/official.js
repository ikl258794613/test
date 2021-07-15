const express = require("express");
const router = express.Router();
const connection = require("../database/db");

router.get("/", async (req, res) => {
  let productresults = await connection.queryAsync("SELECT * FROM official_product");//官方商品資料
  console.log(productresults)
  res.json(productresults);
});

module.exports = router;
