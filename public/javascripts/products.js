axios
  .get("/api/product")
  .then(function (data) {
    console.log(data.data);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {});