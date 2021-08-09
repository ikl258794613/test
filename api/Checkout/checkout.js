const { map } = require("bluebird");
const express = require("express");
// const { map } = require("../../app");
const router = express.Router();
const connection = require("../../database/db");

/* 官方 */
router.get("/official", async (req, res) => {
  // let targetMemberId = 1;
  const targetMemberId = req.session.mid
; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM official_cart WHERE member_id=?",
    [targetMemberId]
  );
  let officialIdArray = targetMemberCart[0].product_id.split(",").map(Number);
  console.log(officialIdArray);
  // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋

  let totalOfficialInformation = [];
  for (let i = 0; i < officialIdArray.length; i++) {
    const officialInformation = await connection.queryAsync(
      "SELECT * FROM official_product WHERE id=?",
      [officialIdArray[i]]
    );
    totalOfficialInformation.push(officialInformation[0]);
  }

  /* 官方：購物車資料表數量取代官方資料表數量 */
  let officialQuantityArray = targetMemberCart[0].product_quantity
    .split(",")
    .map(Number);
  console.log(officialQuantityArray);
  totalOfficialInformation.map((item, i) => {
    return (item.quantity = officialQuantityArray[i]);
  });

  /* 官方：增加系列中文名稱 */
  for (let i = 0; i < officialIdArray.length; i++) {
    const seriesInformation = await connection.queryAsync(
      "SELECT official_series.name_zh FROM official_series JOIN official_product ON official_series.id = official_product.series_id WHERE official_product.id=?",
      [officialIdArray[i]]
    );
    totalOfficialInformation[i].series_name = seriesInformation[0].name_zh;
  }

  const totalApiInformation = {};
  totalApiInformation.official = totalOfficialInformation;

  console.log(totalOfficialInformation);
  res.json(totalOfficialInformation);
});

/* 客製化 */
router.get("/custom", async (req, res) => {
  // let targetMemberId = 1;
  const targetMemberId = req.session.mid
; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM customized_cart WHERE member_id=?",
    [targetMemberId]
  );
  let customIdArray = targetMemberCart[0].customized_id.split(",").map(Number);
  console.log(customIdArray);
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
  console.log(customQuantityArray);
  totalCustomInformation.map((item, i) => {
    return (item.quantity = customQuantityArray[i]);
  });

  /* 客製化：增加香調中文名稱 */
  for (let i = 0; i < customIdArray.length; i++) {
    const fragranceInformation = await connection.queryAsync(
      "SELECT name_zh FROM customized_fragrance JOIN customized_popular ON customized_fragrance.id = customized_popular.frag_id WHERE customized_popular.id=?",
      [customIdArray[i]]
    );
    totalCustomInformation[i].fragrance_name = fragranceInformation[0].name_zh;
  }
  const totalApiInformation = {};
  totalApiInformation.custom = totalCustomInformation;
  console.log(totalCustomInformation);
  res.json(totalCustomInformation);
});

/* 課程 */
router.get("/course", async (req, res) => {
  // let targetMemberId = 1;
  const targetMemberId = req.session.mid
; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM course_cart WHERE member_id=?",
    [targetMemberId]
  );
  let courseIdArray = targetMemberCart[0].course_id;
  // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
  let totalCourseInformation = [];

  /* 課程 */
  const courseInformation = await connection.queryAsync(
    "SELECT * FROM course WHERE course_id=?",
    [courseIdArray]
  );
  totalCourseInformation.push(courseInformation[0]);

  /* 課程：增加課程方案 */
  let coursePackage = targetMemberCart[0].program;
  console.log(coursePackage);
  /* 課程：增加課程日期 */
  let courseDate = targetMemberCart[0].date;
  console.log(courseDate);
  /* 課程：增加課程方案時段 */
  let coursePeriod = targetMemberCart[0].time;
  console.log(coursePeriod);
  /* 課程：增加課程地點 */
  let coursePlace = targetMemberCart[0].place;
  console.log(coursePlace);
  /* 課程：增加課程方案價格 */
  let coursePrice = targetMemberCart[0].price;
  console.log(coursePrice);
  /* 課程：增加課程人數 */
  let coursePeople = targetMemberCart[0].number_of_people;
  console.log(coursePeople);
  /* 課程：增加課程方案數量 */
  let courseQuantity = targetMemberCart[0].qty;
  console.log(courseQuantity);
  totalCourseInformation.map((item) => {
    return (
      (item.package = coursePackage),
      (item.date = courseDate),
      (item.period = coursePeriod),
      (item.place = coursePlace),
      (item.price = coursePrice),
      (item.people = coursePeople),
      (item.quantity = courseQuantity)
    );
  });

  const totalApiInformation = {};
  totalApiInformation.course = totalCourseInformation;
  console.log(totalCourseInformation);
  res.json(totalCourseInformation);
});

/* 會員 */
router.get("/member", async (req, res) => {
  // let targetMemberId = 1;
  const targetMemberId = req.session.mid
; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM official_cart WHERE member_id=?",
    [targetMemberId]
  );

  let memberIdArray = targetMemberCart[0].member_id;
  let totalMemberInformation = [];

  const memberInformation = await connection.queryAsync(
    "SELECT * FROM member WHERE id=?",
    [memberIdArray]
  );
  totalMemberInformation.push(memberInformation[0]);

  const totalApiInformation = {};
  totalApiInformation.member = totalMemberInformation;
  console.log(totalMemberInformation);
  res.json(totalMemberInformation);
});

/* 店鋪 */
router.get("/store", async (req, res) => {
  let coursePlace = await connection.queryAsync("SELECT * From course_place");
  let result = {};
  result.place = coursePlace;
  res.json(result);
});

module.exports = router;


