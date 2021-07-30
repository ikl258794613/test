const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
    let tarrgetMemberId = 1 //這邊的1在實際使用時要帶入session的登入會員id =>EX: session.id 
    const targetMemberCart = await connection.queryAsync(
        "SELECT *  FROM course_cart WHERE member_id=?",
        [tarrgetMemberId]
    );
    let productIdArray =  targetMemberCart[0].product_id.split(",").map(Number)
    //取出member_id = 1的人購物車內的商品id轉成陣列放進sql搜尋
    let totalproductInformation = []
    for (let i = 0 ; i <productIdArray.length ; i++){
        const productInformation = await connection.queryAsync(
            "SELECT *  FROM official_product WHERE id=?",
            [productIdArray[i]]
        );
        totalproductInformation.push(productInformation)
    }
    const totalApiInformation = {}
    totalApiInformation.product = totalproductInformation
    totalApiInformation.productQuantity =  targetMemberCart[0].product_quantity

    console.log(totalApiInformation)
    res.json(totalApiInformation);
  });
  
  module.exports = router;
  