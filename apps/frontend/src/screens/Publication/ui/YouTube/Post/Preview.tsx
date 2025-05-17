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

export const Preview = ({ data }: PreviewProps) => {
  const imageUrl = data.coverImage instanceof File 
    ? URL.createObjectURL(data.coverImage)
    : data.coverImage;

  return (
    <BasePreview title="Предпросмотр YouTube Post">
      <Stack>
        {imageUrl ? <Image
            alt={data.title}
            fit="cover"
            h={200}
            radius="md"
            src={imageUrl}
          /> : null}
        <Text fw={500} size="lg" style={{wordWrap: "break-word"}}>
          {data.title}
        </Text>
        <Text size="sm" style={{wordWrap: "break-word"}}>
          {data.content}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 