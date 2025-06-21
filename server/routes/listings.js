const express = require("express");
const Listing = require("../models/Listing");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");
const mongoose = require("mongoose");

router.post("/upload", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Send back the file path/url for frontend to save in listing
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Create a listing
router.post("/", verifyToken, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      host: req.user.id,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: "Error creating listing" });
  }
});

// Get all listings
router.get("/", async (req, res) => {
  try {
    const { location, minPrice, maxPrice } = req.query;
    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive match
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter).populate("host", "name email");
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings", err);
    res.status(500).json({ error: "Error fetching listings" });
  }
});

// ✅ Get listings created by the logged-in host
router.get("/my-listings", verifyToken, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your listings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid listing ID format" });
    }

    const listing = await Listing.findById(id).populate("host", "name email");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Error fetching listing" });
  }
});

router.get("/nearby", async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;

  if (!lng || !lat) return res.status(400).json({ error: "Missing coordinates" });

  try {
    const listings = await Listing.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(10);

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby listings" });
  }
});

// Update a listing (only by the host)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.host.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update listing" });
  }
});

// Delete a listing (only by the host)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.host.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await listing.remove();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});


module.exports = router;
