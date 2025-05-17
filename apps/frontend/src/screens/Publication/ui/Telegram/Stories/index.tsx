import { Grid, SegmentedControl } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface TelegramStoriesFormData {
  publishDate: Date;
  media: File | string;
  caption: string;
  isVideo: boolean;
}

export default function TelegramStoriesForm() {
  const { control, watch } = useForm<TelegramStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      media: '',
      caption: '',
      isVideo: false,
    },
  });

  const formData = watch();
  const isVideo = watch('isVideo');

  return (
    <Grid w={"1040px"}>
      <Grid.Col span={6}>
        <DatePicker
          control={control}
          name="publishDate"
          label="Дата публикации"
        />
        <Controller
          name="isVideo"
          control={control}
          render={({ field }) => (
            <SegmentedControl
              {...field}
              value={field.value.toString()}
              onChange={(value) => field.onChange(value === 'true')}
              data={[
                { label: 'Изображение', value: 'false' },
                { label: 'Видео', value: 'true' },
              ]}
              mb="sm"
            />
          )}
        />
        <AssetUpload
          control={control}
          name="media"
          label={isVideo ? "Видео" : "Изображение"}
          accept={isVideo ? "video/*" : "image/*"}
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