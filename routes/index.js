import express from "express";
import Url from "../models/Url.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

router.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).render("404");
    }

    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
