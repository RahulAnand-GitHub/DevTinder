const express = require("express");
const app = express();
const port = 3000;

app.get(
  "/",[
  (req, res, next) => {
    console.log("1st Response");
    next();
  },
  (req, res, next) => {
    // res.send("Hello from the server2.");
    console.log("2nd Response!");
    next();
  }],
  (req, res, next) => {
    console.log("3rd Response!");
    next();
  },
  (req, res, next) => {
    console.log("4th Response!");
    res.send('Response form server 4.')
  }
);

app.listen(port, () => {
  console.log("Server of successfully listening port 3000.");
});
