import express from "express";
import { addItemToCart } from "../controllers/cart.controller.js";
import {
  signInVerificationMiddleware,
  userAuthorizationVerificationMiddleware,
} from "../middlewares/index.js";

const router = express.Router();

router.post(
  "/user/cart/add-to-cart",
  signInVerificationMiddleware, // first admin needs to sign in , so verify sign in first(ie check token)
  userAuthorizationVerificationMiddleware, // check if signed in user is user and not admin, as user can only add item to cart
  addItemToCart
);

export default router;
