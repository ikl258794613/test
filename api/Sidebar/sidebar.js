const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

//-------------------- 官方產品購物車 --------------------
router.get("/official", async (req, res) => {
  let targetMemberId = req.session.mid;
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM official_cart WHERE member_id=?",
    [targetMemberId]
  );

  let totalOfficialInformation = [];

  if (targetMemberCart[0].product_id !== "") {
    let officialIdArray = targetMemberCart[0].product_id.split(",").map(Number); // product_id must not be an empty string!!!
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
  }
  res.json(totalOfficialInformation);
});

/* -------------------- 客製化產品購物車 -------------------- */
router.get("/custom", async (req, res) => {
  let targetMemberId = req.session.mid; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM customized_cart WHERE member_id=?",
    [targetMemberId]
  );
  let totalCustomInformation = [];

  if (targetMemberCart[0].customized_id !== "") {
    let customIdArray = targetMemberCart[0].customized_id
      .split(",")
      .map(Number);
    // console.log(customIdArray);
    // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
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
      totalCustomInformation[i].fragrance_name =
        fragranceInformation[0].name_zh;
    }
  }

  res.json(totalCustomInformation);
});

/* -------------------- 課程產品購物車 -------------------- */
router.get("/course", async (req, res) => {
  let targetMemberId = req.session.mid; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id

  let totalCourseInformation = [];

  const targetMemberCart = await connection.queryAsync(
    "SELECT * FROM course_cart WHERE member_id=?",
    [targetMemberId]
  );
  let courseIdArray = targetMemberCart[0].course_id;
  // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
  /* 課程 */
  const courseInformation = await connection.queryAsync(
    "SELECT * FROM course WHERE course_id=?",
    [courseIdArray]
  );

  totalCourseInformation.push(courseInformation[0]);
  /* 課程：增加課程方案 */
  let coursePackage = targetMemberCart[0].program;
  /* 課程：增加課程日期 */
  let courseDate = targetMemberCart[0].date;
  /* 課程：增加課程方案時段 */
  let coursePeriod = targetMemberCart[0].time;
  /* 課程：增加課程地點 */
  let coursePlace = targetMemberCart[0].place;
  /* 課程：增加課程方案價格 */
  let coursePrice = targetMemberCart[0].price;
  /* 課程：增加課程人數 */
  let coursePeople = targetMemberCart[0].number_of_people;
  /* 課程：增加課程方案數量 */
  let courseQuantity = targetMemberCart[0].qty;
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
  res.json(totalCourseInformation);
});

// -------------------- 官方產品收藏清單 --------------------
router.get("/officialCollect", async (req, res) => {
  let tarrgetMemberId = req.session.mid;
  const targetMemberCollect = await connection.queryAsync(
    "SELECT *  FROM official_collect WHERE member_id=?",
    [tarrgetMemberId]
  );

  let totalCollectInformation = [];

  if (targetMemberCollect[0].product_id !== "") {
    let collectIdArray = targetMemberCollect[0].product_id
      .split(",")
      .map(Number);

    //取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
    for (let i = 0; i < collectIdArray.length; i++) {
      const productInformation = await connection.queryAsync(
        "SELECT *  FROM official_product WHERE id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation.push(productInformation[0]);
    }

    //官方：增加系列中文名稱
    for (let i = 0; i < collectIdArray.length; i++) {
      const seriesInformation = await connection.queryAsync(
        "SELECT official_series.name_zh FROM official_series JOIN official_product ON official_series.id = official_product.series_id WHERE official_product.id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation[i].series_name = seriesInformation[0].name_zh;
    }
  }

  res.json(totalCollectInformation);
});

// -------------------- 客製化產品收藏清單 --------------------
router.get("/customCollect", async (req, res) => {
  let tarrgetMemberId = req.session.mid;
  const targetMemberCustomCollect = await connection.queryAsync(
    "SELECT *  FROM customized_collect WHERE member_id=?",
    [tarrgetMemberId]
  );
  //
  let totalCollectInformation = [];

  let collectIdArray = targetMemberCustomCollect[0].customized_id
    .split(",")
    .map(Number);

  if (targetMemberCustomCollect[0].customized_id !== "") {
    for (let i = 0; i < collectIdArray.length; i++) {
      const collectInformation = await connection.queryAsync(
        "SELECT * FROM customized_popular WHERE id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation.push(collectInformation[0]);
      let top = collectInformation[0].top_zh;
      let mid = collectInformation[0].mid_zh;
      let base = collectInformation[0].base_zh;
      let customIngredient = [top, mid, base];
      totalCollectInformation[i].custom_ingredient =
        customIngredient.join("、");
      totalCollectInformation[i].quantity = 1;
    }

    for (let i = 0; i < collectIdArray.length; i++) {
      const fragranceInformation = await connection.queryAsync(
        "SELECT name_zh FROM customized_fragrance JOIN customized_sold ON customized_fragrance.id = customized_sold.frag_id WHERE customized_sold.id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation[i].fragrance_name =
        fragranceInformation[0].name_zh;
    }
  }

  res.json(totalCollectInformation);
});

// -------------------- 課程收藏清單 --------------------

router.get("/courseCollect", async (req, res) => {
  let targetMemberId = req.session.mid;

  const targetMemberCollect = await connection.queryAsync(
    "SELECT * FROM course_collect WHERE member_id=?",
    [targetMemberId]
  );
  res.json(targetMemberCollect);
});

// 更新 official_cart 以及 Customized_cart 資料表
async function updateCart(memberID, productIDs, productQTYs, tableName) {
  const queryMemberRes = await connection.queryAsync(
    `SELECT * FROM ${tableName} WHERE member_id = ?`,
    [memberID]
  );

  if (queryMemberRes.length === 0 && tableName === "official_cart") {
    const res = await connection.queryAsync(
      `INSERT INTO ${tableName}(member_id, 	product_id, product_quantity) VALUE(?, ?, ?)`,
      [memberID, productIDs, productQTYs]
    );
  } else if (queryMemberRes.length === 0 && tableName === "customized_cart") {
    const res = await connection.queryAsync(
      `INSERT INTO ${tableName}(member_id, 	customized_id, customized_quantity) VALUE(?, ?, ?)`,
      [memberID, productIDs, productQTYs]
    );
  } else if (tableName === "official_cart") {
    const res = await connection.queryAsync(
      `UPDATE ${tableName} SET product_id = ?, product_quantity = ? WHERE member_id = ?`,
      [productIDs, productQTYs, memberID]
    );
  } else if (tableName === "customized_cart") {
    const res = await connection.queryAsync(
      `UPDATE ${tableName} SET customized_id = ?, customized_quantity = ? WHERE member_id = ?`,
      [productIDs, productQTYs, memberID]
    );
  }
}

// 更新 official_collect 以及 customized_collect 資料表
async function updateCollect(memberID, productIDs, tableName, productQTYs) {
  const queryMemberRes = await connection.queryAsync(
    `SELECT * FROM ${tableName} WHERE member_id = ?`,
    [memberID]
  );

  if (queryMemberRes.length === 0) {
    if (tableName === "official_collect") {
      const res = await connection.queryAsync(
        `INSERT INTO ${tableName}(member_id, 	product_id) VALUE(?, ?)`,
        [memberID, productIDs]
      );
    } else if (tableName === "customized_collect") {
      const res = await connection.queryAsync(
        `INSERT INTO ${tableName}(member_id, 	customized_id, customized_quantity) VALUE(?, ?, ?)`,
        [memberID, productIDs, productQTYs]
      );
    }
  } else if (tableName === "official_collect") {
    const res = await connection.queryAsync(
      `UPDATE ${tableName} SET product_id = ? WHERE member_id = ?`,
      [productIDs, memberID]
    );
  } else if (tableName === "customized_collect") {
    const res = await connection.queryAsync(
      `UPDATE ${tableName} SET customized_id = ?, customized_quantity = ? WHERE member_id = ?`,
      [productIDs, productQTYs, memberID]
    );
  }
}
// ------------------ Test 接收從前端來的資料 ----------------------
router.post("/updateOfficialCart", async (req, res) => {
  const member_id = req.session.mid;
  const officialProductIDs = req.body.productIds;
  const officialProductQTYs = req.body.productQuantitys;

  updateCart(
    member_id,
    officialProductIDs,
    officialProductQTYs,
    "official_cart"
  );

  res.json({ message: "updateOfficialCart !!!!" });
});

router.post("/updateCustomCart", async (req, res) => {
  const member_id = req.session.mid;
  const officialProductIDs = req.body.productIds;
  const officialProductQTYs = req.body.productQuantitys;
  updateCart(
    member_id,
    officialProductIDs,
    officialProductQTYs,
    "customized_cart"
  );

  res.json({ message: "updateCustomCart !!!!" });
});

router.post("/updateOfficialCollect", async (req, res) => {
  const member_id = req.session.mid;
  // console.log(req.body);
  const officialProductIDs = req.body.product_id;
  updateCollect(member_id, officialProductIDs, "official_collect");
  res.json({ message: "updateOfficialCollect !!!!" });
});

router.post("/updateCustomCollect", async (req, res) => {
  const member_id = req.session.mid;
  const customCollectIDs = req.body.customized_id;
  const customCollectQTYs = req.body.customized_quantity;

  updateCollect(
    member_id,
    customCollectIDs,
    "customized_collect",
    customCollectQTYs
  );
  res.json({ message: "updateCustomCollect !!!!" });
});

module.exports = router;
