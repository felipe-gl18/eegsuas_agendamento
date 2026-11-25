import { createContext } from "react";

import type { ScheduleContextData } from "./types";

export const ScheduleContext = createContext<ScheduleContextData | undefined>(
  undefined,
);
