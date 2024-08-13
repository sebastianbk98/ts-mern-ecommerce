import { Request, Response, Router } from "express";

import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";

export const productRouter = Router();

// /api/products
productRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.find();
    res.json(product);
    return;
  })
);

productRouter.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
      return;
    }
    res.status(404).json({ message: "Product Not Found" });
    return;
  })
);
