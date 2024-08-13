import express from "express";
// import { sampleProducts } from "./data";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { productRouter } from "./routers/productRouter";
import { seedRouter } from "./routers/seedRouter";
import { userRouter } from "./routers/userRouter";
import { orderRouter } from "./routers/orderRouter";

const app = express();

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/ts-ecommerce-yt";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use("/seed", seedRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
