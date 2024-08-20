import jwt from "jsonwebtoken";
import { User } from "./models/userModel";
import { NextFunction, Request, Response } from "express";

export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret"
    );
    req.user = decode as {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      token: string;
    };
    next();
  } else {
    res.status(404).json({ message: "No Token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret"
    ) as {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      token: string;
    };
    if (!decode.isAdmin) {
      res.status(403).json({ message: "User not an admin" });
      return;
    }
    req.user = decode;
    next();
  } else {
    res.status(404).json({ message: "No Token" });
  }
};
