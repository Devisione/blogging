import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface VKStoriesFormData {
  publishDate: Date;
  image: File | string;
  caption: string;
}

export const VKStoriesForm = () => {
  const { control, watch } = useForm<VKStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      image: "",
      caption: "",
    },
  });

  const formData = watch();

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="image/*"
          control={control}
          label="Изображение"
          name="image"
        />
        <RichTextEditor
          control={control}
          label="Подпись"
          name="caption"
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
};
