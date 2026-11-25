import { useContext } from "react";

import { SolicitationsContext } from "./SolicitationsContext";

export function useSolicitations() {
  const context = useContext(SolicitationsContext);

  if (!context) {
    throw new Error(
      "useSolicitations deve ser utilizado dentro de SolicitationsProvider.",
    );
  }

  return context;
}
