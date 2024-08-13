import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";
import { sampleProducts, sampleUser } from "../data";
import { UserModel } from "../models/userModel";

export const seedRouter = Router();

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProducts);
    await UserModel.deleteMany({});
    const createdUser = await UserModel.insertMany(sampleUser);
    res.send({ createdProducts, createdUser });
  })
);
