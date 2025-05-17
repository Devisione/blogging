import { AspectRatio, Stack, Text, Image } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    media: File | string;
    caption: string;
    isVideo: boolean;
  };
}

export function Preview({ data }: PreviewProps) {
  const mediaUrl = data.media instanceof File 
    ? URL.createObjectURL(data.media)
    : data.media;

  return (
    <BasePreview title="Предпросмотр Telegram Stories">
      <Stack>
        <AspectRatio ratio={9/16} maw={315}>
          {data.isVideo ? (
            <video
              src={mediaUrl}
              controls
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                backgroundColor: 'black',
              }}
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={data.caption}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          )}
        </AspectRatio>
        <Text size="sm" style={{wordWrap: "break-word"}}>
          {data.caption}
        </Text>
        <Text size="xs" c="dimmed">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 