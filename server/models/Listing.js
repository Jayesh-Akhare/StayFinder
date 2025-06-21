const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String, // For display
  comment: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  reply: String, // Host reply
});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number], // [lng, lat]
    address: String,
  },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

listingSchema.methods.updateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
};

module.exports = mongoose.model("Listing", listingSchema);
