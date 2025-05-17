import { Stack, Text, Image, SimpleGrid } from '@mantine/core';
import { BasePreview } from '@shared/ui/preview/BasePreview';

interface PreviewProps {
  data: {
    publishDate: Date;
    images: (File | string)[];
    text: string;
  };
}

export function Preview({ data }: PreviewProps) {
  const imageUrls = data.images.map(image => 
    image instanceof File ? URL.createObjectURL(image) : image
  );

  return (
    <BasePreview title="Предпросмотр VK Post">
      <Stack>
        <Text size="sm" style={{wordWrap: "break-word", whiteSpace: 'pre-wrap'}}>
          {data.text}
        </Text>
        {imageUrls.length > 0 && (
          <SimpleGrid cols={Math.min(imageUrls.length, 3)} spacing="xs">
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                radius="md"
                fit="cover"
                h={200}
              />
            ))}
          </SimpleGrid>
        )}
        <Text size="xs" c="dimmed">
          Дата публикации: {data.publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </BasePreview>
  );
} 