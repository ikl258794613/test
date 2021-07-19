const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {

  const seriescount = await connection.queryAsync(
    "SELECT COUNT(*) as total FROM official_product WHERE series_id=?",
    [3]//req.body.seriseId
  );
 console.log(req.body.seriseId)
  const totalCount = seriescount[0].total;
  const perPage = 5;
  const lastPage = Math.ceil(totalCount / perPage);
  const currentPage = req.query.page || 1; // page頁 預設第一頁
  const offset = (currentPage - 1) * perPage;
  // console.log(req.query)
  let seriesresults = await connection.queryAsync(
    "SELECT * FROM official_product WHERE series_id=? ORDER BY id LIMIT ? OFFSET ?;",
    [3,perPage, offset]
  );
  let result = {};//變成物件
  result.data = seriesresults
  result.page = lastPage

  console.log(result)
 
  res.json(result);
});

module.exports = router;
