import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { DatePicker } from "@shared/ui/forms/DatePicker";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface TelegramPostFormData {
  publishDate: Date;
  images: (File | string)[];
  text: string;
}

export const TelegramPostForm = () => {
  const { control, watch } = useForm<TelegramPostFormData>({
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
        <DatePicker
          control={control}
          label="Дата публикации"
          name="publishDate"
        />
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
