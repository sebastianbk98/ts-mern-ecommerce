import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ReviewModel } from "../models/reviewModel";
import { ProductModel } from "../models/productModel";
import { isAuth } from "../utils";

export const reviewRouter = Router();

// reviewRouter.get(
//   "/updateReview",
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     try {
//       const products = await ProductModel.find();
//       for (const product of products) {
//         await updateProductReviewById(product._id, );
//       }
//       res.json({ message: "success", products: products });
//       return;
//     } catch (error) {
//       res.status(500).json({ message: error, products: null });
//       return;
//     }
//   })
// );

// get all reviews
reviewRouter.get(
  "/",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const reviews = await ReviewModel.find().sort({ createdAt: "desc" });
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
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
      })
        .populate("user")
        .populate("product")
        .populate("order");
      res.json({ message: "success", reviews: reviews });
      return;
    } catch (error) {
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
      await updateProductReviewById(req.body.product, review.rating);
      return;
    } catch (error) {
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

      if (!review) {
        res.status(404).json({ message: "Review Not Found", review: null });
        return;
      }
      await updateProductReviewById(
        review.product.toString(),
        req.body.rating - review.rating,
        true
      );
      review.rating = req.body.rating;
      review.review = req.body.review;
      await review.save();
      res.json({ message: "success", review: review });
      return;
    } catch (error) {
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
      const review = await ReviewModel.findById(req.params.id);
      if (review) {
        await updateProductReviewById(
          review.product.toString(),
          review.rating,
          false,
          true
        );
        await review.deleteOne();
        res.json({ message: "success" });
        return;
      }
      res.status(500).json({ message: "Review not found" });
      return;
    } catch (error) {
      res.status(500).json({ message: error });
      return;
    }
  })
);

// Get all review for a product from ID and calculate average rating and the count
const updateProductReviewById = async (
  id: string,
  newRating: number,
  _edit: boolean = false,
  _delete: boolean = false
) => {
  const updatedProduct = await ProductModel.findById(id);
  if (updatedProduct) {
    updatedProduct.ratingTotal += _delete ? -1 * newRating : newRating;
    updatedProduct.numReviews += _delete ? -1 : _edit ? 0 : 1;
    updatedProduct.rating =
      updatedProduct.numReviews === 0
        ? 0
        : updatedProduct.ratingTotal / updatedProduct.numReviews;

    await updatedProduct.save();
  }
};
