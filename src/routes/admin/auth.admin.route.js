import express from "express";
import {
  signUp,
  signIn,
} from "../../controllers/admin/auth.admin.controller.js";

import isAuthRequestValidated, {
  signInRequestValidation,
  signUpRequestValidation,
} from "../../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", signUpRequestValidation, isAuthRequestValidated, signUp);
router.post("/signin", signInRequestValidation, isAuthRequestValidated, signIn);

export default router;
