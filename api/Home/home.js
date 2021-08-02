const express = require('express')
const router = express.Router()
const connection = require('../../database/db')

router.get('/bestseller', async (req, res) => {
  const response = await connection.queryAsync('SELECT * FROM customized_popular ORDER BY popularity DESC LIMIT 15')
  const output = response.map((item, i) => {
    item.sequence = i + 1
    return item
  })
  res.json(output)
})

module.exports = router