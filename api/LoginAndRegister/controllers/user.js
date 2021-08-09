const userModel = require('../models/user.js')
const passport = require('passport')
const jwt = require("jsonwebtoken");


// module.exports.find = async (req, res) => {
//   // if has req.query
//   if (Object.keys(req.query).length > 0) {
//     try {
//       const users = await userModel.find(req.query)
//       res.json(users)
//     } catch (error) {
//       res.status(500).json({
//         message: error.message || 'error occurred.',
//       })
//     }
//   } else {
//     try {
//       const users = await userModel.findAll()
//       res.json(users)
//     } catch (error) {
//       res.status(500).json({
//         message: error.message || 'error occurred.',
//       })
//     }
//   }
// }


// module.exports.findById = async (req, res) => {
//   try {
//     const user = await userModel.findById(req.params.userId)

//     if (!user.id) {
//       return res.status(404).json({
//         message: 'User not found with id ' + req.params.userId,
//       })
//     }
//     res.json(user)
//   } catch (error) {
//     res.status(500).json({
//       message: error.message || 'error occurred.',
//     })
//   }
// }

module.exports.login = async (req, res, next) => {
    console.log('Inside POST /login callback')
    passport.authenticate('local', (err, user, info) => {

      req.login(user, (err) => {

      })

      if (req.user){
        const token = jwt.sign({ mid: user.id }, process.env.JWT_SECRET, {expiresIn: "1h"});
        // return res.json({ code: 0, token: token, userId: user.id});
        return res.json({ code: 0, token: token});
      }else{
        return res.json({code: 1})
      }
    })(req, res, next)
  }

  // module.exports.isLoggedIn = (req, res, next) => {
  //   // read jwt token
  //   const token = req.header("Authorization").replace("Bearer ", "");
  //   console.log(token)
  //   // verify
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   // res.json(decoded)
  //   console.log(decoded)
  // }