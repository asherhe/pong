const express = require("express");
const config = require("./config");

const app = express();
app.listen(config.port, function () {
  console.log(`server running at port ${config.port}`);
});
app.use((req, res, next) => {
  console.log(`GET ${req.url}`);
  next();
});
app.use(express.static(config.publicDir));
