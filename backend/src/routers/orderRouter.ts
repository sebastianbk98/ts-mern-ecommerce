import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { isAuth } from "../utils";
import { Item, Order, OrderModel } from "../models/orderModel";
import { CartItem } from "../types/Cart";
import { mongoose } from "@typegoose/typegoose";

export const orderRouter = Router();

orderRouter.post(
  "/",
  isAuth,
  AsyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: "Cart is empty!" });
      return;
    }
    const createdOrder = await OrderModel.create({
      orderItems: req.body.orderItems.map(
        (item: CartItem) =>
          ({
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            product: item._id,
            slug: item.slug,
          } as Item)
      ),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    res.status(201).json({ message: "Order Created", order: createdOrder });
  })
);

orderRouter.get(
  "/",
  isAuth,
  AsyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id });
    res.json({ message: "Order History Found", orders: orders });
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  AsyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.status(200).json(order);
      return;
    }
    res.status(404).json({ message: "Order Not Found" });
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  AsyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order Not Found" });
      return;
    }
    order.isPaid = true;
    order.paidAt = new Date(Date.now());
    order.paymentResult = {
      paymentId: req.body.paymentId,
      status: req.body.status,
      emailAddress: req.body.emailAddress,
      updateTime: req.body.updateTime,
    };
    const updatedOrder = await order.save();
    res.json({ message: "Payment success", order: updatedOrder });
  })
);
