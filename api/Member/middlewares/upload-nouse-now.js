const path = require('path')
const _ = require('lodash')
const userModel = require('../models/user.js')

// 單檔上傳
/*--------------------------*/

module.exports.uploadImage = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    } else {
      //使用輸入框的名稱來獲取上傳檔案 (例如 "image")
      let image = req.files.avatar

      const extensionName = path.extname(image.name) // fetch the file extension
      const allowedExtension = ['.jpg']

      if (!allowedExtension.includes(extensionName)) {
        return res.status(422).json({ message: 'Invalid Image' })
      }

      const userid = req.body.id

      if (!userid) {
        return res.status(422).json({ message: 'Invalid User id' })
      }

      //使用 mv() 方法來移動上傳檔案到要放置的目錄裡 (例如 "public")
      const rootPath = path.join(__dirname, '../../')

      // change name to userid.ext
      image.mv(rootPath + '/public/images/avatar/' + userid + extensionName)

      // 處理資料庫更新
      // 1. 找到使用者資料
      const user = await userModel.findById(userid)
      // 2. 更新會員資料
      user.avatar = userid + extensionName
      const updatedUser = await userModel.update(user)

      //送出回應
      res.json({
        status: 200,
        message: 'File is uploaded',
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size,
        },
        user: updatedUser,
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}
/*--------------------------*/