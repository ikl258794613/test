const express = require('express')
const router =  express.Router()
const connection = require('../../database/db')

// memo of handling add cart and favorite constructor //
// identify member
// get data from client
// select custom code from popular table to get product id
// if not exist insert requiued info to create data, if existed update popularity
// select member from cart | favorite table to get data
// if member does not exist, insert data
// if member dose exist, use response to deal with rest of the things

async function updatePolularTable (req) {
  const { productCode, topNote, middleNote, baseNote, serieId, serieName, productImage, color } = req.body

  // check if popular table has data or not
  const queryProductRes = await connection.queryAsync('SELECT * FROM customized_popular WHERE cust_id = ?', [productCode])

  // update popular table
  if (queryProductRes.length > 0) {
    // data exist, raise popularity
    const res = await connection.queryAsync('UPDATE customized_popular SET popularity = popularity + 1 WHERE cust_id = ?', [productCode]) 
  }else {
    // data not exist, create product data
    const custId = productCode
    const topId = topNote.ingredientId
    const middleId = middleNote.ingredientId
    const baseId = baseNote.ingredientId
    const topZh = topNote.title
    const middleZh = middleNote.title
    const baseZh = baseNote.title
    const totalPrice = topNote.price + middleNote.price + baseNote.price
    const insertData = [custId, topId, middleId, baseId, serieId, topZh, middleZh, baseZh, serieName, productImage, color, totalPrice]

    const res = await connection.queryAsync('INSERT customized_popular(cust_id, top_id, mid_id, base_id, frag_id, top_zh, mid_zh, base_zh, serie_zh, bottle_img, color, price) VALUE(?)', [insertData])
  }
}

async function getProductId(productCode) {
  const dbProductId = await connection.queryAsync('SELECT id FROM customized_popular WHERE cust_id = ?', [productCode])
  // console.log("product's id: ", dbProductId[0].id)

  return dbProductId[0].id
}

async function updateCartOrFavTable(memberId, productId, tableName) {
  // check if there is member's column in cart table or not
  // create one if not, update it if already has one
  const queryMemberRes = await connection.queryAsync(`SELECT * FROM ${tableName} WHERE member_id = ?`, [memberId])
  // console.log('query member: ', queryMemberRes)

  if (queryMemberRes.length === 0 ){
    // member does not have cart
    const res = await connection.queryAsync(`INSERT INTO ${tableName}(member_id, customized_id, customized_quantity) VALUE(?, ?, ?)`, [memberId, productId, 1])

  } else {
    // member already has cart
    const userData = queryMemberRes[0]
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

      const res = await connection.queryAsync(`UPDATE ${tableName} SET customized_quantity = ? WHERE member_id = ?`, [quantityStr, memberId])
      // console.log("updated successfully!", res)
    } else {
      // not on the list
      const productStr = [...productArr, productId].join(',')
      const quantityStr = [...quantityArr, 1].join(',')

      const res = await connection.queryAsync(`UPDATE ${tableName} SET customized_id = ?, customized_quantity = ? WHERE member_id = ?`, [productStr, quantityStr, memberId])
      // console.log("updated successfully!", res)
    }
  }
}

router.post('/addcart', async (req,res) => {
  // console.log(req.body)
  const memberId = req.session.mid
  const { productCode } = req.body
  const tableName = 'customized_cart'

  // update popular table
  await updatePolularTable(req) 

  // get product id from database
  const productId = await getProductId(productCode)

  // update cart or favorite table 
  const result = await updateCartOrFavTable(memberId, productId, tableName)

  res.json({'message': 'cart table updated successfully!!'})
})

router.post('/addfavorite', async (req,res) => {
  // console.log(req.body)
  const memberId = req.session.mid
  const { productCode } = req.body
  const tableName = 'customized_collect'

  // update popular table
  await updatePolularTable(req) 

  // get product id from database
  const productId = await getProductId(productCode)

  // update cart or favorite table 
  const result = await updateCartOrFavTable(memberId, productId, tableName)

  res.json({'message': 'favorite table updated successfully!!'})
})

router.get('/', async (req,res) => {
  const fragranceData = await connection.queryAsync('SELECT * FROM customized_fragrance')
  const ingredientData = await connection.queryAsync('SELECT * FROM customized_ingredient')

  const response = {fragranceData, ingredientData}
  res.json(response)
})

module.exports = router