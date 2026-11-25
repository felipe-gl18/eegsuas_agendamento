import { createContext } from "react";

import type { SolicitationsContextData } from "./types";

export const SolicitationsContext = createContext<
  SolicitationsContextData | undefined
>(undefined);
