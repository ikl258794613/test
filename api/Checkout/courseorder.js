const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.post("/", async (req, res) => {
  console.log(req.body)
  const { course_id , place , date, package,people,period, price} = req.body
  const memberId = 1
  function getId() {  
    let date = Date.now();
    let rund = Math.ceil(Math.random()*10)
    let id = date + '' + rund;
    return id;
  }
  let orderNumber =  getId()
  const order = await connection.queryAsync(`INSERT INTO course_end_order (member_id, course_id, place,date,package,people,period,price,order_id) VALUES (?,?,?,?,?,?,?,?,?)`,
  [memberId,course_id, place,date,package,people,period,price, orderNumber])
  });
  
  module.exports = router;
  