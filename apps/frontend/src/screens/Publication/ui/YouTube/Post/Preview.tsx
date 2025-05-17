import { Stack, Text, Image } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    coverImage: File | string;
    title: string;
    content: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const imageUrl = data.coverImage instanceof File 
    ? URL.createObjectURL(data.coverImage)
    : data.coverImage;

  return (
    <BasePreview title="Предпросмотр YouTube Post">
      <Stack>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={data.title}
            radius="md"
            fit="cover"
            h={200}
          />
        )}
        <Text size="lg" fw={500} style={{wordWrap: "break-word"}}>
          {data.title}
        </Text>
        <Text size="sm" style={{wordWrap: "break-word"}}>
          {data.content}
        </Text>
        <Text size="xs" c="dimmed">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 