import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductDetailsBySlugQuery,
} from "../hooks/ProductHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Button, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import Rating from "../components/Rating";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { Store } from "../Store";

function ProductDetailsAdminPage() {
  const { dispatch } = useContext(Store);
  const [showModal, setShowModal] = useState(false);
  const { slug } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);
  const { mutateAsync: deleteProduct, isPending } = useDeleteProductMutation();
  const navigate = useNavigate();
  const onDeleteHandler = async () => {
    try {
      setShowModal(false);
      const data = await deleteProduct(product!._id);
      if (data.message !== "success") {
        toast.error(data.message);
        return;
      }
      toast("Product Deleted");
      navigate("/admin/products");
    } catch (error) {
      toast.error(getError(error as ApiError));
      if (getError(error as ApiError) === "Token Invalid") {
        dispatch({ type: "USER_RESIGNIN" });
        navigate("/signin");
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Product Details</title>
      </Helmet>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <LoadingBox />
        </div>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : !product ? (
        <MessageBox variant="danger">Product Not Found</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <Container>
            <Row>
              <Col md={6}>
                <img className="large" src={product.image} alt={product.name} />
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item className="text-center">
                    <h1>{product.name}</h1>
                  </ListGroup.Item>
                  <ListGroup.Item className="text-center">
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Price:</span> <span>${product.price}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    Description
                    <span>{product.description}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    Category
                    <span>{product.category}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    Stock
                    <span>{product.countInStock}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex flex-column gap-3">
                    <Link
                      to={`/admin/products/${product.slug}/edit`}
                      className="d-grid text-decoration-none"
                    >
                      <Button variant="warning">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setShowModal(true);
                      }}
                      disabled={isPending}
                      className="d-flex justify-content-center align-items-center"
                    >
                      Delete {isPending && <LoadingBox />}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Container>
          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
          >
            <Modal.Header closeButton>Delete Product</Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this product?
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
              <Button variant="danger" onClick={onDeleteHandler}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default ProductDetailsAdminPage;
