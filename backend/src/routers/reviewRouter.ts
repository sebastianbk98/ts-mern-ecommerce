import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ReviewModel } from "../models/reviewModel";
import { isAuth } from "../utils";

export const reviewRouter = Router();

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
      }).sort({ createdAt: "desc" });
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
      res.json({ message: "success", review: review });
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
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
      return;
    }
  })
);
