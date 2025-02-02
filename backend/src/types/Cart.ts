import { Product } from "../models/productModel";

// type for each item in cart
export type CartItem = {
  image: string | undefined;
  quantity: number;
  price: number;
  product: Product;
  name: string;
};
// type for shipping address
export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

// type for the whole cart
export type Cart = {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};
