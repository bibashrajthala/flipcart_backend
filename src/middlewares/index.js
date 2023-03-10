import jwt from "jsonwebtoken";

export const signInVerificationMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization Required!" });
  }
  next();
};

export const adminAuthorizationVerificationMiddleware = (req, res, next) => {
  // check if signed in user is admin
  if (req.user.role !== "admin")
    return res.status(400).json({
      message: "Admin Access Denied",
    });
  next();
};
export const userAuthorizationVerificationMiddleware = (req, res, next) => {
  // check if signed in user is user
  if (req.user.role !== "user")
    return res.status(400).json({
      message: "User Access Denied",
    });
  next();
};
