// type for each item in cart
export type CartItem = {
  image: string | undefined;
  slug: string;
  quantity: number;
  countInStock: number;
  price: number;
  _id: string;
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
