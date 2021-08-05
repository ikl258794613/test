const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

/* 主要商品 */
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

  // 判別是否為偶數
  function isEven(value) {
    if (value % 2 === 0) return value - 1;
    else return value + 1;
  }
  const siblingId = isEven(Number(officialId));
  console.log(siblingId);

  const siblingProduct = await connection.queryAsync(
    `SELECT volume, price FROM official_product WHERE id=${siblingId}`
  );
  console.log(siblingProduct);
  totalOfficialInfo.push(siblingProduct[0]);

  console.log(totalOfficialInfo);
  res.json(totalOfficialInfo);
});

/* 推薦商品 */
router.get("/:id/recommend", async (req, res) => {
  const officialId = req.params.id;
  totalOfficialInfo = [];

  // 查詢主要商品id的商品資料
  const officialProduct = await connection.queryAsync(
    `SELECT * FROM official_product WHERE id=${officialId}`
  );

  // 找到主要商品的系列id
  const seriesId = officialProduct[0].series_id;
  console.log("seriesId", seriesId);

  // 找到所有推薦商品的系列id
  const series = [1, 2, 3, 4];
  const otherSeriesArray = series.filter(function (value, index, arr) {
    return value != seriesId;
  });
  console.log("otherSeriesArray", otherSeriesArray);

  switch (seriesId) {
    case 1:
      /* 推薦商品系列2 */
      // 查詢其他系列id的商品資料
      const otherProductsA = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=2"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsA);
      totalOfficialInfo.push(otherProductsA[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdA = otherProductsA[0].series_id;
      console.log("recommend series id", otherSeriesIdA);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesA = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdA}`
      );
      totalOfficialInfo[0].series_name = otherSeriesA[0].name_zh;
      console.log("series name", otherSeriesA[0].name_zh);

      /* 推薦商品系列3 */
      // 查詢其他系列id的商品資料
      const otherProductsB = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=3"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsB);
      totalOfficialInfo.push(otherProductsB[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdB = otherProductsB[0].series_id;
      console.log("recommend series id", otherSeriesIdB);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesB = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdB}`
      );
      totalOfficialInfo[1].series_name = otherSeriesB[0].name_zh;
      console.log("series name", otherSeriesB[0].name_zh);

      /* 推薦商品系列4 */
      // 查詢其他系列id的商品資料
      const otherProductsC = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=4"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsC);
      totalOfficialInfo.push(otherProductsC[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdC = otherProductsC[0].series_id;
      console.log("recommend series id", otherSeriesIdC);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesC = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdC}`
      );
      totalOfficialInfo[2].series_name = otherSeriesC[0].name_zh;
      console.log("series name", otherSeriesC[0].name_zh);

       const totalApiInformation = {};
       totalApiInformation.recommend = totalOfficialInfo;

      console.log(totalOfficialInfo);
      res.json(totalOfficialInfo);
      break;
    case 2:
      /* 推薦商品系列1 */
      // 查詢其他系列id的商品資料
      const otherProductsD = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=1"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsD);
      totalOfficialInfo.push(otherProductsD[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdD = otherProductsD[0].series_id;
      console.log("recommend series id", otherSeriesIdD);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesD = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdD}`
      );
      totalOfficialInfo[0].series_name = otherSeriesD[0].name_zh;
      console.log("series name", otherSeriesD[0].name_zh);

      /* 推薦商品系列3 */
      // 查詢其他系列id的商品資料
      const otherProductsE = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=3"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsE);
      totalOfficialInfo.push(otherProductsE[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdE = otherProductsE[0].series_id;
      console.log("recommend series id", otherSeriesIdE);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesE = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdE}`
      );
      totalOfficialInfo[1].series_name = otherSeriesE[0].name_zh;
      console.log("series name", otherSeriesE[0].name_zh);

      /* 推薦商品系列4 */
      // 查詢其他系列id的商品資料
      const otherProductsF = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=4"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsF);
      totalOfficialInfo.push(otherProductsF[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdF = otherProductsF[0].series_id;
      console.log("recommend series id", otherSeriesIdF);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesF = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdF}`
      );
      totalOfficialInfo[2].series_name = otherSeriesF[0].name_zh;
      console.log("series name", otherSeriesF[0].name_zh);

      console.log(totalOfficialInfo);
      res.json(totalOfficialInfo);
      break;
    case 3:
      /* 推薦商品系列1 */
      // 查詢其他系列id的商品資料
      const otherProductsG = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=1"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsG);
      totalOfficialInfo.push(otherProductsG[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdG = otherProductsG[0].series_id;
      console.log("recommend series id", otherSeriesIdG);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesG = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdG}`
      );
      totalOfficialInfo[0].series_name = otherSeriesG[0].name_zh;
      console.log("series name", otherSeriesG[0].name_zh);

      /* 推薦商品系列2 */
      // 查詢其他系列id的商品資料
      const otherProductsH = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=2"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsH);
      totalOfficialInfo.push(otherProductsH[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdH = otherProductsH[0].series_id;
      console.log("recommend series id", otherSeriesIdH);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesH = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdH}`
      );
      totalOfficialInfo[1].series_name = otherSeriesH[0].name_zh;
      console.log("series name", otherSeriesH[0].name_zh);

      /* 推薦商品系列4 */
      // 查詢其他系列id的商品資料
      const otherProductsI = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=4"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsI);
      totalOfficialInfo.push(otherProductsI[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdI = otherProductsI[0].series_id;
      console.log("recommend series id", otherSeriesIdI);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesI = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdI}`
      );
      totalOfficialInfo[2].series_name = otherSeriesI[0].name_zh;
      console.log("series name", otherSeriesI[0].name_zh);

      console.log(totalOfficialInfo);
      res.json(totalOfficialInfo);
      break;
    case 4:
      /* 推薦商品系列1 */
      // 查詢其他系列id的商品資料
      const otherProductsJ = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=1"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsJ);
      totalOfficialInfo.push(otherProductsJ[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdJ = otherProductsJ[0].series_id;
      console.log("recommend series id", otherSeriesIdJ);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesJ = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdJ}`
      );
      totalOfficialInfo[0].series_name = otherSeriesJ[0].name_zh;
      console.log("series name", otherSeriesJ[0].name_zh);

      /* 推薦商品系列2 */
      // 查詢其他系列id的商品資料
      const otherProductsK = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=2"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsK);
      totalOfficialInfo.push(otherProductsK[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdK = otherProductsK[0].series_id;
      console.log("recommend series id", otherSeriesIdK);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesK = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdK}`
      );
      totalOfficialInfo[1].series_name = otherSeriesK[0].name_zh;
      console.log("series name", otherSeriesK[0].name_zh);

      /* 推薦商品系列3 */
      // 查詢其他系列id的商品資料
      const otherProductsL = await connection.queryAsync(
        "SELECT * FROM official_product WHERE series_id=3"
      );

      // 從其他商品中隨機抽選並加入推薦商品
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffle(otherProductsL);
      totalOfficialInfo.push(otherProductsL[0]);

      // 找到推薦商品的系列id
      const otherSeriesIdL = otherProductsL[0].series_id;
      console.log("recommend series id", otherSeriesIdL);

      // 查詢並加入推薦商品的系列中文名稱
      const otherSeriesL = await connection.queryAsync(
        `SELECT * FROM official_series WHERE id=${otherSeriesIdL}`
      );
      totalOfficialInfo[2].series_name = otherSeriesL[0].name_zh;
      console.log("series name", otherSeriesL[0].name_zh);

      console.log(totalOfficialInfo);
      res.json(totalOfficialInfo);
      break;
    // default:
    //   //當 expression 的值都不符合上述條件
    //   //要執行的陳述句
    //   break;
  }
});

module.exports = router;

/* important */
// // 查詢其他系列id的商品資料
// const otherProducts = await connection.queryAsync(
//   `SELECT * FROM official_product WHERE series_id <> ${seriesId}`
// );

// // 從其他商品中隨機抽選並加入推薦商品
// function shuffle(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// }
// shuffle(otherProducts);
// totalOfficialInfo.push(otherProducts[0]);

// // 找到推薦商品的系列id
// const otherSeriesId = otherProducts[0].series_id;
// console.log("recommend series id", otherSeriesId);

// // 查詢並加入推薦商品的系列中文名稱
// const otherSeries = await connection.queryAsync(
//   `SELECT * FROM official_series WHERE id=${otherSeriesId}`
// );
// totalOfficialInfo[0].series_name = otherSeries[0].name_zh;
// console.log("series name", otherSeries[0].name_zh);

// console.log(otherProducts[0]);
// res.json(otherProducts[0]);
