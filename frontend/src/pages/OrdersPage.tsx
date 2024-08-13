import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Link } from "react-router-dom";
import { useGetAllOrders } from "../hooks/orderHooks";
import { ListGroup, ListGroupItem } from "react-bootstrap";

function OrdersPage() {
  const { data, isLoading, error } = useGetAllOrders();
  return (
    <>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      <h1>Orders History</h1>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : data!.orders.length === 0 ? (
        <MessageBox>
          <MessageBox>
            Orders is empty. <Link to={"/"}>Go Shopping</Link>
          </MessageBox>
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
    </>
  );
}

export default OrdersPage;
