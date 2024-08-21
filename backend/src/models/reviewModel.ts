import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./userModel";
import { Product } from "./productModel";
import { Order } from "./orderModel";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review {
  public _id?: string;
  @prop({ required: true, default: 0 })
  public rating!: number;
  @prop({ required: true })
  public review!: string;
  @prop({ required: true, ref: User })
  public user!: Ref<User>;
  @prop({ required: true, ref: Product })
  public product!: Ref<Product>;
  @prop({ required: true, ref: Order })
  public order!: Ref<Order>;
}

export const ReviewModel = getModelForClass(Review);
