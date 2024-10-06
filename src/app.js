const express = require("express");
const app = express();
const port = 3000;

app.use("/", (req, res, next) => {
  next();
});

app.get(
  "/user",
  (req, res, next) => {
    console.log("2nd route handler. ");
    next();
  },
  (req, res, next) => {
    console.log("1st Response");
    next();
  }
);

app.get("/user", (req, res, next) => {
  res.send('3rd rout handler.')
});

app.listen(port, () => {
  console.log("Server of successfully listening port 3000.");
});
