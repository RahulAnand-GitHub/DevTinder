const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;

connectDB()
  .then(() => {
    console.log("Database connection is successful.");
    app.listen(port, () => {
      console.log("Server of successfully listening port 3000.");
    });
  })
  .catch((err) => {
    console.error(`${err} : Error in connection.`);
  });
