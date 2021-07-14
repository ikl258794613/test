const express = require("express");
const router = express.Router();
const connection = require("../database/db");

router.get("/", async (req, res) => {
  let productresults = await connection.queryAsync("SELECT * FROM official_product");//官方商品資料

  console.log(productresults)
  //或許能改成promise.all一次拿3筆資料再送出
  res.json(productresults);
  // res.send("node")
  // res.json(ingredientresults);
  // res.json(seriesresults);
});

module.exports = router;
