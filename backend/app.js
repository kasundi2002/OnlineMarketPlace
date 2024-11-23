const morgan = require("morgan");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorHandlers");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const requestRoutes = require("./routes/requestRoutes");
const newsRoutes = require("./routes/NewsRoutes");
const shopRoutes = require("./routes/ShopRoutes");
const complainRoutes = require("./routes/ComplainRoutes");

const connectDB = require("./config/db");
connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());

//Use morgan to detect http request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Parse json data
app.use(express.json());

// Main Routes
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/complain", complainRoutes);

if (process.env.NODE_ENV != "test") {
  app.use("/backend/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/api/config/paypal", (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve("./"), "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(path.resolve("./"), "client", "build", "index.html")
    )
  );
} else {
  // Test server
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}



// Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
