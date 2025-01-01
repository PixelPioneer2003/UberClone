const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 4000;

const cors = require("cors");
const dbConnect = require("./config/Database");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
dbConnect();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/captain", captainRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
