const express = require("express");
const app = express();
const port = 3000;

app.use('/help',(req, res)=>{
   res.send('Hello from the server.')

})

app.listen(port, () => {
  console.log("Server of successfully listening port 3000.");
});
