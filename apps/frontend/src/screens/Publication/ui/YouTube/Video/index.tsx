import { useForm } from "react-hook-form";
import { AspectRatio, Grid, Stack, Text } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { DatePicker } from "@shared/ui/forms/DatePicker";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "../../Preview";

interface YoutubeVideoFormData {
  publishDate: Date;
  video: File | string;
  title: string;
  description: string;
}

export const YoutubeVideoForm = () => {
  const { control, watch } = useForm<YoutubeVideoFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: "",
      title: "",
      description: "",
    },
  });

  const formData = watch();
  const videoUrl =
    formData.video instanceof File
      ? URL.createObjectURL(formData.video)
      : formData.video;

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <DatePicker
          control={control}
          label="Дата публикации"
          name="publishDate"
        />
        <AssetUpload
          accept="video/*"
          control={control}
          label="Видео"
          name="video"
        />
        <RichTextEditor
          control={control}
          label="Заголовок"
          name="title"
          toolbar={false}
        />
        <RichTextEditor
          control={control}
          label="Описание"
          name="description"
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview
          publishDate={formData.publishDate}
          title="Предпросмотр YouTube Video"
        >
          <Stack>
            <AspectRatio maw={560} ratio={16 / 9}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок */}
              <video
                controls
                src={videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  backgroundColor: "black",
                }}
              />
            </AspectRatio>
            <Text fw={500} size="lg" style={{ wordWrap: "break-word" }}>
              {formData.title}
            </Text>
            <Text size="sm" style={{ wordWrap: "break-word" }}>
              {formData.description}
            </Text>
          </Stack>
        </Preview>
      </Grid.Col>
    </Grid>
  );
};
