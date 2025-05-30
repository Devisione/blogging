import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import createPublicationGroup from "@entities/PublicationGroup/api/createPublicationGroup";
import updatePublicationGroupById from "@entities/PublicationGroup/api/updatePublicationGroupById";
import type { PublicationFormValues } from "../types";

export const useSubmit = () => {
  const { getValues, trigger } = useFormContext<PublicationFormValues>();
  const { query, push } = useRouter();

  const submit = useCallback(async () => {
    await trigger();
    const values = getValues();
    if (query.publicationId) {
      await updatePublicationGroupById({
        groupId: query.publicationId as string,
        name: values.name,
        publications: values.publications,
      });

      console.log("update", values);

      await push("/");
    } else {
      await createPublicationGroup({
        name: values.name,
        publications: values.publications,
      });

      console.log("create", values);

      await push("/");
    }
  }, [getValues, push, query.publicationId, trigger]);

  const schedule = useCallback(async () => {
    await trigger();

    console.log(getValues());
  }, [getValues, trigger]);

  const publish = useCallback(async () => {
    await trigger();

    console.log(getValues());
  }, [getValues, trigger]);

  return { submit, schedule, publish };
};
