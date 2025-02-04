import { useContext, useEffect } from "react";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllOrdersByAdmin } from "../hooks/orderHooks";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { ListGroup, Container } from "react-bootstrap";

function OrdersAdminPage() {
  const {
    state: { user },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();
  const { data, isLoading, error, isError } = useGetAllOrdersByAdmin();
  useEffect(() => {
    if (!user || !user.isAdmin) {
      const redirect = encodeURI("/admin/orders");
      navigate("/signin?redirect=" + redirect);
    }
    if (isError) {
      if (getError(error as ApiError) === "Token Invalid") {
        dispatch({ type: "USER_RESIGNIN" });
        navigate("/signin?redirect=/admin/orders");
      }
    }
  }, [user, navigate, dispatch, isError, error]);
  return (
    <>
      <Helmet>All Orders</Helmet>
      <Container>
        <h1>Orders History (Admin)</h1>
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
                <ListGroup.Item className="d-flex align-items-center justify-content-between m-1">
                  <div>
                    <p>{order.orderItems.length} items</p>
                    <p className="fw-bold"> ${order.totalPrice}</p>
                  </div>
                  <MessageBox variant={order.isPaid ? "success" : "warning"}>
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </MessageBox>
                </ListGroup.Item>
              </Link>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default OrdersAdminPage;
