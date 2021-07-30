    const express = require("express");
   const router = express.Router();
   const connection = require("../../database/db");

    // 查詢課程標題、標題說明及內文
   router.get("/", async (req, res) => {
   let courseName = await connection.queryAsync("SELECT course_name_ch, course_title_ch, course_description_ch, course_img FROM course");
   let coursePlace = await connection.queryAsync("SELECT * From course_place");
   let result = {};
   result.name= courseName;
   result.place= coursePlace;
   res.json(result);
   
});

   module.exports = router;