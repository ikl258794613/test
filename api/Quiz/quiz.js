const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
  let question = await connection.queryAsync("SELECT DISTINCT * From test_topic ORDER BY RAND() LIMIT 5");      
  console.log(question)

  // let answer = await connection.queryAsync(
  //   "SELECT * FROM test_topic JOIN test_answer ON test_topic.topic_order = test_answer.topic_order JOIN test_answer_type ON test_answer.answer_type_id = test_answer_type.answer_type_id"
  // ); 
  // console.log(answer)

  let result = {};
  result.question = question;
  // result.answer = answer;
  res.json(result);
});

module.exports = router;
