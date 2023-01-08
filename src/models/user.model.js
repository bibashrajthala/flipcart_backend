import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, //to remove whitespace if any
      min: 3, //min length
      max: 20, // max length
    },
    lastName: {
      type: String,
      required: true,
      trim: true, //to remove whitespace if any
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true, // every user needs to unique
      index: true, // so that we can query based on username
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contactNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true } // gives created_at and updated_at by default
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10); // 10 is salt round here
});

userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password); // gives true or false after comparing password with hashed password
  },
};

userSchema
  .virtual("confirmPassword")
  .get(function () {
    return this.confirmPassword;
  })
  .set(function (value) {
    this.confirmPassword = value;
  });

const userModel = mongoose.model("User", userSchema);

export default userModel;
