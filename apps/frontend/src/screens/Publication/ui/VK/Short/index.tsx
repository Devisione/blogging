import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface VKShortFormData {
  publishDate: Date;
  video: File | string;
  caption: string;
}

export const VKShortForm = () => {
  const { control, watch } = useForm<VKShortFormData>({
    defaultValues: {
      publishDate: new Date(),
      video: "",
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
