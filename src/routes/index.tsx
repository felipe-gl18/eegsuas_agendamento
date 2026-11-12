import { createBrowserRouter } from "react-router-dom";
import Solicitation from "../pages/solicitation/Solicitation";
import NotFound from "../pages/erros/NotFound";
import AuthLayout from "../layouts/AuthenticationLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const router = createBrowserRouter([
  {
    element: <Solicitation />,
    path: "/solicitation",
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
