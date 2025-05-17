import { Grid, SimpleGrid, Image, Stack, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from '../../Preview';

interface VKPostFormData {
  publishDate: Date;
  images: (File | string)[];
  text: string;
}

export default function VKPostForm() {
  const { control, watch } = useForm<VKPostFormData>({
    defaultValues: {
      publishDate: new Date(),
      images: [],
      text: '',
    },
  });

  const formData = watch();
  const imageUrls = formData.images.map(image => 
    image instanceof File ? URL.createObjectURL(image) : image
  );

  return (
    <Grid w={"1040px"}>
      <Grid.Col span={6}>
        <DatePicker
          control={control}
          name="publishDate"
          label="Дата публикации"
        />
        <AssetUpload
          control={control}
          name="images"
          label="Изображения"
          accept="image/*"
          multiple
        />
        <RichTextEditor
          control={control}
          name="text"
          toolbar={true}
          label="Текст поста"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview title="Предпросмотр VK Post" publishDate={formData.publishDate}>
          <Stack>
            <Text size="sm" style={{wordWrap: "break-word", whiteSpace: 'pre-wrap'}}>
              {formData.text}
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
          </Stack>
        </Preview>
      </Grid.Col>
    </Grid>
  );
} 