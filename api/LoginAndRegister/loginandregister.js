const express = require("express");
const session = require("express-session");
const router = express.Router();
const passport = require('passport')
// const connection = require("../../database/db");
const userController = require('../LoginAndRegister/controllers/user.js')
const promisePool = require('../../database/dblogin').promisePool


router.post("/register", async (req, res) => {
    const phoneReg = req.body.values.phoneReg
    const emailReg = req.body.values.emailReg
    const passwordReg = req.body.values.passwordReg

    const addUser = await promisePool.query(
        "INSERT INTO member (member_phone, member_password, member_email) VALUES(?, ?, ?)",
        [phoneReg, passwordReg, emailReg]
      );
      res.json(addUser)
});
// get 處理獲取全部的資料列表
// router.get('/', userController.find)

// userRouter.get('/logout', userController.logout)
// router.get('/checklogin', userController.isLoggedIn)

// get 處理獲取單一筆的會員，使用id
// 註：這行寫在get區域的最後一行
// router.get('/:userId', userController.findById)

router.post('/login', userController.login)

module.exports = router;
