const express = require("express");
const app = express();
const port = 3000;




app.use("/about", (req, res) => {
  res.send("About Section of the Website.");
});
app.get("/", (req, res) => {
  res.send("Welcome to home page.");
});
app.use("/help", (req, res) => {
  res.send("Hello from the server.");
});

app.listen(port, () => {
  console.log("Server of successfully listening port 3000.");
});
