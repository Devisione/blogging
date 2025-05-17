import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface TelegramPostFormData {
  publishDate: Date;
  images: (File | string)[];
  text: string;
}

export default function TelegramPostForm() {
  const { control, watch } = useForm<TelegramPostFormData>({
    defaultValues: {
      publishDate: new Date(),
      images: [],
      text: '',
    },
  });

  const formData = watch();

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
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
} 