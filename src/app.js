const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 3000;

app.post("/signup", async (req, res) => {
  // const userObj={
  //   firstName:"Rahul",
  //   lastName:"Anand",
  //   email:"rahul@gmail.com",
  //   password:"Rahul@123"
  // }
  // const User = new User(userObj);

  //createing a new instance of the use model.
  const user = new User({
    firstName: "Ritik",
    lastName: "Anand"
  });
  try {
    await user.save();
    res.send("User added successfully.");
  } catch (err) {
    res.send(`Error saving the user: ${err}`);
  }
});

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
