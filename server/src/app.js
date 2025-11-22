const express = require("express");
const cors = require("cors");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const notFound = require("./middleware/notFound");
const userRoutes = require("./routes/user.routes");
const ProductRoutes = require("./routes/product.route");
const paymentRoutes = require("./routes/payment.route");
const SellerRoutes = require("./routes/seller.route");
const WishListRoutes = require("./routes/wishlist.route");
const ReviewRoutes = require("./routes/review.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.send("QuickBuzz Server Running ✔");
});

// ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", ProductRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/seller", SellerRoutes);
app.use("/api/v1/wishlist", WishListRoutes);
app.use("/api/v1/review", ReviewRoutes);


// global error 
app.use(globalErrorHandler);

// api not found
app.use(notFound)

module.exports = app;
