import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthenticationProvider } from "./contexts/authentication/AuthenticationProvider";

export default function App() {
  return (
    <AuthenticationProvider>
      <RouterProvider router={router} />
    </AuthenticationProvider>
  );
}
