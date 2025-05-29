import { createContext } from "react";

export const FieldPathContext = createContext<{
  index: number;
}>({
  index: 0,
});
