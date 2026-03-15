import express from "express";
import Location from "../models/Location.js";
import verifyAdmin from "../middleware/AuthMiddleware.js";

const router = express.Router();


// =============================
// CREATE NEW PAGE
// =============================
router.post("/", verifyAdmin, async (req, res) => {
  try {

    const { seoTitle, metaDescription, slug, content, status } = req.body;

    if (!seoTitle || !metaDescription || !slug || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    // slug duplicate check
    const existing = await Location.findOne({ slug });

    if (existing) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    const page = new Location({
      seoTitle,
      metaDescription,
      slug,
      content,
      status
    });

    await page.save();

    res.json({
      success: true,
      message: "Page created",
      page
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
});


// =============================
// GET ALL PAGES (ADMIN TABLE)
// =============================
router.get("/", verifyAdmin, async (req, res) => {
  try {

    const pages = await Location
      .find()
      .sort({ createdAt: -1 });

    res.json(pages);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


// =============================
// GET PAGE BY ID (ADMIN EDIT)
// =============================
router.get("/admin/:id", verifyAdmin, async (req, res) => {
  try {

    const page = await Location.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }

    res.json(page);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


// =============================
// UPDATE PAGE
// =============================
router.put("/:id", verifyAdmin, async (req, res) => {
  try {

    const { seoTitle, metaDescription, slug, content, status } = req.body;

    if (!seoTitle || !metaDescription || !slug || !content) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // check slug duplicate except current page
    const existing = await Location.findOne({
      slug,
      _id: { $ne: req.params.id }
    });

    if (existing) {
      return res.status(400).json({
        message: "Slug already in use"
      });
    }

    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      {
        seoTitle,
        metaDescription,
        slug,
        content,
        status
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Page updated",
      page: updated
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


// =============================
// DELETE PAGE
// =============================
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {

    const page = await Location.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }

    res.json({
      success: true,
      message: "Page deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


// =============================
// PUBLIC PAGE BY SLUG
// =============================
router.get("/page/:slug", async (req, res) => {
  try {

    const page = await Location.findOne({
      slug: req.params.slug,
      status: "published"
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found"
      });
    }

    res.json(page);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }
});


export default router;