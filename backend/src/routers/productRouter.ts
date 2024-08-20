import { Request, Response, Router } from "express";

import AsyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";
import { isAdmin } from "../utils";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/images");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e5);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const productRouter = Router();

// /api/products
productRouter.get(
  "/",
  AsyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.find();
    res.json(product);
    return;
  })
);

productRouter.get(
  "/:slug",
  AsyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
      return;
    }
    res.status(404).json({ message: "Product Not Found" });
    return;
  })
);

productRouter.post(
  "/admin/",
  isAdmin,
  upload.single("image"),
  AsyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        name,
        brand,
        category,
        description,
        price,
        countInStock,
        rating,
        numReviews,
      } = req.body;
      const image = req.file?.filename;
      if (!image) {
        res.status(400).json({ message: "Image is required", product: null });
        return;
      }
      let slug = name.split(" ").join("-");
      while (await ProductModel.exists({ slug: slug })) {
        slug = slug + Math.round(Math.random() * 1e5);
      }
      const product = await ProductModel.create({
        name,
        slug,
        image: `images/${image}`,
        brand,
        category,
        description,
        price,
        countInStock,
        rating,
        numReviews,
      });
      res
        .status(201)
        .json({ message: "Success creating product", product: product });
      return;
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error creating product", product: null });
      return;
    }
  })
);

productRouter.put(
  "/admin/:id",
  isAdmin,
  AsyncHandler(async (req: Request, res: Response) => {
    try {
      const { name, brand, category, description, price, countInStock } =
        req.body;
      let product = await ProductModel.findById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product Not Found", product: null });
        return;
      }
      let slug = product.slug;
      if (product.name !== name) {
        slug = name.split(" ").join("-");
        while (await ProductModel.exists({ slug: slug })) {
          slug = slug + Math.round(Math.random() * 1e5);
        }
      }
      product.name = name;
      product.slug = slug;
      product.price = price;
      product.brand = brand;
      product.description = description;
      product.category = category;
      product.countInStock = countInStock;
      await product.save();
      res.json({ message: "Success updating product", product: product });
      return;
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating product", product: null });
      return;
    }
  })
);

productRouter.delete(
  "/admin/:id",
  isAdmin,
  AsyncHandler(async (req: Request, res: Response) => {
    try {
      await ProductModel.deleteOne({ _id: req.params.id });
      res.json({ message: "success" });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
      return;
    }
  })
);
