import { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { useSignInMutation } from "../hooks/userHooks";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import LoadingBox from "../components/LoadingBox";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";

const SigninPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    state: { user },
    dispatch,
  } = useContext(Store);

  const { mutateAsync: signin, isPending } = useSignInMutation();

  const onSigninHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await signin({ email, password });
      dispatch({ type: "USER_SIGNIN", payload: data! });
      navigate(redirect);
    } catch (error) {
      toast.error(getError(error as ApiError));
    }
  };

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, redirect, user]);

  return (
    <div className="small-container mx-auto text-center">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={onSigninHandler}>
        <Form.FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            placeholder="name@example.com"
            autoComplete="off"
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
              setPassword(e.target.value);
            }}
            required
            placeholder="*****"
          />
        </Form.FloatingLabel>
        <div className="mb-3 d-grid">
          <Button type="submit" disabled={isPending}>
            Sign In {isPending && <LoadingBox />}
          </Button>
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </div>
  );
};

export default SigninPage;
