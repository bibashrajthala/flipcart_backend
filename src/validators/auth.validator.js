import { check, validationResult } from "express-validator";

export const signUpRequestValidation = [
  check("firstName")
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 2 })
    .withMessage("the firstname must have minimum length of 2")
    .trim(),

  check("lastName")
    .notEmpty()
    .withMessage("Last Name is required")
    .isLength({ min: 2 })
    .withMessage("the lastname must have minimum length of 2")
    .trim(), // to not allow white spaces

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 15 })
    .withMessage("your password should have min and max length between 8-15")
    .matches(/\d/)
    .withMessage("your password should have at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Your password should have at least one special character"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      console.log(req.body.password, req.body.confirmPassword);
      throw new Error("Confirm password does not match with Password");
    }
    return true;
  }),
];
export const signInRequestValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 15 })
    .withMessage("your password should have min and max length between 8-15")
    .matches(/\d/)
    .withMessage("your password should have at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Your password should have at least one special character"),
];

const isAuthRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  // const errors = validationResult(req).formatWith(({ msg }) => msg); // using formatWith() we formatted error response to only five object with error message and not with other things such as location, param, value , nestedErrors, etc also.

  const hasError = !errors.isEmpty();
  //or const hasError = errors.array().length >0

  if (hasError) {
    // res.status(400).json({ error: errors.array() }); // if you want to show all validation errors at once
    res.status(400).json({ error: errors.array()[0].msg }); // if you want to give only one(here first one) validation error
  } else {
    // if there is error give error and dont reach the req to controller in routes
    next();
  }
};

export default isAuthRequestValidated;
