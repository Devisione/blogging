import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { PublicationGroupApi } from "@entities/PublicationGroup/api";
import type { PublicationFormValues } from "../types";

export const useSubmit = () => {
  const { getValues, trigger } = useFormContext<PublicationFormValues>();
  const { query, reload } = useRouter();

  const update = useCallback(
    async (values: PublicationFormValues) => {
      const result = await PublicationGroupApi.updatePublicationGroupById({
        groupId: query.publicationId as string,
        name: values.name,
        publications: values.publications.map(
          ({ title, type, content, preview, video, channels }) => ({
            title,
            type,
            content,
            preview,
            video,
            channels,
          }),
        ),
      });

      return result;
    },
    [query.publicationId],
  );

  const submit = useCallback(async () => {
    await trigger();
    const values = getValues();
    await update(values);

    reload();
    console.log("update", values);
  }, [getValues, reload, trigger, update]);

  const schedule = useCallback(async () => {
    await trigger();

    const values = getValues();

    const groupId = query.publicationId as string;
    await update(values);
    reload();

    await PublicationGroupApi.publishGroup({ groupId });
  }, [getValues, query.publicationId, reload, trigger, update]);

  const deSchedule = useCallback(async () => {
    await PublicationGroupApi.depublishGroup({
      groupId: query.publicationId as string,
    });
  }, [query.publicationId]);

  return { submit, schedule, deSchedule };
};
