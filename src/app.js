const express = require("express");
const app = express();
const port = 3000;
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);
// app.use("/user", userAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User Data");
});

app.get("/admin/getAllDAta", adminAuth => {
  res.send("All admin data");
});

app.get("/admin/deleteUser", adminAuth => {
  res.send("Deleted use data");
});

app.listen(port, () => {
  console.log("Server of successfully listening port 3000.");
});
