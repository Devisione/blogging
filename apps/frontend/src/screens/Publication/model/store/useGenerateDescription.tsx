import { useCallback } from "react";

export const useGenerateDescription = () => {
  const generate = useCallback(() => {
    console.log(123);
  }, []);
  return generate;
};
