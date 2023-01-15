import express from "express";

import multer from "multer";
// import path from "path";
import shortid from "shortid";

import { getDirname } from "../utils/getDirectory.js";
import { addProduct } from "../controllers/product.controller.js";
import {
  signInVerificationMiddleware,
  adminAuthorizationVerificationMiddleware,
} from "../middlewares/index.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const __dirname = getDirname(import.meta.url);
    // const dirname = path.dirname(__dirname);
    // cb(null, path.join(dirname, "uploads"));
    cb(null, "./src/uploads/product");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      shortid.generate() + "-" + file.originalname
      // "-" +
      // Date.now().toString().slice(0, 10)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/admin/product/create",
  signInVerificationMiddleware, // first admin needs to sign in , so verify sign in first(ie check token)
  adminAuthorizationVerificationMiddleware, // check if signed in user is admin or not
  upload.array("productPicture", 7), // field name to upload image in form and max number of image that can be uploaded
  addProduct
);

export default router;
