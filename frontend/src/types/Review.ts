import { Order } from "./Order";
import { Product } from "./Product";
import { User } from "./User";

export type Review = {
  _id?: string;
  rating: number;
  review: string;
  user: User;
  product: Product;
  order: Order;
};
