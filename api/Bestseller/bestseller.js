const express = require('express')
const router = express.Router()
const connection = require('../../database/db')

const getSeriesId = async (checkedSeries) => {
  // select related data for exchanging
  const seriesRes = await connection.queryAsync('SELECT id, name_zh FROM customized_fragrance')
  
  // exchange chinese name for serie's id 
  let seriesList = []
  for (let i=0; i<checkedSeries.length; i++) {
    const result = seriesRes.filter((item) => item.name_zh === checkedSeries[i])
    seriesList = [...seriesList, ...result]
  }

  // return array of series id
  const seriesIdArr = seriesList.map((item) => item.id)
  return seriesIdArr
}

const queryBySeries = async (seriesIdArr) => {
  let result = []

  for (let i=0; i<seriesIdArr.length; i++) {
    const stmt = 'SELECT * FROM customized_popular WHERE frag_id = ?'
    const response = await connection.queryAsync(stmt, seriesIdArr[i])
    result = [...result, ...response]
  }
  return result
}

const queryByDefault = async () => {
  // const stmt = 'SELECT * FROM customized_popular ORDER BY popularity DESC LIMIT 15'
  const stmt = 'SELECT * FROM customized_popular'
  const result = await connection.queryAsync(stmt)
  return result
}

const sortDataByOption = (sortBy, data) => {
  switch (sortBy) {
    case '價格由高至低':
      data.sort((a, b) => b.price - a.price)
      break
    case '價格由低至高':
      data.sort((a, b) => a.price - b.price)
      break
    default:
      // '每月人氣銷售'
      data.sort((a, b) => b.popularity - a.popularity)
      break
  }
  return data
}

const modifyData = (data) => {
  let output = []
  for (let i=0; i<data.length; i++) {
    data[i].sequence = i + 1
    if (output.length < 15) output.push(data[i])
  }
  return output
}

// send processed data back to client
router.get('/', async (req,res) => {
  // console.log(req.query)
  const { sortBy, checkedSeries } = req.query
  let data = []
  
  // query data
  if (checkedSeries !== undefined) {
    // by checkbox's options
    const seriesIdArr = await getSeriesId(checkedSeries)
    data = await queryBySeries(seriesIdArr)
  } else {
    // by popularity   
    data = await queryByDefault()
  }

  // sort data
  data = sortDataByOption(sortBy, data)

  // pick top 15 of data and then set up sequence key
  const response = modifyData(data)
  
  res.json(response)
})

// ========================================================

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
  const { data } = req.body
  const memberId = 8
  const productId = data.id
  const tableName = 'customized_cart'

  await updateCartOrFavTable(memberId, productId, tableName)

  res.json({'message': 'cart table updated successfully!!'})
})

module.exports = router