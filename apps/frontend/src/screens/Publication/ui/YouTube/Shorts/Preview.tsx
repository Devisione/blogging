import { AspectRatio, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";

interface PreviewProps {
  data: {
    publishDate: Date;
    video: File | string;
    description: string;
  };
}

export const Preview = ({ data }: PreviewProps) => {
  const videoUrl =
    data.video instanceof File ? URL.createObjectURL(data.video) : data.video;

  return (
    <BasePreview title="Предпросмотр YouTube Shorts">
      <Stack>
        <AspectRatio maw={315} ratio={9 / 16}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок */}
          <video
            controls
            src={videoUrl}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              backgroundColor: "black",
            }}
          />
        </AspectRatio>
        <Text fw={500} size="sm" style={{ wordWrap: "break-word" }}>
          {data.description}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {data.publishDate.toLocaleDateString("ru-RU")}
        </Text>
      </Stack>
    </BasePreview>
  );
};
