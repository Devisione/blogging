import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { PublicationGroupApi } from "@entities/PublicationGroup/api";
import type { PublicationFormValues } from "../types";

export const useSubmit = () => {
  const { getValues, trigger } = useFormContext<PublicationFormValues>();
  const { query, push } = useRouter();

  const create = useCallback(async (values: PublicationFormValues) => {
    const result = await PublicationGroupApi.createPublicationGroup({
      name: values.name,
      publications: values.publications,
    });

    return result;
  }, []);

  const update = useCallback(
    async (values: PublicationFormValues) => {
      const result = await PublicationGroupApi.updatePublicationGroupById({
        groupId: query.publicationId as string,
        name: values.name,
        publications: values.publications,
      });

      return result;
    },
    [query.publicationId],
  );

  const submit = useCallback(async () => {
    await trigger();
    const values = getValues();
    if (query.publicationId) {
      await update(values);

      console.log("update", values);

      await push("/");
    } else {
      await create(values);

      console.log("create", values);
    }
    await push("/");
  }, [create, getValues, push, query.publicationId, trigger, update]);

  const schedule = useCallback(async () => {
    await trigger();

    const values = getValues();

    let groupId = query.publicationId as string;

    if (!query.publicationId) {
      const group = await create(values);

      groupId = group.id;
    } else {
      await update(values);
    }

    await PublicationGroupApi.publishGroup({ groupId });

    await push("/");
  }, [create, getValues, push, query.publicationId, trigger, update]);

  const deSchedule = useCallback(async () => {
    await PublicationGroupApi.depublishGroup({
      groupId: query.publicationId as string,
    });

    await push("/");
  }, [push, query.publicationId]);

  return { submit, schedule, deSchedule };
};
