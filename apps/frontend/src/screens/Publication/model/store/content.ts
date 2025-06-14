import { createContext } from "react";
import type { UseFieldArrayUpdate } from "react-hook-form/dist/types/fieldArray";

export const FieldPathContext = createContext<{
  has: boolean;
  index: number;
  update: UseFieldArrayUpdate<any>;
}>({
  has: false,
  index: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- всё ок
  update: (_record) => {},
});
