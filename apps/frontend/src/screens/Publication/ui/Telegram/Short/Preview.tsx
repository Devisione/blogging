import { AspectRatio, Stack, Text } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    video: File | string;
    caption: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const videoUrl = data.video instanceof File 
    ? URL.createObjectURL(data.video)
    : data.video;

  return (
    <BasePreview title="Предпросмотр Telegram Short">
      <Stack>
        <AspectRatio ratio={9/16} maw={315}>
          <video
            src={videoUrl}
            controls
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              backgroundColor: 'black',
            }}
          />
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