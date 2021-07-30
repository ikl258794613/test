const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

// official_collect （珍藏清單）資料表的 API
router.get("/officialCollect", async (req, res) => {
  let tarrgetMemberId = 1; //這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCollect = await connection.queryAsync(
    "SELECT *  FROM official_collect WHERE member_id=?",
    [tarrgetMemberId]
  );
  let collectIdArray = targetMemberCollect[0].product_id.split(",").map(Number);
  //取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
  let totalCollectInformation = [];
  for (let i = 0; i < collectIdArray.length; i++) {
    const productInformation = await connection.queryAsync(
      "SELECT *  FROM official_product WHERE id=?",
      [collectIdArray[i]]
    );
    totalCollectInformation.push(productInformation[0]);
  }
  res.json(totalCollectInformation);
});

//官方產品
router.get("/official", async (req, res) => {
  let targetMemberId = 1;
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM official_cart WHERE member_id=?",
    [targetMemberId]
  );
  /* value of targetMemberCart 
  [
  TextRow {
    id: 1,
    member_id: 1,
    product_id: '1,2,3,4',
    product_quantity: '1,2,1,1'
  }
]
  */
  let officialIdArray = targetMemberCart[0].product_id.split(",").map(Number);
  // value of officialIdArray => [ 1, 2, 3, 4 ]

  let totalOfficialInformation = [];
  for (let i = 0; i < officialIdArray.length; i++) {
    const officialInformation = await connection.queryAsync(
      "SELECT * FROM official_product WHERE id=?",
      [officialIdArray[i]]
    );
    totalOfficialInformation.push(officialInformation[0]);
  }

  // 官方：購物車資料表數量取代官方資料表數量
  let officialQuantityArray = targetMemberCart[0].product_quantity
    .split(",")
    .map(Number);

  // 用購物車資料表的數量取代官方產品資料表原本的數量
  totalOfficialInformation.map((item, i) => {
    return (item.quantity = officialQuantityArray[i]);
  });

  //官方：增加系列中文名稱
  for (let i = 0; i < officialIdArray.length; i++) {
    const seriesInformation = await connection.queryAsync(
      "SELECT official_series.name_zh FROM official_series JOIN official_product ON official_series.id = official_product.series_id WHERE official_product.id=?",
      [officialIdArray[i]]
    );
    totalOfficialInformation[i].series_name = seriesInformation[0].name_zh;
  }
  const totalApiInformation = {};
  totalApiInformation.official = totalOfficialInformation;
  res.json(totalOfficialInformation);
});

//
// 這個是進度條
// 

/* 客製化 */
router.get("/custom", async (req, res) => {
  let targetMemberId = 1; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM customized_cart WHERE member_id=?",
    [targetMemberId]
  );
  let customIdArray = targetMemberCart[0].customized_id.split(",").map(Number);
  // console.log(customIdArray);
  // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
  let totalCustomInformation = [];
  for (let i = 0; i < customIdArray.length; i++) {
    const customInformation = await connection.queryAsync(
      "SELECT * FROM customized_popular WHERE id=?",
      [customIdArray[i]]
    );
    totalCustomInformation.push(customInformation[0]);
    /* 客製化：增加並重組材料中文名稱 */
    let top = customInformation[0].top_zh;
    let mid = customInformation[0].mid_zh;
    let base = customInformation[0].base_zh;
    let customIngredient = [top, mid, base];
    totalCustomInformation[i].custom_ingredient = customIngredient.join("、");
  }
  /* 客製化：購物車資料表數量取代官方資料表數量 */
  let customQuantityArray = targetMemberCart[0].customized_quantity
    .split(",")
    .map(Number);
  // console.log(customQuantityArray);
  totalCustomInformation.map((item, i) => {
    return (item.quantity = customQuantityArray[i]);
  });
  /* 客製化：增加香調中文名稱 */
  for (let i = 0; i < customIdArray.length; i++) {
    const fragranceInformation = await connection.queryAsync(
      "SELECT name_zh FROM customized_fragrance JOIN customized_sold ON customized_fragrance.id = customized_sold.frag_id WHERE customized_sold.id=?",
      [customIdArray[i]]
    );
    totalCustomInformation[i].fragrance_name = fragranceInformation[0].name_zh;
  }
  const totalApiInformation = {};
  totalApiInformation.custom = totalCustomInformation;
  // console.log(totalCustomInformation);
  res.json(totalCustomInformation);
});

/* 課程： */
router.get("/course", async (req, res) => {
  let targetMemberId = 33; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM course_cart WHERE member_id=?",
    [targetMemberId]
  );
  let courseIdArray = targetMemberCart[0].course_id;
  // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
  let totalCourseInformation = [];
  /* 課程： */
  const courseInformation = await connection.queryAsync(
    "SELECT * FROM course WHERE course_id=?",
    [courseIdArray]
  );
  totalCourseInformation.push(courseInformation[0]);
  /* 課程：增加課程報名人數 */
  let courseQuantity = targetMemberCart[0].number_of_people;
  // console.log(courseQuantity);
  /* 課程：增加課程報名方案 */
  let coursePackage = targetMemberCart[0].program;
  // console.log(coursePackage);
  totalCourseInformation.map((item) => {
    return (item.quantity = courseQuantity), (item.package = coursePackage);
  });
  const totalApiInformation = {};
  totalApiInformation.course = totalCourseInformation;
  // console.log(totalCourseInformation);
  res.json(totalCourseInformation);
});

module.exports = router;
