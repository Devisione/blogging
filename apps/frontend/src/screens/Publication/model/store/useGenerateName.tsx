import { useCallback } from "react";

export const useGenerateName = () => {
  const generate = useCallback(() => {
    console.log(123);
  }, []);
  return generate;
};
