import React from "react";
import { Form, useForm } from "react-hook-form";
import type { SlotInfo } from "react-big-calendar";
import { Button, Modal } from "@mantine/core";
import { DateTimePicker } from "@shared/ui/forms/DateTimePicker";
import { Input } from "@shared/ui/forms/Input";
import { useCreatePublication } from "../model/hooks/useCreatePublication";

interface PublicationModalProps {
  setModalOpen: (data: SlotInfo | null) => void;
  slotInfo?: SlotInfo;
}

const PublicationCreateModal = ({
  setModalOpen,
  slotInfo,
}: PublicationModalProps) => {
  const form = useForm({ defaultValues: { name: "", date: slotInfo?.start } });

  const createPublication = useCreatePublication();

  const onCreate = () => {
    const values = form.getValues();
    if (!values.date) {
      form.setError("date", { message: "required" });
      return;
    }

    createPublication({ name: values.name, date: values.date });
  };

  return (
    <Form control={form.control}>
      <Modal
        onClose={() => {
          setModalOpen(null);
        }}
        opened
        title="Создать публикацию"
      >
        <Input control={form.control} label="Название события" name="name" />
        <DateTimePicker
          control={form.control}
          label="Дата события"
          name="date"
        />

        <Button fullWidth onClick={onCreate} style={{ marginTop: "20px" }}>
          Создать
        </Button>
      </Modal>
    </Form>
  );
};

export default PublicationCreateModal;
