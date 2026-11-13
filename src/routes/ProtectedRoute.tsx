import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../contexts/authentication/useAuthentication";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthentication();

  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
