import { useContext } from "react";
import { Store } from "../Store";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const {
    state: { user },
  } = useContext(Store);
  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/signin" />;
}

export default ProtectedRoute;
