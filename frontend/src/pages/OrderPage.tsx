// import { useContext } from "react";
// import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeliverOrderMutation,
  useGetorderDetailsQuery,
  usePayOrderMutation,
} from "../hooks/orderHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Order } from "../types/Order";

function OrderPage() {
  const {
    state: { user },
  } = useContext(Store);
  const [order, setOrder] = useState<Order>();
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { mutateAsync: payOrder, isPending } = usePayOrderMutation();
  const { mutateAsync: deliverOrder, isPending: isDeliveryPending } =
    useDeliverOrderMutation();
  const {
    data: orderQuery,
    isLoading,
    error,
    isSuccess,
  } = useGetorderDetailsQuery(orderId!);
  const onPayOrderHandler = async () => {
    try {
      const data = await payOrder({
        orderId: orderId!,
        paymentId: crypto.randomUUID(),
        status: "SUCCESS",
        emailAddress: user!.email,
        updateTime: Date.now().toString(),
      });
      toast.success(data.message);
      setOrder(data.order);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };
  const onDeliverHandler = async () => {
    try {
      const data = await deliverOrder(orderId!);
      toast.success(data.message);
      setOrder(data.order);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };
  useEffect(() => {
    if (!user) {
      navigate(`/signin?redirect/orders/${orderId}`);
      return;
    }
    if (isSuccess) {
      if (orderQuery) {
        console.log(orderQuery.user, user._id);
        if (user._id !== orderQuery.user && !user.isAdmin) {
          navigate("/orders");
          return;
        }
        setOrder(orderQuery);
      }
    }
  }, [isSuccess, navigate, orderId, orderQuery, user]);
  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  ) : (
    <>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Shipping
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Payment
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Items{" "}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={`order-page-${item._id}`}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
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
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              <div className="d-grid m-1">
                <Button onClick={onPayOrderHandler} disabled={order.isPaid}>
                  {order.isPaid
                    ? "Already Paid"
                    : `Pay with ${order.paymentMethod} (Test)`}
                  {isPending && <LoadingBox />}
                </Button>
              </div>
              {user?.isAdmin && (
                <div className="d-grid m-1">
                  <Button
                    onClick={onDeliverHandler}
                    disabled={order.isDelivered || !order.isPaid}
                  >
                    {order.isDelivered
                      ? "Already Delivered"
                      : !order.isPaid
                      ? "`Deliver Order (Not Yet Paid)`"
                      : `Deliver Order (Test)`}
                    {isDeliveryPending && <LoadingBox />}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderPage;
