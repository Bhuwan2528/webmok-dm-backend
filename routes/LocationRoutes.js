import express from "express";
import Location from "../models/Location.js";
import verifyAdmin from "../middleware/AuthMiddleware.js";

const router = express.Router();


// =============================
// CREATE NEW PAGE
// =============================
router.post("/", verifyAdmin, async (req, res) => {
  try {

    const {
      seoTitle,
      metaDescription,
      metaKeywords,
      slug,
      content,
      status,
      field
    } = req.body;


    // Required validation (metaKeywords OPTIONAL rakha hai)
    if (!seoTitle || !metaDescription || !slug || !content || !field) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // slug duplicate check
    const existing = await Location.findOne({ slug });

    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const page = new Location({
      seoTitle: seoTitle.trim(),
      metaDescription,
      metaKeywords: metaKeywords || "", // ✅ always save
      slug: slug.toLowerCase().trim(),
      content,
      status: status || "published",
      field
    });

    await page.save();

    res.json({
      success: true,
      message: "Page created successfully",
      page
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
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
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// GET PAGE BY ID (ADMIN EDIT)
// =============================
router.get("/admin/:id", verifyAdmin, async (req, res) => {
  try {

    const page = await Location.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);

  } catch (err) {
    console.error("GET BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// UPDATE PAGE (SAFE UPDATE)
// =============================
router.put("/:id", verifyAdmin, async (req, res) => {
  try {

    const {
      seoTitle,
      metaDescription,
      metaKeywords,
      slug,
      content,
      status,
      field
    } = req.body;


    if (!seoTitle || !metaDescription || !slug || !content || !field) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // slug duplicate check (exclude current)
    const existing = await Location.findOne({
      slug,
      _id: { $ne: req.params.id }
    });

    if (existing) {
      return res.status(400).json({ message: "Slug already in use" });
    }

    // ✅ SAFE UPDATE OBJECT (undefined overwrite avoid)
    const updateData = {
      seoTitle: seoTitle.trim(),
      metaDescription,
      slug: slug.toLowerCase().trim(),
      content,
      status: status || "published",
      field
    };

    // metaKeywords only if provided
    if (metaKeywords !== undefined) {
      updateData.metaKeywords = metaKeywords || "";
    }

    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({
      success: true,
      message: "Page updated successfully",
      page: updated
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// DELETE PAGE
// =============================
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {

    const page = await Location.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({
      success: true,
      message: "Page deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// PUBLIC LIST FOR USERS
// =============================
router.get("/public", async (req, res) => {
  try {

    const pages = await Location
      .find({ status: "published" })
      .sort({ createdAt: -1 });

    res.json(pages);

  } catch (err) {
    console.error("PUBLIC LIST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// PUBLIC PAGE BY SLUG
// =============================
router.get("/page/:slug", async (req, res) => {
  try {

    const page = await Location.findOne({
      slug: req.params.slug.toLowerCase(),
      status: "published"
    });

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);

  } catch (err) {
    console.error("GET BY SLUG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;