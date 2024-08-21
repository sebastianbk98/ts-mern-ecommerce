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
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Order } from "../types/Order";
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useEditReviewMutation,
  useGetOrderReviews,
} from "../hooks/reveiwHooks";
import { Review } from "../types/Review";
import Rating from "../components/Rating";

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
        if (user._id !== orderQuery.user && !user.isAdmin) {
          navigate("/orders");
          return;
        }
        setOrder(orderQuery);
      }
    }
  }, [isSuccess, navigate, orderId, orderQuery, user]);

  // REVIEW
  const {
    data: reviewsData,
    isLoading: isReviewLoading,
    error: reviewError,
    refetch: reviewRefecth,
  } = useGetOrderReviews(orderId!);
  const { mutateAsync: addReview, isPending: isAddReviewPending } =
    useAddReviewMutation();
  const { mutateAsync: editReview, isPending: isEditReviewPending } =
    useEditReviewMutation();
  const { mutateAsync: deleteReview, isPending: isDeleteReviewPending } =
    useDeleteReviewMutation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modal, setModal] = useState<{
    set: string;
    rating: number;
    review: string;
    product: string;
    reviewId?: string;
  }>();
  const getReview = (productId: string, reviews: Review[]) => {
    return reviews.filter((review) => review.product === productId);
  };
  const onAddReviewHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const review: Review = {
        rating: modal!.rating,
        review: modal!.review,
        order: order!,
        product: modal!.product,
        user: user!,
      };
      const response = await addReview(review);
      if (response.message === "success") {
        toast.success("Review Added");
        setShowModal(false);
        reviewRefecth();
        return;
      }
      toast.error(response.message);
      return;
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const onEditReviewHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const review: Review = {
        _id: modal!.reviewId,
        rating: modal!.rating,
        review: modal!.review,
        order: order!,
        product: modal!.product,
        user: user!,
      };
      const response = await editReview(review);
      if (response.message === "success") {
        toast.success("Review Edited");
        setShowModal(false);
        reviewRefecth();
        return;
      }
      toast.error(response.message);
      return;
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const onDeleteReviewHandler = async () => {
    try {
      const response = await deleteReview(modal!.reviewId!);
      if (response.message === "success") {
        toast.success("Review Deleted");
        setShowDeleteModal(false);
        reviewRefecth();
        return;
      }
      toast.error(response.message);
      return;
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
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
          {order.isDelivered && (
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
                      <div className="my-2">
                        {isReviewLoading ? (
                          <LoadingBox />
                        ) : reviewError ? (
                          <MessageBox variant="danger">
                            {getError(reviewError as ApiError)}
                          </MessageBox>
                        ) : getReview(item._id, reviewsData!.reviews).length ===
                          0 ? (
                          <Button
                            onClick={() => {
                              setModal({
                                set: "add",
                                rating: 1,
                                review: "",
                                product: item._id,
                              });
                              setShowModal(true);
                            }}
                          >
                            Add Review
                          </Button>
                        ) : (
                          <>
                            <div className="d-flex align-items-center justify-content-between">
                              Review
                              <Rating
                                rating={
                                  getReview(item._id, reviewsData!.reviews)[0]
                                    .rating
                                }
                                numReviews={0}
                              />
                              <Button
                                variant="link"
                                className="ms-2 p-0 m-0"
                                onClick={() => {
                                  const filteredReview = getReview(
                                    item._id,
                                    reviewsData!.reviews
                                  )[0];
                                  setModal({
                                    set: "edit",
                                    rating: filteredReview.rating,
                                    review: filteredReview.review,
                                    product: item._id,
                                    reviewId: filteredReview._id,
                                  });
                                  setShowModal(true);
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                            <div className="w-100 rounded border px-1 py-2">
                              {
                                getReview(item._id, reviewsData!.reviews)[0]
                                  .review
                              }
                            </div>
                            <Button
                              variant="danger"
                              className="px-1 py-0 mx-1 my-1"
                              onClick={() => {
                                const filteredReview = getReview(
                                  item._id,
                                  reviewsData!.reviews
                                )[0];
                                setModal((prevState) => ({
                                  ...prevState!,
                                  reviewId: filteredReview._id,
                                }));
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
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

          {!order.isDelivered && (
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
          )}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        className="mt-5"
      >
        <Modal.Header closeButton>
          {modal?.set === "add" ? "Add" : "Edit"} Review
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={
              modal?.set === "add" ? onAddReviewHandler : onEditReviewHandler
            }
            className="d-flex flex-column gap-2"
          >
            <Form.Group>
              <Form.Label className="rating">Rating</Form.Label>
              <div className="rating text-center">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <i
                      key={`star-${index}`}
                      className={
                        !modal
                          ? "far fa-star fa-2xl mx-1"
                          : modal!.rating >= index + 1
                          ? "fas fa-star fa-2xl mx-1"
                          : "far fa-star fa-2xl mx-1"
                      }
                      onClick={() => {
                        setModal((prevState) => ({
                          ...prevState!,
                          rating: index + 1,
                        }));
                      }}
                    />
                  ))}
              </div>
            </Form.Group>
            <textarea
              rows={3}
              value={modal?.review}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setModal((prevState) => ({
                  ...prevState!,
                  review: e.target.value,
                }));
              }}
            ></textarea>
            <Button
              type="submit"
              disabled={
                modal?.set === "add" ? isAddReviewPending : isEditReviewPending
              }
            >
              {modal?.set === "add" ? "Add" : "Edit"} Review
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
        }}
      >
        <Modal.Header closeButton>Delete Product</Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={onDeleteReviewHandler}
            disabled={isDeleteReviewPending}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderPage;
