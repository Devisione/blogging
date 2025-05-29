import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { AspectRatio, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";
import { FieldPathContext } from "../../../model/store/content";
import type { PublicationFormValues } from "../../../model/types";

export const Preview = () => {
  const { getValues } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const publishDate = getValues(`publishDate`);
  const formData = getValues(`publications.${index}`);

  const videoUrl =
    formData.video instanceof File
      ? URL.createObjectURL(formData.video)
      : formData.video;

  const thumbnailUrl =
    formData.preview instanceof File
      ? URL.createObjectURL(formData.preview)
      : formData.preview;

  return (
    <BasePreview title="Предпросмотр YouTube Stories">
      <Stack>
        <AspectRatio maw={315} ratio={9 / 16}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок */}
          <video
            controls
            poster={thumbnailUrl}
            src={videoUrl}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              overflow: "auto",
              backgroundColor: "black",
            }}
          />
        </AspectRatio>
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
