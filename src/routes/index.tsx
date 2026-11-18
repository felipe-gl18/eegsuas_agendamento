import { createBrowserRouter } from "react-router-dom";
import Solicitation from "../pages/solicitation/Solicitation";
import NotFound from "../pages/erros/NotFound";
import AuthLayout from "../layouts/AuthenticationLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ProtectedRoute } from "./ProtectedRoute";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import TrainingTracks from "../pages/training-tracks/TrainingTracks";
import TrainingTrackDetails from "../pages/training-tracks/TrainingTrackDetails";

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
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <div>Dashboard</div> },
          { path: "/dashboard/training-tracks", element: <TrainingTracks /> },
          {
            path: "/dashboard/training-tracks/:id",
            element: <TrainingTrackDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
