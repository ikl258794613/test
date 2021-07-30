const express = require("express");
const router = express.Router();
const connection = require("../../database/db");

router.get("/", async (req, res) => {
  //將價格比例轉成對應價格的function
  function truePrice (value){
    return (value*40+1000)
  }

  let searchPrice = req.query.price
  let searchMaterial = req.query.material
  //當req.query.material為空值時會有回應很慢的情況發生
  if(searchMaterial === ""){
    //為空字串時變成空陣列
    var material = Array.from(searchMaterial)//[]
    // console.log(material)
  }else{
    var material = searchMaterial.split(",")//["乳香","柑橘"]
    // console.log(material)
  }
  //------------------------------------處理價格 
  searchPrice =  searchPrice.split(",")
  
  const minPrice = truePrice(searchPrice[0])
  const maxPrice = truePrice(searchPrice[1])

  // let sqlPrice = `SELECT * FROM official_product WHERE volume="50ml" AND price BETWEEN ? AND ?`
  // const priceProduct = await connection.queryAsync(
  //   sqlPrice,
  //   [minPrice,maxPrice]
  // );
  // console.log(priceProduct[0].top,priceProduct[0].middle,priceProduct[0].base)
  //------------------------------------處理價格
  //------------------------------------處理原料
//WHERE top LIKE '%黑加侖%' OR base LIKE '%黑加侖%' OR middle LIKE '%黑加侖%'
// ORDER BY id LIMIT ? OFFSET ?
if(searchMaterial === ""){
  var sqlMaterial = `SELECT * FROM official_product WHERE volume="50ml" AND price BETWEEN ? AND ? `
  var sqlMaterialcount =  `SELECT COUNT(*) as total FROM official_product WHERE volume="50ml" AND price BETWEEN ? AND ?`
}else{
  var sqlMaterial = `SELECT * FROM official_product WHERE volume="50ml" AND price BETWEEN ? AND ? AND material LIKE `
  var sqlMaterialcount =  `SELECT COUNT(*) as total FROM official_product WHERE volume="50ml" AND price BETWEEN ? AND ? AND material LIKE`
}

// let sqlMaterial = `SELECT * FROM official_product WHERE material LIKE '%柑橘%' '%玫瑰%' '%檸檬%'`
for(let i = 0 ; i < material.length ; i++){
sqlMaterial += ` "%${material[i]}%" `
sqlMaterialcount += ` "%${material[i]}%" `
}
sqlMaterial = sqlMaterial + ` ORDER BY id LIMIT ? OFFSET ? `
console.log(sqlMaterialcount)
console.log(sqlMaterial)
  // const materialProduct = await connection.queryAsync(
  //   sqlMaterial,
  //   []
  // );
  // console.log(materialProduct)
//   ------------------------------------處理原料
// --------------------------------------合併原料跟價格SQL
// --------------------------------------解決查詢頁數
const count = await connection.queryAsync(
  `${sqlMaterialcount}`,
  [minPrice,maxPrice]
);
const totalCount = count[0].total;
const perPage = 5;
const lastPage = Math.ceil(totalCount / perPage);
const currentPage = req.query.page || 1; // page頁 預設第一頁
const offset = (currentPage - 1) * perPage;
// console.log(count)


const searchProduct = await connection.queryAsync(
  `${sqlMaterial}`,
  [minPrice,maxPrice,perPage, offset]
);
console.log(searchProduct)

//--------------------------------------合併原料跟價格SQL
//--------------------------------------解決查詢頁數
//--------------------------------------回傳查詢
let result = {};//變成物件

  result.data = searchProduct
  result.page = lastPage
  result.material = searchMaterial

//--------------------------------------回傳查詢
  res.json(result);
});

module.exports = router;
