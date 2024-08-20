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
  ListGroup,
  Row,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useContext } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";

const ProductPage = () => {
  const { slug } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();
  const addToCartHandler = async () => {
    const cartItem = convertProductToCartItem(product!);
    const existItem = cartItems.find((item) => item._id === cartItem._id);
    if (existItem) {
      if (existItem.quantity + 1 > existItem.countInStock) {
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
  return isLoading ? (
    <>
      <Helmet>
        <title>Product Page</title>
      </Helmet>
      <LoadingBox />
    </>
  ) : error ? (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <MessageBox>{getError(error)}</MessageBox>
    </>
  ) : !product ? (
    <>
      <Helmet>
        <title>Product Page</title>
      </Helmet>
      <MessageBox>Product Not Found</MessageBox>
    </>
  ) : (
    <>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Row>
        <Col md={6}>
          <img
            className="large"
            src={`http://localhost:8080/${product.image}`}
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
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
                  <Button variant="warning" onClick={addToCartHandler}>
                    Add To Cart
                  </Button>
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductPage;
