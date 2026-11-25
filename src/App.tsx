import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthenticationProvider } from "./contexts/authentication/AuthenticationProvider";
import { FormationsProvider } from "./contexts/formations/FormationsProvider";
import { UsersProvider } from "./contexts/users/UsersProvider";
import { ScheduleProvider } from "./contexts/schedule/ScheduleProvider";

export default function App() {
  return (
    <AuthenticationProvider>
      <FormationsProvider>
        <UsersProvider>
          <ScheduleProvider>
            <RouterProvider router={router} />
          </ScheduleProvider>
        </UsersProvider>
      </FormationsProvider>
    </AuthenticationProvider>
  );
}
