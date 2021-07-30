const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
  const count = await connection.queryAsync(
    "SELECT COUNT(*) as total FROM official_product WHERE volume=?",
    ["50ml"]
  );
  
  const totalCount = count[0].total;
  const perPage = 5;
  const lastPage = Math.ceil(totalCount / perPage);
  const currentPage = req.query.page || 1; // page頁 預設第一頁
  const offset = (currentPage - 1) * perPage;
  console.log(req.query)
  let productresults = await connection.queryAsync(
    "SELECT * FROM official_product WHERE volume=? ORDER BY id LIMIT ? OFFSET ?;",
    ["50ml",perPage, offset]
  );
  const material = await connection.queryAsync(
    "SELECT * FROM official_ingredient ORDER BY id"
  )
  let result = {};//變成物件

  result.data = productresults
  result.page = lastPage
  result.material = material
  console.log(result)
  res.json(result);
});

module.exports = router;
