import { useContext, useEffect } from "react";
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Store } from "./Store";
import { ToastContainer } from "react-toastify";

const App = () => {
  const {
    state: { mode, cart, user },
    dispatch,
  } = useContext(Store);
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", mode);
  }, [mode]);
  const navigate = useNavigate();
  const switchModeHandler = () => {
    dispatch({ type: "SWITCH_MODE" });
  };

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    navigate("/");
  };
  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer
        position="bottom-right"
        limit={2}
        theme={mode}
        autoClose={1500}
      />
      <header className={mode === "light" ? "bg-light" : "bg-dark"}>
        <Navbar expand="lg" className="px-5">
          <Link className="nav-link" to="/">
            <Navbar.Brand>TS/E-Commerce</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end text-center"
          >
            <Nav>
              <Button variant="mode" onClick={switchModeHandler}>
                <i
                  className={mode === "light" ? "fa fa-sun" : "fa fa-moon"}
                ></i>
              </Button>
              <Link className="nav-link" to="/cart">
                <Nav.Item>
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="warning">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Nav.Item>
              </Link>
              {user?.isAdmin && (
                <NavDropdown
                  title={`ADMIN`}
                  id="basic-nav-dropdown"
                  drop="down-centered"
                  align={{ xxl: "start" }}
                >
                  <NavDropdown.Item>
                    <Link className="dropdown-item" to={"/admin/products"}>
                      Products
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link className="dropdown-item" to={"/admin/orders"}>
                      Orders
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {user ? (
                <>
                  <NavDropdown
                    title={`Hi, ${user.name}`}
                    id="basic-nav-dropdown"
                    drop="down-centered"
                    align={{ xxl: "start" }}
                  >
                    <NavDropdown.Item>
                      <Link className="dropdown-item" to={"/orders/"}>
                        Order History
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign in
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer className="mt-5 pt-5">
        <div className="text-center">All right reserved</div>
      </footer>
    </div>
  );
};

export default App;
