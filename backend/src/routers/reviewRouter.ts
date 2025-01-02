import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ReviewModel } from "../models/reviewModel";
import { ProductModel } from "../models/productModel";
import { isAuth } from "../utils";

export const reviewRouter = Router();

reviewRouter.get(
  "/updateReview",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const products = await ProductModel.find();
      for (const product of products) {
        await updateProductReviewById(product._id);
      }
      res.json({ message: "success", products: products });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, products: null });
      return;
    }
  })
);

// get all reviews
reviewRouter.get(
  "/",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const reviews = await ReviewModel.find().sort({ createdAt: "desc" });
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, reviews: null });
      return;
    }
  })
);

// get top reviews
reviewRouter.get(
  "/top",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const reviews = await ReviewModel.find()
        .sort({ rating: "desc" })
        .limit(5);
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, reviews: null });
      return;
    }
  })
);

// get review for product
reviewRouter.get(
  "/product/:idProduct",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const reviews = await ReviewModel.find({
        product: req.params.idProduct,
      })
        .sort({ createdAt: "desc" })
        .populate("user");
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, reviews: null });
    }
  })
);

// get review for order
reviewRouter.get(
  "/order/:idOrder",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const reviews = await ReviewModel.find({
        order: req.params.idOrder,
      });
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, reviews: null });
    }
  })
);

// create review
reviewRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const review = await ReviewModel.create({
        user: req.user,
        product: req.body.product,
        order: req.body.order,
        rating: req.body.rating,
        review: req.body.review,
      });
      (await review.populate("user")).populate("product");
      res.json({ message: "success", review: review });
      await updateProductReviewById(req.body.product);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, review: null });
      return;
    }
  })
);

// edit review
reviewRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const review = await ReviewModel.findById(req.params.id);
      console.log(review);

      if (!review) {
        res.status(404).json({ message: "Review Not Found", review: null });
        return;
      }
      review.rating = req.body.rating;
      review.review = req.body.review;
      await review.save();
      res.json({ message: "success", review: review });
      await updateProductReviewById(review.product.toString());
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error, review: null });
      return;
    }
  })
);

// delete review
reviewRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const review = await ReviewModel.deleteOne({ _id: req.params.id });
      res.json({ message: "success" });
      await updateProductReviewById(req.params.id);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  })
);

// Get all review for a product from ID and calculate average rating and the count
const updateProductReviewById = async (id: string) => {
  const reviews = await ReviewModel.find({ product: id });
  let rating = 0;
  if (reviews.length > 0) {
    rating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }
  const product = await ProductModel.findById(id);
  if (product) {
    product.rating = rating;
    product.numReviews = reviews.length;
    await product.save();
  }
};
