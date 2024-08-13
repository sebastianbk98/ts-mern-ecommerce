import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import AsyncHandler from "express-async-handler";
import { User, UserModel } from "../models/userModel";
import { generateToken } from "../utils";

export const userRouter = Router();

userRouter.post(
  "/signin",
  AsyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: "Email is not registered" });
      return;
    }
    if (!bcrypt.compareSync(req.body.password, user!.password)) {
      res.status(401).json({ message: "Incorrect Password" });
      return;
    }
    res.status(200).json({
      _id: user!._id,
      name: user!.name,
      email: user!.email,
      isAdmin: user!.isAdmin,
      token: generateToken(user!),
    });
  })
);

userRouter.post(
  "/signup",
  AsyncHandler(async (req: Request, res: Response) => {
    try {
      const createdUser = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      } as User);
      res.status(200).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    } catch (error) {
      res.status(400).json({ message: "Email already registered" });
    }
  })
);
