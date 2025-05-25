import { AspectRatio, Box, Stack, Text } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    image: File | string;
    caption: string;
  };
}

export const Preview = ({ data }: PreviewProps) => {
  const imageUrl = data.image instanceof File 
    ? URL.createObjectURL(data.image)
    : data.image;

  return (
    <BasePreview title="Предпросмотр VK Stories">
      <Stack>
        <AspectRatio maw={315} ratio={9/16}>
          <Box
            alt="Story preview"
            component="img"
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </AspectRatio>
        <Text fw={500} size="sm">
          {data.caption}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 