import { Grid, AspectRatio, Stack, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@shared/ui/forms/DatePicker';
import { AssetUpload } from '@shared/ui/forms/AssetUpload';
import { RichTextEditor } from '@shared/ui/forms/RichTextEditor';
import { Preview } from '../../Preview';

interface YoutubeVideoFormData {
  publishDate: Date;
  video: File | string;
  title: string;
  description: string;
}

export default function YoutubeVideoForm() {
  const { control, watch } = useForm<YoutubeVideoFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: '',
      title: '',
      description: '',
    },
  });

  const formData = watch();
  const videoUrl = formData.video instanceof File 
    ? URL.createObjectURL(formData.video)
    : formData.video;

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
        <Preview title="Предпросмотр YouTube Video" publishDate={formData.publishDate}>
          <Stack>
            <AspectRatio ratio={16/9} maw={560}>
              <video
                src={videoUrl}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  backgroundColor: 'black',
                }}
              />
            </AspectRatio>
            <Text size="lg" fw={500} style={{wordWrap: "break-word"}}>
              {formData.title}
            </Text>
            <Text size="sm" style={{wordWrap: "break-word"}}>
              {formData.description}
            </Text>
          </Stack>
        </Preview>
      </Grid.Col>
    </Grid>
  );
} 