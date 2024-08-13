import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentPage() {
  const navigate = useNavigate();
  const {
    state: {
      user,
      cart: { paymentMethod },
    },
    dispatch,
  } = useContext(Store);

  const [payment, setPayment] = useState(paymentMethod || "PayPal");

  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/cart");
    }
  }, [navigate, user]);

  const onPaymentSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: payment,
    });
    navigate("/placeorder");
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4={false}></CheckoutSteps>

      <div className="small-container mx-auto">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3 text-center">Payment Method</h1>
        <Form
          onSubmit={onPaymentSubmitHandler}
          className="justify-content-center"
        >
          <Form.Check
            type="radio"
            label="PayPal"
            value="PayPal"
            name="payment"
            checked={payment === "PayPal"}
            onChange={(e) => {
              setPayment(e.target.value);
            }}
            className="my-1 mx-auto"
          />
          <Form.Check
            type="radio"
            label="Stripe"
            value="Stripe"
            name="payment"
            checked={payment === "Stripe"}
            onChange={(e) => {
              setPayment(e.target.value);
            }}
            className="my-1"
          />
          <Form.Check
            type="radio"
            label="Bank Virtual Account"
            value="Bank Virtual Account"
            name="payment"
            checked={payment === "Bank Virtual Account"}
            onChange={(e) => {
              setPayment(e.target.value);
            }}
            className="my-1"
          />
          <div className="my-1 d-grid">
            <Button type="submit" disabled={!payment}>
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default PaymentPage;
