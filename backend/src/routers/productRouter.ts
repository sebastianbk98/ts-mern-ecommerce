import { Request, Response, Router } from "express";

import AsyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";
import { isAdmin } from "../utils";
import path from "path";
import multer from "multer";

require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Create a folder in Cloudinary
    format: async (req: Request, file: Express.Multer.File) => "jpeg", // Force format
    public_id: (req: Request, file: Express.Multer.File) =>
      Date.now() + "-" + Math.round(Math.random() * 1e5), // Unique filename
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
  "/search",
  AsyncHandler(async (req: Request, res: Response) => {
    const { pageNumber, keyword } = req.query;
    const pageSize = 8;
    const page = Number(pageNumber) || 1;
    const filter = keyword
      ? {
          $or: [
            {
              name: {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    const count = await ProductModel.countDocuments({ ...filter });
    const products = await ProductModel.find({ ...filter })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      products: products,
      page: page,
      pages: Math.ceil(count / pageSize),
    });
    return;
  })
);

productRouter.get(
  "/top4",
  AsyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.find().sort({ rating: "desc" }).limit(4);
    res.json(product);
    return;
  })
);

productRouter.get(
  "/latest",
  AsyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.find()
      .sort({ createdAt: "desc" })
      .limit(4);
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
      const { name, brand, category, description, price, countInStock } =
        req.body;
      if (!req.file) {
        res.status(400).json({ message: "Image is required" });
        return;
      }

      const imageUrl = req.file.path;
      let slug = name.split(" ").join("-");
      while (await ProductModel.exists({ slug: slug })) {
        slug = slug + Math.round(Math.random() * 1e5);
      }
      const product = await ProductModel.create({
        name,
        slug,
        image: imageUrl,
        brand,
        category,
        description,
        price,
        countInStock,
        rating: 0,
        numReviews: 0,
        ratingTotal: 0,
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
