import express from "express";
import Doc from "../models/PlaceSchema.js";

const placeRouter = express.Router();
// POST: Upload place with image
placeRouter.post("/register", async (req, res) => {
  try {
    const { name, description, address, imageUrl } = req.body;

if (!imageUrl) {
  return res.status(400).json({ message: "Image URL is required." });
}

const newPlace = new Doc({
  name,
  description,
  address,
  imageUrl,
});

    await newPlace.save();
    res.status(201).json({ message: "Place registered", place: newPlace });
  } catch (error) {
    res.status(500).json({ message: "Error registering place", error });
  }
});

// GET: Individual place info
placeRouter.get("/places/:id", async (req, res) => {
  try {
    const place = await Doc.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


placeRouter.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const results = await Doc.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
});

// GET: 3 random places
placeRouter.get("/random", async (req, res) => {
  try {
    const randomPlaces = await Doc.aggregate([{ $sample: { size: 3 } }]);
    res.status(200).json(randomPlaces);
  } catch (error) {
    res.status(500).json({ message: "Failed to get random places", error });
  }
});

export default placeRouter;
