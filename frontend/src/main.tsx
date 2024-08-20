import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import ProductPage from "./pages/ProductPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store.tsx";
import CartPage from "./pages/CartPage.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ShippingAddressPage from "./pages/ShippingAddressPage.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import OrdersAdminPage from "./pages/OrdersAdminPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/shipping" element={<ShippingAddressPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/orders/" element={<OrdersPage />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/orders/admin" element={<OrdersAdminPage />} />
      </Route>

      {/* <Route path="dashboard" element={<Dashboard />} /> */}
      {/* ... etc. */}
    </Route>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
