import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { useUnit } from "effector-react";
import { $event } from "@entities/Event/model/store/event";

export const useGenerateTitle = (fieldName: string) => {
  const { setValue } = useFormContext();
  const event = useUnit($event.$data);

  return useCallback(async () => {
    const { data } = await axios.post<{ title: string }>(
      "http://localhost:4000/generate/title",
      {
        topic: event?.description,
      },
    );

    setValue(fieldName, data.title);
  }, [event?.description, fieldName, setValue]);
};
