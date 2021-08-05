const express = require("express");
const router = express.Router();
// const connection = require("../../database/db");
// const userController = require('./controllers/user')
const promisePool = require('../../database/dblogin').promisePool

async function updateCartOrFavTable(memberId, productId, tableName) {
  // check if there is member's column in cart table or not
  // create one if not, update it if already has one
  const queryMemberRes = await promisePool.query(`SELECT * FROM ${tableName} WHERE member_id = ?`, [memberId])
  // console.log('query member: ', queryMemberRes)

  if (queryMemberRes.length === 0 ){
    // member does not have cart
    const res = await promisePool.query(`INSERT INTO ${tableName}(member_id, customized_id, customized_quantity) VALUE(?, ?, ?)`, [memberId, productId, 1])

  } else {
    // member already has cart
    const userData = queryMemberRes[0][0]
    const productArr = userData.customized_id.split(',').map(Number)
    const quantityArr = userData.customized_quantity.split(',').map(Number)

    // is the product in the cart list or not
    const index = productArr.findIndex((item) => {
      return productId === item
    })
    // console.log('index of product id: ', index)

    if (index > -1) {
      // on the list
      quantityArr[index] += 1
      const quantityStr = quantityArr.join(',')

      const res = await promisePool.query(`UPDATE ${tableName} SET customized_quantity = ? WHERE member_id = ?`, [quantityStr, memberId])
      // console.log("updated successfully!", res)
    } else {
      // not on the list
      const productStr = [...productArr, productId].join(',')
      const quantityStr = [...quantityArr, 1].join(',')

      const res = await promisePool.query(`UPDATE ${tableName} SET customized_id = ?, customized_quantity = ? WHERE member_id = ?`, [productStr, quantityStr, memberId])
      // console.log("updated successfully!", res)
    }
  }
}

router.post('/cart', async (req,res) => {
  const token = req.header("Authorization")
  // console.log(req.body)
  const memberId =  token
  const productId = req.body.id
  const tableName = 'customized_cart'

  // update cart or favorite table 
  const result = await updateCartOrFavTable(memberId, productId, tableName)

  res.json({'message': 'cart table updated successfully!!'})
})



// 取得會員資料
router.get('/profile', async (req, res, next) => {
    // read jwt token
    const token = req.header("Authorization")
    console.log("會員ID:",token)
    // verify
    let memberId = token

    const getUser = await promisePool.query(
        "SELECT * FROM member WHERE id=?",
        [memberId]
      );
      res.json(getUser[0][0])
  })
// 修改會員資料
router.post('/profile', async (req, res) => {
  const token = req.header("Authorization")
  console.log("會員ID:",token)
    const member_profiles = req.body.values.member_profiles
    const member_account = req.body.values.member_account
    const member_name = req.body.values.member_name
    const member_nickname = req.body.values.nickname
    const member_birth = req.body.values.member_birth
    const member_password = req.body.values.member_password
    const member_email = req.body.values.member_email
    const member_phone = req.body.values.member_phone
    const member_address = req.body.values.member_address
    const member_receive = req.body.values.member_receive
    let memberId = token


    const updateUser = await promisePool.query(
        `UPDATE member SET member_profiles = ?, member_account = ?, member_name = ?, nickname = ?, member_birth = ?, member_password = ?, member_email = ?, member_phone = ?, member_address = ?, member_receive = ? WHERE id = ${memberId}`,
        [member_profiles, member_account, member_name, member_nickname, member_birth, member_password, member_email, member_phone, member_address, member_receive]
      );
      res.json(updateUser)
})

// 取得會員收藏的課程
router.get('/favorites/course', async (req, res) => {
  const token = req.header("Authorization")
  console.log("會員ID:",token)
    let memberId = token
    const getCourse = await promisePool.query(
        "SELECT * FROM course_collect WHERE member_id=?",
        [memberId]
      );
      res.json(getCourse[0])
      console.log(getCourse[0])
    //   let totalCollectInformation = [];
    //   totalCollectInformation.push(getCourse[0][0]);
    //   res.json(totalCollectInformation)
    });

// official_collect （珍藏清單）資料表的 API
router.get("/officialCollect", async (req, res) => {
  const token = req.header("Authorization")
  console.log("會員ID:",token)

    let tarrgetMemberId = token; //這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
    const targetMemberCollect = await promisePool.query(
      "SELECT *  FROM official_collect WHERE member_id=?",
      [tarrgetMemberId]
    );

    let collectIdArray = targetMemberCollect[0][0].product_id.split(",").map(Number);
    //取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
    let totalCollectInformation = [];
    for (let i = 0; i < collectIdArray.length; i++) {
      const productInformation = await promisePool.query(
        "SELECT *  FROM official_product WHERE id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation.push(productInformation[0][0]);
    }
    res.json(totalCollectInformation);
  });
  // customized_collect （珍藏清單）資料表的 API
router.get("/customCollect", async (req, res) => {
  const token = req.header("Authorization")
  console.log("會員ID:",token)

    let tarrgetMemberId = token; //這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
    const targetMemberCollect = await promisePool.query(
      "SELECT *  FROM customized_collect WHERE member_id=?",
      [tarrgetMemberId]
    );
    let collectIdArray = targetMemberCollect[0][0].customized_id.split(",").map(Number);
    //取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
    let totalCollectInformation = [];
    for (let i = 0; i < collectIdArray.length; i++) {
      const productInformation = await promisePool.query(
        "SELECT *  FROM customized_popular WHERE id=?",
        [collectIdArray[i]]
      );
      totalCollectInformation.push(productInformation[0][0]);
    }
    res.json(totalCollectInformation);
  });

  router.get("/official", async (req, res) => {
    const token = req.header("Authorization")
    console.log("會員ID:",token)
    let targetMemberId = token;
    const targetMemberCart = await promisePool.query(
      "SELECT * FROM official_cart WHERE member_id=?",
      [targetMemberId]
    );

    let officialIdArray = targetMemberCart[0][0].product_id.split(",").map(Number);
    // value of officialIdArray => [ 1, 2, 3, 4 ]
  
    let totalOfficialInformation = [];
    for (let i = 0; i < officialIdArray.length; i++) {
      const officialInformation = await promisePool.query(
        "SELECT * FROM official_product WHERE id=?",
        [officialIdArray[i]]
      );
      totalOfficialInformation.push(officialInformation[0][0]);
    }
  
    // 官方：購物車資料表數量取代官方資料表數量
    let officialQuantityArray = targetMemberCart[0][0].product_quantity
      .split(",")
      .map(Number);
  
    // 用購物車資料表的數量取代官方產品資料表原本的數量
    totalOfficialInformation.map((item, i) => {
      return (item.quantity = officialQuantityArray[i]);
    });
  
    //官方：增加系列中文名稱
    for (let i = 0; i < officialIdArray.length; i++) {
      const seriesInformation = await promisePool.query(
        "SELECT official_series.name_zh FROM official_series JOIN official_product ON official_series.id = official_product.series_id WHERE official_product.id=?",
        [officialIdArray[i]]
      );
      totalOfficialInformation[i].series_name = seriesInformation[0][0].name_zh;
    }
    const totalApiInformation = {};
    totalApiInformation.official = totalOfficialInformation;
    res.json(totalOfficialInformation);
  });
  
  
  /* 客製化 */
  router.get("/custom", async (req, res) => {
    const token = req.header("Authorization")
    console.log("會員ID:",token)
    let targetMemberId = token; // 這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id
    const targetMemberCart = await promisePool.query(
      "SELECT * FROM customized_cart WHERE member_id=?",
      [targetMemberId]
    );

    let customIdArray = targetMemberCart[0][0].customized_id.split(",").map(Number);
    // console.log(customIdArray);
    // 取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
    let totalCustomInformation = [];
    for (let i = 0; i < customIdArray.length; i++) {
      const customInformation = await promisePool.query(
        "SELECT * FROM customized_popular WHERE id=?",
        [customIdArray[i]]
      );
      totalCustomInformation.push(customInformation[0][0]);
      /* 客製化：增加並重組材料中文名稱 */
      let top = customInformation[0][0].top_zh;
      let mid = customInformation[0][0].mid_zh;
      let base = customInformation[0][0].base_zh;
      let customIngredient = [top, mid, base];
      totalCustomInformation[i].custom_ingredient = customIngredient.join("、");
    }
    /* 客製化：購物車資料表數量取代官方資料表數量 */
    let customQuantityArray = targetMemberCart[0][0].customized_quantity
      .split(",")
      .map(Number);
    // console.log(customQuantityArray);
    totalCustomInformation.map((item, i) => {
      return (item.quantity = customQuantityArray[i]);
    });
    /* 客製化：增加香調中文名稱 */
    for (let i = 0; i < customIdArray.length; i++) {
      const fragranceInformation = await promisePool.query(
        "SELECT name_zh FROM customized_fragrance JOIN customized_sold ON customized_fragrance.id = customized_sold.frag_id WHERE customized_sold.id=?",
        [customIdArray[i]]
      );
      totalCustomInformation[i].fragrance_name = fragranceInformation[0][0].name_zh;
    }
    const totalApiInformation = {};
    totalApiInformation.custom = totalCustomInformation;
    // console.log(totalCustomInformation);
    res.json(totalCustomInformation);
  });


module.exports = router;