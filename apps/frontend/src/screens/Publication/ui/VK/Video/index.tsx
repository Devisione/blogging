import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface VKVideoFormData {
  publishDate: Date;
  video: File | string;
  title: string;
  description: string;
}

export default function VKVideoForm() {
  const { control, watch } = useForm<VKVideoFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: '',
      title: '',
      description: '',
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
        <RichTextEditor
          control={control}
          name="title"
          toolbar={false}
          label="Заголовок"
        />
        <RichTextEditor
          control={control}
          name="description"
          toolbar={true}
          label="Описание"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
} 