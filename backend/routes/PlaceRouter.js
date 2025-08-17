import express from "express";
import Doc from "../models/PlaceSchema.js";

const placeRouter = express.Router();
// POST: Upload place with image
placeRouter.post("/registerAll", async (req, res) => {
  try {
    const places = req.body;

    if (!Array.isArray(places) || places.length === 0) {
      return res.status(400).json({ message: "Request must be an array of places." });
    }

    const savedPlaces = [];

    for (const place of places) {
      const { name, description, address, imageUrl } = place;

      if (!name || !description || !address || !imageUrl) {
        continue; // skip incomplete entries
      }

      const existingPlace = await Doc.findOne({
        name: name.trim(),
        address: address.trim(),
        imageUrl: imageUrl.trim(),
      });

      if (!existingPlace) {
        const newPlace = new Doc({
          name: name.trim(),
          description: description.trim(),
          address: address.trim(),
          imageUrl: imageUrl.trim(),
        });

        await newPlace.save();
        savedPlaces.push(newPlace);
      }
    }

    res.status(201).json({ message: "Places added", savedPlaces });
  } catch (error) {
    res.status(500).json({ message: "Error adding places", error });
  }
});
placeRouter.post("/register", async (req, res) => {
  try {
    const { name, description, address, imageUrl } = req.body;

    if (!imageUrl || !name || !description || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Check for existing place with same name, address, and imageUrl
    const existingPlace = await Doc.findOne({
      name: name.trim(),
      address: address.trim(),
      imageUrl: imageUrl.trim(),
    });

    if (existingPlace) {
      return res.status(409).json({ message: "Place already exists." });
    }

    // ✅ Create and save new place
    const newPlace = new Doc({
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      imageUrl: imageUrl.trim(),
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
    const query = req.query.q?.trim();

    // Don't search if query is empty
    if (!query) {
      return res.status(200).json([]); // Return empty array
    }

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