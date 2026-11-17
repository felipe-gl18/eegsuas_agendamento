import { useContext } from "react";
import { FormationsContext } from "./FormationsContext";

export function useFormations() {
  const context = useContext(FormationsContext);

  if (!context) {
    throw new Error(
      "useFormations deve ser utilizado dentro de FormationsProvider.",
    );
  }

  return context;
}
