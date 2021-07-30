// mysql2
const promisePool = require('../../../database/dblogin.js').promisePool

// constant
const tableName = 'member'

const idField = 'id'

const userSchema = {
  id: 0,
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: '',
  // login: 0,
  // createdDate: '',
  // photos: '',
}

// 預設的分頁每頁數量
const defaultPerPage = 3

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

// for update use
const _createSetSql = (obj) => {
  const set = []
  let setSql = ''

  for (const [key, value] of Object.entries(obj)) {
    // omit the idField
    if (key === idField || key === 'createdDate') continue

    if (value) {
      // if value is not undefined
      set.push(`${key} = '${value}'`)
    }
  }

  if (set.length) setSql = ` SET ` + set.join(` , `)

  return setSql
}

/* below is exports */

module.exports.findAll = async () => {
  let sql = `SELECT * FROM ${tableName}`

  try {
    const [rows] = await promisePool.query(sql)
    return rows
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

// query = req.query =
// { name: xxxx, username: xxx, page: xxx, perPage: xxx,
//   sort:xxx, order:'asc' }
module.exports.find = async (query) => {
  // page=第幾頁
  const page = query.page || 1
  // perPage=每頁有幾項目
  const perPage = query.perPage || defaultPerPage

  let sql = `SELECT * FROM ${tableName}`

  const whereSql = _createWhereSql({
    name: query.name,
    email: query.email,
    username: query.username,
  })

  // limit sql
  const offset = perPage * (page - 1)
  const limitSql = ` LIMIT ${offset}, ${perPage}`

  // orderby sql
  // Note: only order by one column
  // ex. `?sort=username&order=desc`
  let orderSql = ''
  if (query.sort) {
    orderSql = ` ORDER BY ${query.sort} ${query.order ? query.order : 'ASC'}`
  }

  // count all rows
  const totalCountSql = `SELECT COUNT(1) AS totalCount FROM ${tableName} ${whereSql}`
  // count per page rows
  const pageCountSql = `SELECT COUNT(*) AS pageCount FROM (SELECT 1 FROM ${tableName} ${whereSql} ${limitSql}) t`

  try {
    console.log(sql + whereSql + orderSql + limitSql)
    const [rows] = await promisePool.query(sql + whereSql + orderSql + limitSql)
    const [resultTotalCount] = await promisePool.query(totalCountSql)
    const [resultPageCount] = await promisePool.query(pageCountSql)

    const totalCount = resultTotalCount[0].totalCount
    const pageCount = resultPageCount[0].pageCount

    return {
      metadata: {
        totalCount,
        pageCount,
        page,
        perPage,
      },
      records: rows,
    }
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

//
module.exports.findById = async (userId) => {
  let sql = `SELECT * FROM ${tableName} WHERE ${idField} = ${userId}`

  try {
    const [rows] = await promisePool.query(sql)
    return rows.length ? rows[0] : {}
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

// use name, email, username to find just one record
module.exports.findOne = async (query) => {
  let sql = `SELECT * FROM ${tableName}`

  // if has req.query
  const whereSql = _createWhereSql(query)

  console.log(sql + whereSql + ` LIMIT 0,1`)

  try {
    const [rows] = await promisePool.query(sql + whereSql + ` LIMIT 0,1`)
    console.log(rows)

    return rows[0] ? rows[0] : {}
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

module.exports.delete = async (userId) => {
  let sql = `DELETE FROM ${tableName} WHERE id = ${userId}`
  try {
    // update row
    const [result] = await promisePool.query(sql)
    console.log(sql, result)

    // select the update row
    if (result.affectedRows) {
      return { message: 'success' }
    } else {
      return { message: 'fail' }
    }
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

module.exports.create = async (user) => {
  let sql = `INSERT INTO ${tableName} ${_createSetSql(user)}`

  try {
    // insert new row to db server
    const [result] = await promisePool.query(sql)

    if (result.insertId) {
      // select the insert row
      const instance = module.exports.findById(result.insertId)
      return instance
    } else {
      return {}
    }
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

module.exports.update = async (user) => {
  let sql = `UPDATE ${tableName} ${_createSetSql(user)} WHERE id = ${user.id}`

  try {
    // update row
    const [result] = await promisePool.query(sql)

    // select the update row
    if (result.affectedRows) {
      const instance = module.exports.findById(user.id)
      return instance
    } else {
      return {}
    }
  } catch (error) {
    console.log('db/model error occurred: ', error)
    return error
  }
}

// for fb login use
// { facebookId: profile.id, name: profile.displayName }
module.exports.findOrCreate = async (user) => {
  const foundUser = await this.findOne(user)
  if (foundUser.id) {
    return foundUser
  } else {
    return this.create(user)
  }
}