import { FormEvent, useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../hooks/userHooks";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";

function SignUpPage() {
  const {
    state: { user },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const { mutateAsync: signup, isPending } = useSignUpMutation();

  const onSignUpHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const data = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      dispatch({
        type: "USER_SIGNIN",
        payload: data,
      });
      navigate(redirect);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };
  return (
    <div className="small-container mx-auto text-center">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={onSignUpHandler}>
        <Form.FloatingLabel
          controlId="floatingInput"
          label="Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            onChange={(e) => {
              setForm((currentState) => ({
                ...currentState,
                name: e.target.value,
              }));
            }}
            required
            placeholder="Name"
            autoComplete="off"
          />
        </Form.FloatingLabel>

        <Form.FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            onChange={(e) => {
              setForm((currentState) => ({
                ...currentState,
                email: e.target.value,
              }));
            }}
            required
            placeholder="name@example.com"
          />
        </Form.FloatingLabel>

        <Form.FloatingLabel
          controlId="password"
          label="Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            onChange={(e) => {
              setForm((currentState) => ({
                ...currentState,
                password: e.target.value,
              }));
            }}
            required
            placeholder="*****"
          />
        </Form.FloatingLabel>
        <Form.FloatingLabel
          controlId="password"
          label="Confirm Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            onChange={(e) => {
              setForm((currentState) => ({
                ...currentState,
                confirmPassword: e.target.value,
              }));
            }}
            required
            placeholder="*****"
          />
        </Form.FloatingLabel>
        <div className="mb-3 d-grid">
          <Button type="submit" disabled={isPending}>
            Sign Up {isPending && <LoadingBox />}
          </Button>
        </div>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </div>
  );
}

export default SignUpPage;
