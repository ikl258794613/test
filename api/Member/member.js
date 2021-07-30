const express = require("express");
const router = express.Router();
// const connection = require("../../database/db");
const userController = require('./controllers/user')
const promisePool = require('../../database/dblogin').promisePool

// router.get("/profile", async (req, res) => {
// let A = await connection.queryAsync("SELECT * FROM 資料表");

// res.json(D);
// });

router.get('/profile', async (req, res, next) => {
    const getUser = await promisePool.query(
        "SELECT * FROM member WHERE id=192",
      );
      res.json(getUser[0][0])
  })

router.post('/profile', async (req, res) => {
    const member_profiles = req.body.values.member_profiles
    const member_account = req.body.values.member_account
    const member_name = req.body.values.member_name
    const member_nickname = req.body.values.nickname
    const member_birth = req.body.values.member_birth
    const member_password = req.body.values.member_password
    const member_email = req.body.values.member_email
    const member_phone = req.body.values.member_phone
    const member_address = req.body.values.member_address
    const member_receive = req.body.values.member_receive


    const updateUser = await promisePool.query(
        "UPDATE member SET member_profiles = ?, member_account = ?, member_name = ?, nickname = ?, member_birth = ?, member_password = ?, member_email = ?, member_phone = ?, member_address = ?, member_receive = ? WHERE id = 192;",
        [member_profiles, member_account, member_name, member_nickname, member_birth, member_password, member_email, member_phone, member_address, member_receive]
      );
      res.json(updateUser)
})
router.post('/upload-image', userController.uploadImage)

module.exports = router;