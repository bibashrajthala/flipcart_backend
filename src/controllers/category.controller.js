import slugify from "slugify";
import Category from "../models/category.model.js";

// recursive function to get categories and sub categories to multilevel
function createCategories(categories, _id = null) {
  const finalCategoryList = [];

  let categoryList;
  if (!_id) {
    categoryList = categories.filter((category) => !category.parentId);
  } else {
    categoryList = categories.filter((category) => category.parentId == _id); // strict equality wont work as _id is of ObjectId type (not string)
  }

  categoryList.forEach((category) => {
    const { _id, name, slug } = category;
    finalCategoryList.push({
      _id,
      name,
      slug,
      children: createCategories(categories, _id),
    });
  });

  return finalCategoryList;
}

export const addCategory = (req, res) => {
  const { name, parentId } = req.body;

  const newCategory = {
    name,
    slug: slugify(name), // slug is like a unique identifier,(will use name to create slug using slugify package and since slug is required and unique, two category of same name wont be possible due to unique slug required)
  };

  if (req.file) {
    newCategory.categoryImage = `${process.env.API}/public/category/${req.file.filename}`;
  }

  // put parent id in new category only if it is provided in req
  if (parentId) {
    newCategory.parentId = parentId;
  }

  const category = new Category(newCategory);

  category.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) return res.status(201).json({ category });
  });
};

export const getCategories = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories); // create recursive function to create multi level categories
      return res.status(200).json({ categoryList });
    }
  });
};

export const deleteCategory = (req, res) => {
  const { id } = req.body;

  Category.findByIdAndDelete(id).exec((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category)
      return res.status(200).json({
        message: `${category.name} Category deleted sucessfully`,
      });
  });
};
