import { createContext } from "react";
import type { FormationsContextData } from "./types";

export const FormationsContext = createContext<
  FormationsContextData | undefined
>(undefined);
