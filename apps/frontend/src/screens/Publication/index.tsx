import React from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";
import { useUnit } from "effector-react";
import { $event } from "@entities/Event/model/store/event";
import { $publicationGroup } from "@entities/PublicationGroup/model/store/publicationGroups";
import type { PublicationFormValues } from "./model/types";

const EditableTabs = dynamic(() => import("@screens/Publication/ui"), {
  ssr: false,
});

const PublicationPage = () => {
  const event = useUnit($event);
  const publicationsGroup = useUnit($publicationGroup);

  if (event.pending || publicationsGroup.pending) {
    return <div>loading</div>;
  }

  return (
    <div>
      <FormWrapper>
        <EditableTabs />
      </FormWrapper>
    </div>
  );
};

const FormWrapper = ({ children }: PropsWithChildren) => {
  const { data } = useUnit($event);
  const { data: publicationsGroup } = useUnit($publicationGroup);

  const form = useForm<PublicationFormValues>({
    defaultValues: {
      name: publicationsGroup?.name,
      publishDate: data?.date || new Date(),
      publications: publicationsGroup?.publications.map((publication) => ({
        id: publication.id,
        type: publication.type,
        title: publication.title,
        content: publication.content,
        channels: publication.channels,
      })),
    },
  });

  return (
    <FormProvider {...form}>
      <Form control={form.control}>{children}</Form>
    </FormProvider>
  );
};

export default PublicationPage;
