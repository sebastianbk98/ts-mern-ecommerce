import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery } from "../hooks/ProductHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { convertProductToCartItem, getError } from "../utils";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  ListGroup,
  Row,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useContext } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { useGetProductReviews } from "../hooks/reviewHooks";
import ReviewBox from "../components/ReviewBox";

const ProductPage = () => {
  const { slug } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = useGetProductReviews(product?._id ?? "");

  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();
  const addToCartHandler = async () => {
    const cartItem = convertProductToCartItem(product!);
    const existItem = cartItems.find(
      (item) => item.product._id === cartItem.product._id
    );
    if (existItem) {
      if (existItem.quantity + 1 > existItem.product.countInStock) {
        toast.warn("Sorry, product is out of stock");
        return;
      }
    }
    await dispatch({
      type: "CART_ADD_ITEM",
      payload: cartItem,
    });
    navigate("/cart");
    toast.success("Product succesfully added to the cart");
    return;
  };

  return (
    <>
      <Helmet>
        <title>Product Page</title>
      </Helmet>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <LoadingBox />
        </div>
      ) : error ? (
        <>
          <MessageBox variant="danger">{getError(error)}</MessageBox>
        </>
      ) : !product ? (
        <>
          <MessageBox>Product Not Found</MessageBox>
        </>
      ) : (
        <>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Container>
            <Row>
              <Col
                md={6}
                className="d-flex align-items-center justify-content-center"
              >
                <img className="large" src={product.image} alt={product.name} />
              </Col>
              <Col md={6}>
                <Row className="justify-content-center">
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h1>{product.name}</h1>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Rating
                          rating={product.rating}
                          numReviews={product.numReviews}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                      <ListGroup.Item>
                        Description
                        <p>{product.description}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <Row>
                              <Col>Price</Col>
                              <Col>${product.price}</Col>
                            </Row>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <Row>
                              <Col>Status</Col>
                              <Col>
                                {product.countInStock > 0 ? (
                                  <Badge bg="success">In Stock</Badge>
                                ) : (
                                  <Badge bg="danger">Out of Stock</Badge>
                                )}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                          {product.countInStock > 0 && (
                            <Button
                              variant="warning"
                              onClick={addToCartHandler}
                            >
                              Add To Cart
                            </Button>
                          )}
                        </ListGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row id="reviews">
                  <Col md={12}>
                    <h3>Reviews</h3>
                    {isLoadingReviews ? (
                      <div className="d-flex justify-content-center">
                        <LoadingBox />
                      </div>
                    ) : errorReviews ? (
                      <MessageBox variant="danger">
                        {getError(errorReviews)}
                      </MessageBox>
                    ) : reviews?.reviews.length === 0 ? (
                      <MessageBox>There are no reviews</MessageBox>
                    ) : (
                      <ListGroup>
                        {reviews!.reviews.map((review) => (
                          <ListGroup.Item key={review._id}>
                            <ReviewBox review={review} />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default ProductPage;
