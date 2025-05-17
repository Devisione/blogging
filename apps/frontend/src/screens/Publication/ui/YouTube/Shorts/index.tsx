import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface YoutubeShortsFormData {
  publishDate: Date;
  video: File | string;
  description: string;
}

export default function YoutubeShortsForm() {
  const { control, watch } = useForm<YoutubeShortsFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: '',
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
          name="description"
          toolbar={false}
          label="Описание"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
}
