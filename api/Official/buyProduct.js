const express = require("express");
const router = express.Router();
const connection = require("../../database/db");
  
//1.checkMemberCart() 判斷official_cart資料表有沒有此會員，有會員id就檢查是否有此商品。沒有創立新的一筆資料並把資料放進去(result.length===0)。
//2.checkProductInCart() 有會員id情況下檢查是否有此商品，有則找到對應productQuantity[index]數量+1。沒有加入新商品id，productQuantity:1

async function checkMemberCart (memberId,productId){
  const result = await connection.queryAsync("SELECT * FROM official_cart WHERE member_id=?",
  [memberId])
  if(result.length===0){
    const res = await connection.queryAsync(`INSERT INTO official_cart(member_id, product_id, product_quantity) VALUE(?, ?, ?)`, [memberId, productId, 1])
  }else{
    checkProductInCart(memberId,productId)
  }
}

async function checkProductInCart (memberId,productId){
    //目標會員購物車內的商品id和商品數量
    const memberCartRes = await connection.queryAsync(`SELECT * FROM official_cart WHERE member_id = ?`, [memberId])
    const userData = memberCartRes[0]
    const productArr = userData.product_id.split(',').map(Number)
    const quantityArr = userData.product_quantity.split(',').map(Number)

    const index = productArr.findIndex((item) => {
        return productId == item
      })
    
    if (index > -1) {
        // 有在購物車內，目標商品數量+1
        quantityArr[index] += 1
        const quantityStr = quantityArr.join(',')
        const res = await connection.queryAsync(`UPDATE official_cart SET product_quantity = ? WHERE member_id = ?`, [quantityStr, memberId])

    } else {
        // 不在購物車內，目標商品數量0=>1
        const productStr = [...productArr, productId].join(',')
        const quantityStr = [...quantityArr, 1].join(',')
  
        const res = await connection.queryAsync(`UPDATE official_cart SET product_id = ?, product_quantity = ? WHERE member_id = ?`, [productStr, quantityStr, memberId])
        // console.log("updated successfully!", res)
    }
  }

router.post('/', async (req,res) => {
    // console.log(req.body)
    // const { productId , productQuantity , memberId } = req.body.params
    const memberId = req.session.mid
    const { productId , productQuantity } = req.body.params
    checkMemberCart(memberId,productId)
  
    res.json({'message': 'successfully!!'})
  })
  
  module.exports = router;
  