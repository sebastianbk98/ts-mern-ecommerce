import { useContext, useEffect } from "react";
import { Store } from "../Store";
import { useCreateOrderMutation } from "../hooks/orderHooks";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import { Order } from "../types/Order";

function PlaceOrderPage() {
  const navigate = useNavigate();
  const {
    state: { cart, user },
    dispatch,
  } = useContext(Store);
  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const data: { message: string; order: Order } = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        user: user!,
      });
      dispatch({ type: "CART_CLEAR" });
      navigate(`/orders/${data.order._id}`);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Shipping{" "}
                <Link
                  className="text-decoration-none text-reset btn btn-outline-warning"
                  to="/shipping"
                >
                  Edit
                </Link>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Payment{" "}
                <Link
                  className="text-decoration-none text-reset btn btn-outline-warning"
                  to="/payment"
                >
                  Edit
                </Link>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Items{" "}
                <Link
                  className="text-decoration-none text-reset btn btn-outline-warning"
                  to="/cart"
                >
                  Edit
                </Link>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={`http://localhost:8080/${item.image}`}
                          alt={item.name}
                          className="img-fluid rounded thumbnail"
                        ></img>{" "}
                        <Link
                          className="text-decoration-none text-reset"
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Order Summary</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0 || isPending}
                    >
                      Place Order {isPending && <LoadingBox />}
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderPage;
