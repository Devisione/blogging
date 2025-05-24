import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface VKPostFormData {
  publishDate: Date;
  images: (File | string)[];
  text: string;
}

export const VKPostForm = () => {
  const { control, watch } = useForm<VKPostFormData>({
    defaultValues: {
      publishDate: new Date(),
      images: [],
      text: "",
    },
  });

  const formData = watch();

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="image/*"
          control={control}
          label="Изображения"
          multiple
          name="images"
        />
        <RichTextEditor
          control={control}
          label="Текст поста"
          name="text"
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
};
