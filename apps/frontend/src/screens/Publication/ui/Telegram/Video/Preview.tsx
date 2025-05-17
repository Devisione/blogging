import { AspectRatio, Stack, Text } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    video: File | string;
    title: string;
    description: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const videoUrl = data.video instanceof File 
    ? URL.createObjectURL(data.video)
    : data.video;

  return (
    <BasePreview title="Предпросмотр Telegram Video">
      <Stack>
        <AspectRatio ratio={16/9} maw={560}>
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
        <Text size="lg" fw={500} style={{wordWrap: "break-word"}}>
          {data.title}
        </Text>
        <Text size="sm" style={{wordWrap: "break-word"}}>
          {data.description}
        </Text>
        <Text size="xs" c="dimmed">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 