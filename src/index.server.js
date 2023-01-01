import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//routes imported
import userRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin/auth.admin.route.js";

const app = express();

// environment variables or constants
env.config();

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.hofl5sg.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("mongoDB database connected");
  });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//routes
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Hello from server. This server is running.",
  });
});

app.post("/data", (req, res, next) => {
  res.status(200).json({
    message: req.body,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running in the port ${process.env.PORT}`);
});
