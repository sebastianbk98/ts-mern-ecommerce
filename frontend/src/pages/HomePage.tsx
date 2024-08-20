import { Carousel, Col, Row } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import {
  useGetLatestProductsQuery,
  useGetProductsQuery,
  useGetTop4ProductsQuery,
} from "../hooks/ProductHooks";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { useContext } from "react";
import { Store } from "../Store";

const HomePage = () => {
  const {
    state: { mode },
  } = useContext(Store);
  const {
    data: products,
    isLoading: isProductsLoading,
    error: productsError,
  } = useGetProductsQuery();
  const {
    data: latest,
    isLoading: isLatestLoading,
    error: latestError,
  } = useGetLatestProductsQuery();
  const {
    data: top4,
    isLoading: isTop4Loading,
    error: top4Error,
  } = useGetTop4ProductsQuery();

  return (
    <>
      <Helmet>
        <title>TS E-Commerce Homepage</title>
      </Helmet>
      {isTop4Loading ? (
        <LoadingBox />
      ) : top4Error ? (
        <MessageBox variant="danger">
          {getError(top4Error as ApiError)}
        </MessageBox>
      ) : top4!.length === 0 ? (
        <MessageBox variant="danger">
          Sorry, there is no Top Products.
        </MessageBox>
      ) : (
        <Carousel fade id="carousel-section" className="mb-5">
          {top4!.map((product, index) => (
            <Carousel.Item
              key={`carousel-item-${product._id}`}
              className="carousel-item"
            >
              <img
                className="d-block w-100 carousel-image"
                src={`http://localhost:8080/${product.image}`}
              />
              <Carousel.Caption
                className={
                  mode === "light" ? "bg-caption-dark" : "bg-caption-light"
                }
              >
                <h3>
                  Top {index + 1}: {product.name}
                </h3>
                <p>{product.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
      <h1 className="text-center">Latest Products</h1>
      {isLatestLoading ? (
        <LoadingBox />
      ) : latestError ? (
        <MessageBox variant="danger">
          {getError(latestError as ApiError)}
        </MessageBox>
      ) : latest?.length === 0 ? (
        <MessageBox>Sorry, there is no latest product.</MessageBox>
      ) : (
        <Row className="justify-content-center">
          {latest!.map((product) => (
            <Col lg={3} md={4} sm={6} key={product.slug} className="mb-3">
              <ProductItem product={product} />
            </Col>
          ))}
        </Row>
      )}
      <h1 className="text-center">All Products</h1>
      {isProductsLoading ? (
        <LoadingBox />
      ) : productsError ? (
        <MessageBox variant="danger">
          {getError(productsError as ApiError)}
        </MessageBox>
      ) : products?.length === 0 ? (
        <MessageBox>Sorry, there is no product available.</MessageBox>
      ) : (
        <Row className="justify-content-center">
          {products!.map((product) => (
            <Col lg={3} md={4} sm={6} key={product.slug} className="mb-3">
              <ProductItem product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomePage;
