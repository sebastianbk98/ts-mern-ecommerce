import { createContext, Dispatch, Reducer, useReducer } from "react";
import { Cart, CartItem, ShippingAddress } from "./types/Cart";
import { User } from "./types/User";

type AppState = {
  mode: string;
  cart: Cart;
  user?: User;
};
const initialState: AppState = {
  mode: localStorage.getItem("mode")
    ? localStorage.getItem("mode")!
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light",
  cart: {
    //TODO change the local storage to database
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")!)
      : [],
    //TODO change the local storage to database
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress")!)
      : { location: {} },
    //TODO change the local storage to database
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")!
      : "PayPal",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

type Action =
  | { type: "SWITCH_MODE" }
  | { type: "CART_ADD_ITEM"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  | { type: "CART_CLEAR" }
  | { type: "USER_SIGNIN"; payload: User }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SWITCH_MODE": {
      const mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("mode", mode);
      return { ...state, mode: mode };
    }
    case "CART_ADD_ITEM": {
      // payload will be a CartItem
      const newItem = action.payload;
      // check if item already exist
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      //TODO change the local storage to database
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case "USER_SIGNIN": {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    }
    case "USER_SIGNOUT": {
      localStorage.removeItem("user");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      return {
        mode:
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        cart: {
          cartItems: [],
          paymentMethod: "PayPal",
          shippingAddress: {
            fullName: "",
            address: "",
            postalCode: "",
            city: "",
            country: "",
          },
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      localStorage.setItem("paymentMethod", action.payload);
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }
    case "CART_CLEAR": {
      localStorage.removeItem("cartItems");
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    default:
      return state;
  }
};

const defaultDispatch: Dispatch<Action> = () => initialState;

const Store = createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

const StoreProvider = (props: React.PropsWithChildren<object>) => {
  const [state, dispatch] = useReducer<Reducer<AppState, Action>>(
    reducer,
    initialState
  );

  return <Store.Provider value={{ state, dispatch }} {...props} />;
};

export { Store, StoreProvider };
