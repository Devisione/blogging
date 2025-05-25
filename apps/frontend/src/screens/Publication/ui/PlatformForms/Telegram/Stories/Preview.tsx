import { AspectRatio, Image, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";

interface PreviewProps {
  data: {
    publishDate: Date;
    media: File | string;
    caption: string;
    isVideo: boolean;
  };
}

export const Preview = ({ data }: PreviewProps) => {
  const mediaUrl =
    data.media instanceof File ? URL.createObjectURL(data.media) : data.media;

  return (
    <BasePreview title="Предпросмотр Telegram Stories">
      <Stack>
        <AspectRatio maw={315} ratio={9 / 16}>
          {data.isVideo ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок
            <video
              controls
              src={mediaUrl}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                overflow: "auto",
                backgroundColor: "black",
              }}
            />
          ) : (
            <Image
              alt={data.caption}
              src={mediaUrl}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                overflow: "auto",
                objectFit: "cover",
              }}
            />
          )}
        </AspectRatio>
        <Text size="sm" style={{ wordWrap: "break-word" }}>
          {data.caption}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {data.publishDate.toLocaleDateString("ru-RU")}
        </Text>
      </Stack>
    </BasePreview>
  );
};
