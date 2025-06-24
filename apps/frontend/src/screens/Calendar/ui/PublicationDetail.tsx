import React, { useCallback } from "react";
import { Form, useForm } from "react-hook-form";
import { Modal } from "@mantine/core";
import Button from "@ui/Button";
import { useUnit } from "effector-react";
import { EventApi } from "@entities/Event/api";
import { $events } from "@entities/Event/model/store";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import type { Event } from "@entities/Event/model/types";

interface PublicationModalProps {
  setModalOpen: (data: Event | null) => void;
  event: Event;
}

const PublicationDetail = ({ setModalOpen, event }: PublicationModalProps) => {
  const repeatRequest = useUnit($events.start);
  const form = useForm({ defaultValues: { description: event.description } });

  const onSubmit = useCallback(() => {
    const values = form.getValues();

    void EventApi.updateEvent({
      id: event.id,
      description: values.description,
    }).then(() => {
      repeatRequest();
      setModalOpen(null);
    });
  }, []);

  return (
    <Form control={form.control}>
      <Modal
        onClose={() => {
          setModalOpen(null);
        }}
        opened
        size={800}
        title="Публикация"
      >
        <RichTextEditor
          control={form.control}
          label="Сценарий"
          name="description"
        />

        <Button onClick={onSubmit}>Сохранить</Button>
      </Modal>
    </Form>
  );
};

export default PublicationDetail;
