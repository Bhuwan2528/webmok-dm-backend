import express from "express";
import Entry from "../models/Entry.js";
import verifyAdmin from "../middleware/AuthMiddleware.js";

const router = express.Router();

/* GET DATA (Frontend ke liye) */

router.get("/", async (req, res) => {

  try {

    const data = await Entry.findOne();

    res.json(data);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});


/* SAVE / UPDATE DATA (Admin form se) */

router.post("/", verifyAdmin, async (req, res) => {

  try {

    let entry = await Entry.findOne();

    if (entry) {

      entry = await Entry.findByIdAndUpdate(
        entry._id,
        req.body,
        { returnDocument: "after" }
      );

    } else {

      entry = new Entry(req.body);
      await entry.save();

    }

    res.json(entry);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Error saving data" });

  }

});

export default router;