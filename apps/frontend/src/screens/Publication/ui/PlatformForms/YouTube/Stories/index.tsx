import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface YoutubeStoriesFormData {
  publishDate: Date;
  video: File | string;
  thumbnail: File | string;
  caption: string;
}

export const YoutubeStoriesForm = () => {
  const { control, watch } = useForm<YoutubeStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: "",
      thumbnail: "",
      caption: "",
    },
  });

  const formData = watch();

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="video/*"
          control={control}
          label="Видео"
          name="video"
        />
        <AssetUpload
          accept="image/*"
          control={control}
          label="Обложка"
          name="thumbnail"
        />
        <RichTextEditor
          control={control}
          label="Подпись"
          name="caption"
          toolbar={false}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
};
