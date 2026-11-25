import { useContext } from "react";

import { UsersContext } from "./UsersContext";

export function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers deve ser utilizado dentro de UsersProvider.");
  }

  return context;
}
