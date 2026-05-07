import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/geocode", async (req, res) => {
  const { address } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY; // <-- Store your API key in .env

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address,
        key: apiKey
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Geocode Error:", error.message);
    res.status(500).json({ error: "Geocode failed", message: error.message });
  }
});

export default router;
