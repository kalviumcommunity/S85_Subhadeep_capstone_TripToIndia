import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { address } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  // 1. Check if API key is configured on the server
  if (!apiKey) {
    console.error("Google API Key is not configured.");
    // Do not expose the reason to the client for security
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // 2. Validate that an address was provided
  if (!address) {
    return res.status(400).json({ error: "Address parameter is required." });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: apiKey,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Geocode Error:", error.message);
    // Forward a more specific error status if available from the API call
    const status = error.response ? error.response.status : 500;
    res
      .status(status)
      .json({ error: "Geocode failed", message: error.message });
  }
});

export default router;
