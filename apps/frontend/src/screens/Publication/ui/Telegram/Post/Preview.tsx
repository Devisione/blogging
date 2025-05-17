import { Image, SimpleGrid, Stack, Text } from "@mantine/core";
import { BasePreview } from "@shared/ui/preview/BasePreview";

interface PreviewProps {
  data: {
    publishDate: Date;
    images: (File | string)[];
    text: string;
  };
}

export const Preview = ({ data }: PreviewProps) => {
  const imageUrls = data.images.map((image) =>
    image instanceof File ? URL.createObjectURL(image) : image,
  );

  return (
    <BasePreview title="Предпросмотр Telegram Post">
      <Stack>
        {imageUrls.length > 0 && (
          <SimpleGrid cols={Math.min(imageUrls.length, 2)} spacing="xs">
            {imageUrls.map((url) => (
              <Image fit="cover" h={200} key={url} radius="md" src={url} />
            ))}
          </SimpleGrid>
        )}
        <Text
          size="sm"
          style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
        >
          {data.text}
        </Text>
        <Text c="dimmed" size="xs">
          Дата публикации: {data.publishDate.toLocaleDateString("ru-RU")}
        </Text>
      </Stack>
    </BasePreview>
  );
};
