import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      // slug is like a unique identifier,(will use name to create slug using slugify package and since slug is required and unique, two category of same name wont be possible due to unique slug required)
      type: String,
      required: true,
      unique: true,
    },
    categoryImage: { type: String },
    parentId: {
      // is not required as only sub category and its further child has parent, and category wont have
      type: String,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
