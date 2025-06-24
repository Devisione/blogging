import { useContext } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AspectRatio, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";
import { FieldPathContext } from "../../../model/store/content";
import type { PublicationFormValues } from "../../../model/types";

export const Preview = () => {
  const { getValues } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);
  useWatch<PublicationFormValues>();

  const publishDate = getValues(`publishDate`);
  const formData = getValues(`publications.${index}`);

  const videoUrl = formData.video_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.video_url}`
    : void 0;

  const imageUrl = formData.preview_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${formData.preview_url}`
    : void 0;

  return (
    <BasePreview title="Предпросмотр Stories">
      <Stack>
        {Boolean(videoUrl) && (
          <AspectRatio maw={315} ratio={9 / 16}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок */}
            <video
              controls
              poster={imageUrl}
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
        )}
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
