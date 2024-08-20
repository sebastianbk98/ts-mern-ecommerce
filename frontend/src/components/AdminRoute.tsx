import { useContext } from "react";
import { Store } from "../Store";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const {
    state: { user },
  } = useContext(Store);
  if (user?.isAdmin) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}

export default AdminRoute;
