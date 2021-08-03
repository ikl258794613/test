const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/:id", async (req, res) => {
  const officialId = req.params.id;
  let totalOfficialInfo = [];
  const officialProduct = await connection.queryAsync(
    `SELECT * FROM official_product WHERE id=${officialId}`
  );
  totalOfficialInfo.push(officialProduct[0]);

  const officialSeries = await connection.queryAsync(
    `SELECT official_series.name_zh FROM official_series JOIN official_product ON official_series.id = official_product.series_id WHERE official_product.id=${officialId}`
  );
  totalOfficialInfo[0].series_name = officialSeries[0].name_zh;

  console.log(totalOfficialInfo);
  res.json(totalOfficialInfo[0]);
});

router.get("/", async (req, res) => {
  const officialId = req.params.id;
  totalOfficialInfo = [];
  const seriesId = Math.floor(Math.random() * 4) + 1;
  console.log(seriesId);
  const officialProducts = await connection.queryAsync(
    `SELECT * FROM official_product WHERE series_id=${seriesId} AND id <> "${officialId}"`
  );
  res.json(officialProducts[0]);
});

module.exports = router;
