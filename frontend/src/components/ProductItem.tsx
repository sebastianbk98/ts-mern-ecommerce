import { Button, Card, CardBody, CardText, CardTitle } from "react-bootstrap";
import { Product } from "../types/Product";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useContext } from "react";
import { Store } from "../Store";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async () => {
    const cartItem = convertProductToCartItem(product);
    const existItem = cartItems.find((item) => item._id === cartItem._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (existItem) {
      if (quantity > existItem.countInStock) {
        toast.warn("Sorry, product is out of stock");
        return;
      }
    }
    await dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...cartItem, quantity },
    });
    toast.success("Product succesfully added to the cart");
    return;
  };
  return (
    <Card>
      <Link to={"/product/" + product.slug}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <CardBody>
        <Link to={"/product/" + product.slug}>
          <CardTitle>{product.name}</CardTitle>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <CardText>${product.price}</CardText>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            variant="warning"
            onClick={() => {
              addToCartHandler();
            }}
          >
            Add to cart
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

export default ProductItem;
