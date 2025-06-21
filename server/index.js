const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

require("dotenv").config();
const app = express();

const listingRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Serve images from the "uploads" folder
app.use("/uploads", express.static("uploads"));

// ✅ Register routes
app.use("/api/listings", listingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
})
.catch(err => console.error("❌ MongoDB Error", err));
