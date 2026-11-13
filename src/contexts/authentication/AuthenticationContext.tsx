import { createContext } from "react";
import type { AuthenticationContextData } from "./types";

export const AuthenticationContext = createContext<
  AuthenticationContextData | undefined
>(undefined);
