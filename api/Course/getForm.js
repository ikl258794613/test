const express = require("express");
const router = express.Router();
const connection = require("../../database/db");


router.post("/", async (req, res) => {
    console.log(req.body);
    const course_priceAndPeople = req.body.form__price
    const course_people_before = req.body.form__price
    const price = course_priceAndPeople.substring(7);
    const course_price = price.replace(/[,]+/g, "")
    const course_place = req.body.form__place
    const course_program = req.body.form__program
    const course_date = req.body.form__calendar
    const course_time = req.body.form__time
    const course_number_of_people = course_people_before.substring(0,2);

    console.log(course_number_of_people, course_price, course_place, course_program, course_date, course_time );
    let courseInsert = await connection.queryAsync("INSERT INTO course_cart (price, place, program, date, time, number_of_people, course_id, member_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [course_price, course_place, course_program, course_date, course_time, course_number_of_people, 1, 1]);


res.json(courseInsert);
});

module.exports = router;