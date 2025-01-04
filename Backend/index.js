const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 4000;
const http = require("http");
const { initializeSocket } = require("./socket");

const cors = require("cors");
const dbConnect = require("./config/Database");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const cookieParser = require("cookie-parser");
dbConnect();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/captains", captainRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/rides", rideRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Start the server
const server = http.createServer(app);
initializeSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
