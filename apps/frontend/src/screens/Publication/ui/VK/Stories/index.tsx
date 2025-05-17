import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface VKStoriesFormData {
  publishDate: Date;
  image: File | string;
  caption: string;
}

export default function VKStoriesForm() {
  const { control, watch } = useForm<VKStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      image: '',
      caption: '',
    },
  });

  const formData = watch();

  return (
    <Grid>
      <Grid.Col span={6}>
        <DatePicker
          control={control}
          name="publishDate"
          label="Дата публикации"
        />
        <AssetUpload
          control={control}
          name="image"
          label="Изображение"
          accept="image/*"
        />
        <RichTextEditor
          control={control}
          toolbar
          name="caption"
          label="Подпись"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
} 