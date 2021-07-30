// mysql2
const promisePool = require('../../../database/dblogin.js').promisePool

// module.exports = {}

// constant
const tableName = 'member'

const idField = 'id'

const _createWhereSql = (params, type = 'AND') => {
  const where = []
  let whereSql = ''

  for (const [key, value] of Object.entries(params)) {
    // if value is not undefined
    if (value) {
      where.push(`${key} = '${value}'`)
    }
  }

  if (where.length) whereSql = ` WHERE ` + where.join(` ${type} `)

  return whereSql
}


// module.exports.findAll = async () => {
//   let sql = `SELECT * FROM ${tableName}`

//   try {
//     const [rows] = await promisePool.query(sql)
//     return rows
//   } catch (error) {
//     console.log('db/model error occurred: ', error)
//     return error
//   }
// }

// module.exports.findById = async (userId) => {
//   let sql = `SELECT * FROM ${tableName} WHERE ${idField} = ${userId}`

//   try {
//     const [rows] = await promisePool.query(sql)
//     return rows.length ? rows[0] : {}
//   } catch (error) {
//     console.log('db/model error occurred: ', error)
//     return error
//   }
// }

module.exports.findOne = async (query) => {
    let sql = `SELECT * FROM ${tableName}`
  
    // if has req.query
    const whereSql = _createWhereSql({
      member_phone: query.member_phone,
      member_password: query.member_password,
    })
    // console.log(sql + whereSql + ` LIMIT 0,1`)
    try {
      const [rows] = await promisePool.query(sql + whereSql + ` LIMIT 0,1`)
      console.log("rows:",rows)
      return rows[0] ? rows[0] : {}
    } catch (error) {
      console.log('db/model error occurred: ', error)
      return error
    }
  }
  