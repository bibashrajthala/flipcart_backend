import { ResultWithContext } from "express-validator/src/chain/context-runner-impl.js";
import slugify from "slugify";
import Product from "../models/product.model.js";

export const addProduct = (req, res) => {
  const { name, price, description, quantity, category, offer, reviews } =
    req.body;

  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return {
        img: file.filename,
      };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    quantity,
    category, // provide a category id as foreign key
    createdBy: req.user._id, // provied current user id a/c to token used
    productPictures,
  });

  product.save((error, product) => {
    if (error) {
      res.status(400).json({
        error,
      });
    }
    if (product) {
      res.status(201).json({
        product,
      });
    }
  });
};
