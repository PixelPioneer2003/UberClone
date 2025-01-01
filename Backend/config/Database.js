const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connection successful in models database");
    })
    .catch((error) => {
      console.log("Error received in models database:", error);
      process.exit(1);
    });
};

module.exports = dbConnect;
