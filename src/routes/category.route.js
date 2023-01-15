import express from "express";
import {
  addCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  signInVerificationMiddleware,
  adminAuthorizationVerificationMiddleware,
} from "../middlewares/index.js";

import multer from "multer";
import shortid from "shortid";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/category");
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/admin/category/create",
  signInVerificationMiddleware, // first admin needs to sign in , so verify sign in first(ie check token)
  adminAuthorizationVerificationMiddleware, // check if signed in user is admin or not
  upload.single("categoryImage"),
  addCategory
);
router.get("/category", getCategories);
router.delete(
  "/admin/category/delete",
  signInVerificationMiddleware,
  adminAuthorizationVerificationMiddleware,
  deleteCategory
);

export default router;
