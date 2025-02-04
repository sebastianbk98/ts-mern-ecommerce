import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage = "Something went wrong.";
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="text-center p-4">
      <h1 className="text-red-600 text-2xl font-bold">
        Oops! An error occurred.
      </h1>
      <p className="text-gray-700">{errorMessage}</p>
      <a href="/" className="text-blue-500 underline">
        Go back home
      </a>
    </div>
  );
};

export default ErrorPage;
