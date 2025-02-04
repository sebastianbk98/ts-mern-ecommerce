import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllOrdersByUser } from "../hooks/orderHooks";
import { ListGroup, ListGroupItem, Container } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { Store } from "../Store";

function OrdersPage() {
  const {
    state: { user },
    dispatch,
  } = useContext(Store);
  const { data, isLoading, error, isError } = useGetAllOrdersByUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/orders");
    }
    if (isError) {
      if (getError(error as ApiError) === "Token Invalid") {
        dispatch({ type: "USER_RESIGNIN" });
        navigate("/signin?redirect=/orders");
      }
    }
  }, [user, navigate, dispatch, isError, error]);
  return (
    <>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      <Container>
        <h1>Orders History</h1>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <LoadingBox />
          </div>
        ) : error ? (
          <MessageBox variant="danger">
            {getError(error as ApiError)}
          </MessageBox>
        ) : data!.orders.length === 0 ? (
          <MessageBox>
            Orders is empty. <Link to={"/"}>Go Shopping</Link>
          </MessageBox>
        ) : (
          <ListGroup>
            {data!.orders.map((order) => (
              <Link
                to={`/orders/${order._id}`}
                key={order._id}
                className="text-decoration-none"
              >
                <ListGroupItem className="d-flex align-items-center justify-content-between m-1">
                  <div>
                    <p>{order.orderItems.length} items</p>
                    <p className="fw-bold"> ${order.totalPrice}</p>
                  </div>
                  <MessageBox variant={order.isPaid ? "success" : "warning"}>
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </MessageBox>
                </ListGroupItem>
              </Link>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default OrdersPage;
