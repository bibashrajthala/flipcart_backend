import express from "express";
import {
  signUp,
  signIn,
  signout,
} from "../../controllers/admin/auth.admin.controller.js";
import { signInVerificationMiddleware } from "../../middlewares/index.js";

import isAuthRequestValidated, {
  signInRequestValidation,
  signUpRequestValidation,
} from "../../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", signUpRequestValidation, isAuthRequestValidated, signUp);
router.post("/signin", signInRequestValidation, isAuthRequestValidated, signIn);
// router.post("/signout", signInVerificationMiddleware, signout);
router.post("/signout", signout);

export default router;
