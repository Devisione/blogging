import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Image, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";
import { FieldPathContext } from "../../../model/store/content";
import type { PublicationFormValues } from "../../../model/types";

export const Preview = () => {
  const { getValues } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const publishDate = getValues(`publishDate`);
  const formData = getValues(`publications.${index}`);

  const imageUrl =
    formData.preview instanceof File
      ? URL.createObjectURL(formData.preview)
      : formData.preview;

  return (
    <BasePreview title="Предпросмотр YouTube Post">
      <Stack>
        {imageUrl ? (
          <Image
            alt={formData.title}
            fit="cover"
            h={200}
            radius="md"
            src={imageUrl}
          />
        ) : null}
        <Text fw={500} size="lg" style={{ wordWrap: "break-word" }}>
          {formData.title}
        </Text>
        <Text size="sm" style={{ wordWrap: "break-word" }}>
          {formData.content}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {publishDate.toLocaleDateString("ru-RU")}
        </Text>
      </Stack>
    </BasePreview>
  );
};
