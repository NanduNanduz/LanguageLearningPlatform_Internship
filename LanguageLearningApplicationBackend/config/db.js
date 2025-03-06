const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongoDb_URL)
  .then(() => {
    console.log("Connection is established");
  })
  .catch(() => {
    console.log("Not connected");
  });
