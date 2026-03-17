import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({

  seoTitle: {
    type: String,
    required: true,
    trim: true
  },

  metaDescription: {
    type: String,
    required: true
  },

  metaKeywords: {
    type: String
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  // ✅ NEW FIELD ADDED
  field: {
    type: String,
    required: true,
    enum: [
      "web development",
      "digital marketing",
      "video editing",
      "graphic designing",
      "business development"
    ]
  },

  content: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "published"
  }

}, {
  timestamps: true
});

export default mongoose.model("Location", locationSchema);