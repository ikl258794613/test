const express = require("express");
const router = express.Router();
const connection = require("../../database/db");
  
//1.checkMemberCollect() 判斷official_collect資料表有沒有此會員，有會員id就檢查是否有此商品。沒有創立新的一筆資料並把資料放進去(result.length===0)。
//2.checkProductInCollect() 有會員id情況下檢查是否有此商品，有則找到對應productId刪除(取消我的最愛)。沒有加入新商品id(加入我的最愛)

async function checkMemberCollect (memberId,productId){
  const result = await connection.queryAsync("SELECT * FROM official_collect WHERE member_id=?",
  [memberId])
  if(result.length === 0){
    const res = await connection.queryAsync(`INSERT INTO official_collect(member_id, product_id) VALUE(?, ?)`, [memberId, productId])
  }else{
    checkProductInCollect(memberId,productId)
  }
}

async function checkProductInCollect (memberId,productId){
    //目標會員我的最愛內的商品id
    const memberCollectRes = await connection.queryAsync(`SELECT * FROM official_collect WHERE member_id = ?`, [memberId])
    const userData = memberCollectRes[0]
    
    const productArr = userData.product_id.split(',').map(Number)
    
    const index = productArr.findIndex((item) => {
        return productId === item
      })
    
    if (index > -1) {
        // 有在我的最愛內，目標商品取消我的最愛
        console.log("這是資料庫在後端處理後的",productArr)
        productArr.splice(index, 1)
        const productStr = [...productArr].join(',')
        // let sql = `UPDATE official_collect SET product_id = ${productStr} WHERE member_id = 2`
        // console.log("這是sql",sql)
        const res = await connection.queryAsync(`UPDATE official_collect SET product_id = ? WHERE member_id = ?`, [productStr, memberId])
    } else {
        // 不在我的最愛內，目標商品加入我的最愛
        const productStr = [...productArr, productId].join(',')
        // console.log("不在我的最愛內",productStr)
        const res = await connection.queryAsync(`UPDATE official_collect SET product_id = ? WHERE member_id = ?`, [productStr, memberId])
        // console.log("updated successfully!", res)
    }
  }

router.post('/', async (req,res) => {
    // console.log(req.body)
    // console.log("這是會員的Collect")
    const { productId , memberId } = req.body.params
    checkMemberCollect(memberId,productId)
  
    res.json({'message': 'successfully!!'})
  })
  
  module.exports = router;
  