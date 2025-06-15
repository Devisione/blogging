import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { useUnit } from "effector-react";
import { $event } from "@entities/Event/model/store/event";

export const useGenerateDescription = (fieldName: string) => {
  const { setValue } = useFormContext();
  const event = useUnit($event.$data);

  return useCallback(async () => {
    const { data } = await axios.post<{ description: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate/description`,
      {
        topic: event?.description,
      },
    );

    setValue(fieldName, data.description);
  }, [event?.description, fieldName, setValue]);
};
