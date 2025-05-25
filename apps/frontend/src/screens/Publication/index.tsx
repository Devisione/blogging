import React from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";
import { useUnit } from "effector-react";
import { $event } from "@entities/Event/model/store/event";
import type { PublicationFormValues } from "./model/types";

const EditableTabs = dynamic(() => import("@screens/Publication/ui"), {
  ssr: false,
});

const PublicationPage = () => {
  const event = useUnit($event);

  if (event.pending) {
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

  const form = useForm<PublicationFormValues>({
    defaultValues: { publishDate: data?.date || new Date() },
  });

  return (
    <FormProvider {...form}>
      <Form control={form.control}>{children}</Form>
    </FormProvider>
  );
};

export default PublicationPage;
