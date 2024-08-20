import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { CartItem } from "../types/Cart";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../components/MessageBox";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartQuantityHandler = (item: CartItem, quantity: number) => {
    if (quantity > item.countInStock) {
      toast.warn("Sorry, product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    return;
  };

  const removeCartItemFromCart = (item: CartItem) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
    toast.warn("Product successfully removed from the cart");
  };

  const checkoutHandler = () => navigate("/signIn?redirect=/shipping");
  return (
    <>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to={"/"}>Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item: CartItem) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={`http://localhost:8080/${item.image}`}
                        alt={item.name}
                        className="img-fluid rounded thumbnail"
                      />{" "}
                      <Link
                        className="text-decoration-none text-reset"
                        to={item.slug}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant={mode}
                        onClick={() =>
                          updateCartQuantityHandler(item, item.quantity - 1)
                        }
                        className="mx-1"
                      >
                        <i className="fa fa-minus"></i>
                      </Button>
                      {item.quantity}
                      <Button
                        variant={mode}
                        onClick={() =>
                          updateCartQuantityHandler(item, item.quantity + 1)
                        }
                        className="mx-1"
                      >
                        <i className="fa fa-plus"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant={mode}
                        onClick={() => removeCartItemFromCart(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Checkout</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal: ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item className="d-grid">
                  <Button
                    type="button"
                    variant="warning"
                    onClick={checkoutHandler}
                    disabled={
                      cartItems.reduce((a, c) => a + c.quantity, 0) === 0
                    }
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartPage;
