import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface YoutubeStoriesFormData {
  publishDate: Date;
  video: File | string;
  thumbnail: File | string;
  caption: string;
}

export default function YoutubeStoriesForm() {
  const { control, watch } = useForm<YoutubeStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: '',
      thumbnail: '',
      caption: '',
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
          name="video"
          label="Видео"
          accept="video/*"
        />
        <AssetUpload
          control={control}
          name="thumbnail"
          label="Обложка"
          accept="image/*"
        />
        <RichTextEditor
          control={control}
          name="caption"
          toolbar={false}
          label="Подпись"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
} 