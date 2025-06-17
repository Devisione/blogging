import { useContext } from "react";
import { useWatch } from "react-hook-form";
import { Image, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";
import { FieldPathContext } from "../../../model/store/content";
import type { PublicationFormValues } from "../../../model/types";

export const Preview = () => {
  const { index } = useContext(FieldPathContext);

  const values = useWatch<PublicationFormValues>();

  // eslint-disable-next-line -- всё ок
  const publishDate = values.publishDate!;
  // eslint-disable-next-line -- всё ок
  const formData = values.publications?.[index]!;

  const imageUrl = formData.preview_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.preview_url}`
    : void 0;

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
