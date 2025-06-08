import { useCallback } from "react";
import { useUnit } from "effector-react";
import { onCreateEvent } from "@entities/Event/model/store";
import { createPublicationGroupMutation } from "@entities/PublicationGroup/model/store/publicationGroups";

export const useCreatePublication = () => {
  const createEvent = useUnit(onCreateEvent);
  const createPublication = useUnit(createPublicationGroupMutation.start);

  return useCallback(
    (values: { name: string; date?: Date; eventId?: string }) => {
      void (async () => {
        let eventId = values.eventId;
        if (!eventId && values.date) {
          const result = await createEvent({
            title: values.name,
            date: values.date,
            description: "",
            duration: 30,
            recurrenceType: "none",
          });

          eventId = result.event.id;
        }

        createPublication({
          name: values.name,
          publications: [],
          eventId,
        });
      })();
    },
    [createEvent, createPublication],
  );
};
