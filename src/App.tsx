import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthenticationProvider } from "./contexts/authentication/AuthenticationProvider";
import { FormationsProvider } from "./contexts/formations/FormationsProvider";

export default function App() {
  return (
    <AuthenticationProvider>
      <FormationsProvider>
        <RouterProvider router={router} />
      </FormationsProvider>
    </AuthenticationProvider>
  );
}
