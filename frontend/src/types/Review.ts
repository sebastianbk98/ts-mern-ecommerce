import { Order } from "./Order";
import { User } from "./User";

export type Review = {
  _id?: string;
  rating: number;
  review: string;
  user: User;
  product: string;
  order: Order;
};
