import { useContext, useEffect } from "react";
import { Store } from "../Store";
import { useGetProductsQuery } from "../hooks/ProductHooks";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import Rating from "../components/Rating";

function ProductsAdminPage() {
  const {
    state: { user },
  } = useContext(Store);
  const { data, isLoading, error } = useGetProductsQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/signin");
    }
  }, [user, navigate]);
  return (
    <>
      <Helmet>
        <title>List of Products</title>
      </Helmet>
      <Container className="d-flex align-items-center justify-content-between flex-wrap">
        <h1>List of Products</h1>
        <Link to={"/admin/products/add"}>
          <Button>Add New Product</Button>
        </Link>
      </Container>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : data?.length === 0 ? (
        <MessageBox variant="danger">Product is empty.</MessageBox>
      ) : (
        <ListGroup variant="flush">
          {data?.map((product) => (
            <ListGroup.Item key={product._id}>
              <Link
                className="text-decoration-none text-reset"
                to={`/admin/products/${product.slug}`}
              >
                <Row className="align-items-center">
                  <Col md={3}>
                    <img
                      src={`http://localhost:8080/${product.image}`}
                      alt={product.name}
                      className="img-fluid rounded thumbnail"
                    ></img>{" "}
                    {product.name}
                  </Col>
                  <Col md={3}>
                    <span>{product.countInStock}</span>
                  </Col>
                  <Col md={3}>${product.price}</Col>
                  <Col md={3}>
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    />
                  </Col>
                </Row>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

export default ProductsAdminPage;
