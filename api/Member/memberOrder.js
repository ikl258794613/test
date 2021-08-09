const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
  const member_id = 1
  const orderDetail = await connection.queryAsync(
    "SELECT * FROM official_end_order WHERE member_id=?",
    [member_id]
  );
  let IdArray = orderDetail[0].product_id.split(",").map(Number);
  let quantity = orderDetail[0].quantity.split(",").map(Number);
  // console.log(quantity)
  let productArray = []
  // "SELECT name_zh FROM customized_fragrance JOIN customized_popular ON customized_fragrance.id = customized_popular.frag_id WHERE customized_popular.id=?"
  for (let i = 0; i < IdArray.length; i++) {
    const product = await connection.queryAsync(
      "SELECT  official_product.name_zh, official_product.name_en,official_product.img_id,official_series.name_zh as seriesName,official_product.price,official_product.volume FROM official_product JOIN official_series ON official_product.series_id = official_series.id WHERE official_product.id=?",
      [IdArray[i]]
    );
    product[0].quantity = quantity[i]
    productArray.push(product[0]);
  }

  const result = {}
  result.product = productArray
  result.quantity = orderDetail[0].quantity
  result.total = orderDetail[0].order_total
  result.address = orderDetail[0].address
  result.order_id= orderDetail[0].order_id

  console.log(productArray)
  res.json(result);
});

module.exports = router;
