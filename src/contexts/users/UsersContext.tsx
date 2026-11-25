import { createContext } from "react";

import type { UsersContextData } from "./types";

export const UsersContext = createContext<UsersContextData | undefined>(
  undefined,
);
