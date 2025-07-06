import express from "express";
import multer from "multer";
import Doc from "../models/PlaceSchema.js";

const upload = multer({ storage: multer.memoryStorage() }); // use memory storage
const placeRouter = express.Router();

// POST: Upload place with image
placeRouter.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, description, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const newPlace = new Doc({
      name,
      description,
      address,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newPlace.save();
    res.status(201).json({ message: "Place registered", place: newPlace });
  } catch (error) {
    res.status(500).json({ message: "Error registering place", error });
  }
});

// GET: All places (excluding image to reduce size)
placeRouter.get("/places", async (req, res) => {
  try {
    const places = await Doc.find({}, { image: 0 }); // exclude image from list
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error });
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

placeRouter.get('/place/:id', async (req, res) => {
  try {
    const place = await Doc.findById(req.params.id);
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch place" });
  }
});
// GET: Image by place ID
placeRouter.get("/image/:id", async (req, res) => {
  try {
    const place = await Doc.findById(req.params.id);
    if (!place || !place.image || !place.image.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", place.image.contentType);
    res.send(place.image.data);
  } catch (error) {
    res.status(500).send("Server error");
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
