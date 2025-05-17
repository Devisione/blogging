import { AspectRatio, Box, Stack, Text } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    image: File | string;
    caption: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const imageUrl = data.image instanceof File 
    ? URL.createObjectURL(data.image)
    : data.image;

  return (
    <BasePreview title="Предпросмотр VK Stories">
      <Stack>
        <AspectRatio ratio={9/16} maw={315}>
          <Box
            component="img"
            src={imageUrl}
            alt="Story preview"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </AspectRatio>
        <Text size="sm" fw={500}>
          {data.caption}
        </Text>
        <Text size="xs" c="dimmed">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 