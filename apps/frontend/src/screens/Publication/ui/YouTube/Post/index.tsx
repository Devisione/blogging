import { Grid } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from './Preview';

interface YoutubePostFormData {
  publishDate: Date;
  coverImage: File | string;
  title: string;
  content: string;
}

export default function YoutubePostForm() {
  const { control, watch } = useForm<YoutubePostFormData>({
    defaultValues: {
      publishDate: new Date(),
      coverImage: '',
      title: '',
      content: '',
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
          name="coverImage"
          label="Обложка"
          accept="image/*"
        />
        <RichTextEditor
          control={control}
          name="title"
          toolbar={false}
          label="Заголовок"
        />
        <RichTextEditor
          control={control}
          name="content"
          toolbar={true}
          label="Контент"
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
} 