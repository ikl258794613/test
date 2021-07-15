# 使用方法

1. git clone https://github.com/ikl258794613/test.git

2. npm i or yarn install

3. 修改.env 將 DB_USER=root DB_PASS=ikl258794613 改成自己的帳號密碼

4. 到 api 資料夾找到自己的資料夾寫 api，格式:

```
   const express = require("express");
   const router = express.Router();
   const connection = require("../../database/db");

   router.get("/", async (req, res) => {
   let XXX = await connection.queryAsync("SELECT \* FROM XXX");
   console.log(XXX)
   res.json(XXX);
});

   module.exports = router;
```

5.在 app.js 找到

```
   let official = require("./api/Official/official.js");
   app.use("/official", official);
```

接在下面寫

```
   let XXX = require("./api/XXX/XXX.js");
   app.use("/XXX", XXX);

```

6.  在你的 react 檔中加上

```
    function Official() {
    const [XXX, setXXX] = useState([])

async function getXXXFromServer() {
// 連接的伺服器資料網址
const url = 'http://localhost:6005/XXX'

    // 注意header資料格式要設定，伺服器才知道是json格式
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'appliaction/json',
      }),
    })

    const response = await fetch(request)
    const data = await response.json()
    console.log(data)
    // 設定資料
    setXXX(data)

}

useEffect(() => {
getXXXFromServer()
}, [])

```

7. 回去伺服器的終端機 npm start

8. 在 react 終端機 yaen start

   觀察網頁的 console 跟伺服器的終端機有沒有目標資料

9. 有問題再問我
