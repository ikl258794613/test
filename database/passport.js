const LocalStrategy = require('passport-local')
const userModel = require('../api/LoginAndRegister/models/user.js')

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    console.log(
      'Inside serializeUser callback. User id is save to the session file store here'
    )
    done(null, user.id)
    console.log("使用者ID：",user.id)
  })

  // // 以ID去撈user資料
  // passport.deserializeUser((id, done) => {
  //   console.log('Inside deserializeUser callback')
  //   userModel
  //     .findById(id)
  //     .then((user) => {
  //       if (!user) {
  //         return done(null, false, {
  //           errors: { 'username or password': 'is invalid' },
  //         })
  //       }

  //       return done(null, user)
  //     })
  //     .catch(done)
  // })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'loginPhone',
        passwordField: 'loginPassword',
      },
      (member_phone, member_password, done) => {
        userModel
          .findOne({ member_phone, member_password })
          .then((user) => {
            if (!user.id) {
              return done(null, false, {
                errors: { 'phone or password': 'is invalid' },
              })
            }

            return done(null, user)
          })
          .catch(done)
      }
    )
  )
}