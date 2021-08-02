const express = require("express");
const router = express.Router();
const connection = require("../../database/db");


router.post("/", async (req, res) => {
    console.log(req.body);
    
    const course_collect_title = req.body.title
    const course_collect_ingo = req.body.info
    const course_collect_img = req.body.img

    
    let addCollect = await connection.queryAsync("INSERT INTO course_collect (course_id, member_id, course_name_ch, course_img, course_description_ch) VALUES (?, ?, ?, ?, ?)", [1, 1, course_collect_title, course_collect_img, course_collect_ingo]);


    res.json(addCollect);
    // res.json({node: 'OK'})
});

module.exports = router;