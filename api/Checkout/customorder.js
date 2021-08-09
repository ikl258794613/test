const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.post("/", async (req, res) => {
  // console.log(req.body)
  const memberId = req.session.mid
  const { number , qty , total, address } = req.body
  function getId() {  
    let date = Date.now();
    let rund = Math.ceil(Math.random()*10)
    let id = date + '' + rund;
    return id;
  }
  let orderNumber =  getId()
  let status = 1
  let items = number.toString()
  let itemsQty = qty.toString()
  const order = await connection.queryAsync(`INSERT INTO custom_end_order (	member_id, order_id, address,status,product_id,quantity,order_total) VALUES (?,?,?,?,?,?,?)`,
  [memberId, orderNumber, address,status,items,itemsQty,total])

  });
  
  module.exports = router;
  