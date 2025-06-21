const express = require("express");
const Listing = require("../models/Listing");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Add review to a listing
router.post("/:id/review", verifyToken, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const existing = listing.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (existing) return res.status(400).json({ error: "Already reviewed" });

    listing.reviews.push({
      user: req.user.id,
      name: req.user.name,
      comment,
      rating,
    });

    listing.updateAverageRating();
    await listing.save();

    res.json({ message: "Review added", listing });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Host reply to a review
router.post("/:listingId/review/:reviewId/reply", verifyToken, async (req, res) => {
  const { reply } = req.body;

  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (listing.host.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const review = listing.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    review.reply = reply;
    await listing.save();

    res.json({ message: "Reply added" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
