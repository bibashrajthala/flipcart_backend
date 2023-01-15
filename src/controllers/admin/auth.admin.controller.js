import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

export const signUp = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // search if user already exists ,if not create one
  //exec means execute, first arg in error and second arg is data found related to User model in database
  User.findOne({ email }).exec((error, user) => {
    // if user already exists then return
    if (user) {
      return res.status(400).json({
        message: "Admin already registered",
      });
    }

    // if user dont exist, create new one
    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      userName: Math.random().toString(),
      role: "admin",
    });
    // save the new user
    _user.save((error, data) => {
      // while creating id something goes wrong
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      // if created successfully
      if (data) {
        return res.status(201).json({
          // user:data, // if you want to send data in response
          message: "Admin created successfully..!",
        });
      }
    });
  });
};

export const signIn = (req, res) => {
  const { email, password } = req.body;
  //exec means execute, first arg in error and second arg is data found related to User model in database
  User.findOne({ email }).exec((error, user) => {
    // if anything goes wrong
    if (error) return res.status(400).json({ error });

    // if user is found,authenticate user
    if (user) {
      // authenticate is method we created in our userModel to compare password using bcrypt
      // if authentication is successfull and role is admin
      if (user.authenticate(password) && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role }, // also provide role while signing in as admin
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const { firstName, lastName, email, role, fullName, _id } = user;
        return res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            fullName,
          },
        });
        // if authentication failed
      } else {
        return res.status(400).json({ message: "Invalid Password" });
      }
      // if user is not found
    } else {
      return res.status(503).json({ message: "Something went wrong" });
    }
  });
};
