import express from "express";
import Url from "../models/Url.js";
import { nanoid } from "../helpers/nanoid.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

// Create short URL
router.post("/shorten", ensureAuthenticated, async (req, res) => {
  try {
    const { url } = req.body;
    const shortCode = nanoid();

    const newUrl = new Url({
      originalUrl: url,
      shortCode: shortCode,
      userId: res.locals.logged_in.uid,
    });

    await newUrl.save();
    res.json({ shortCode });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
