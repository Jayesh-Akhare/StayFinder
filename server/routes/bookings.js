const express = require("express");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// POST /api/bookings
router.post("/", verifyToken, async (req, res) => {
  const { listingId, checkIn, checkOut } = req.body;

  if (!listingId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const booking = new Booking({
      listing: listingId,
      user: req.userId,
      checkIn,
      checkOut,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("listing", "title location image price")
      .sort({ checkIn: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Failed to fetch bookings", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
// ✅ Delete a booking
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel failed", err);
    res.status(500).json({ error: "Cancel failed" });
  }
});


module.exports = router;
