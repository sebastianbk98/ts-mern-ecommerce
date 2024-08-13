import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { ShippingAddress } from "../types/Cart";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingAddressPage() {
  const navigate = useNavigate();
  const {
    state: {
      user,
      cart: { shippingAddress },
    },
    dispatch,
  } = useContext(Store);
  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/cart");
      return;
    }
  }, [navigate, user]);
  const [shippingForm, setShippingForm] = useState<ShippingAddress>({
    fullName: shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    country: shippingAddress.country || "",
    postalCode: shippingAddress.postalCode || "",
  });

  const onShippingAddressSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: shippingForm,
    });
    navigate("/payment");
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3={false} step4={false}></CheckoutSteps>
      <div className="small-container mx-auto text-center">
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={onShippingAddressSubmitHandler}>
          <Form.FloatingLabel
            controlId="floatingInput"
            label="Full Name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setShippingForm((currentState) => ({
                  ...currentState,
                  fullName: e.target.value,
                }));
              }}
              required
              placeholder="Name"
              value={shippingForm.fullName}
            />
          </Form.FloatingLabel>
          <Form.FloatingLabel
            controlId="floatingInput"
            label="Address"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setShippingForm((currentState) => ({
                  ...currentState,
                  address: e.target.value,
                }));
              }}
              required
              placeholder="Address"
              value={shippingForm.address}
            />
          </Form.FloatingLabel>
          <Form.FloatingLabel
            controlId="floatingInput"
            label="City"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setShippingForm((currentState) => ({
                  ...currentState,
                  city: e.target.value,
                }));
              }}
              required
              placeholder="City"
              value={shippingForm.city}
            />
          </Form.FloatingLabel>
          <Form.FloatingLabel
            controlId="floatingInput"
            label="Country"
            className="mb-3"
          >
            <Form.Control
              type="text"
              onChange={(e) => {
                setShippingForm((currentState) => ({
                  ...currentState,
                  country: e.target.value,
                }));
              }}
              required
              placeholder="Country"
              value={shippingForm.country}
            />
            <Form.FloatingLabel
              controlId="floatingInput"
              label="Postal Code"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setShippingForm((currentState) => ({
                    ...currentState,
                    postalCode: e.target.value,
                  }));
                }}
                required
                placeholder="Postal Code"
                value={shippingForm.postalCode}
              />
            </Form.FloatingLabel>
          </Form.FloatingLabel>
          <div className="mb-3 d-grid">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default ShippingAddressPage;
