import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { DatePicker } from "@shared/ui/forms/DatePicker";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface YoutubeShortsFormData {
  publishDate: Date;
  video: File | string;
  description: string;
}

export const YoutubeShortsForm = () => {
  const { control, watch } = useForm<YoutubeShortsFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: "",
      description: "",
    },
  });

  const formData = watch();

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
          label="Описание"
          name="description"
          toolbar={false}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
};
