import { useForm } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { DatePicker } from "@shared/ui/forms/DatePicker";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface YoutubePostFormData {
  publishDate: Date;
  coverImage: File | string;
  title: string;
  content: string;
}

export const YoutubePostForm = () => {
  const { control, watch } = useForm<YoutubePostFormData>({
    defaultValues: {
      publishDate: new Date(),
      coverImage: "",
      title: "",
      content: "",
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
          label="Обложка"
          name="coverImage"
        />
        <RichTextEditor
          control={control}
          label="Заголовок"
          name="title"
          toolbar={false}
        />
        <RichTextEditor
          control={control}
          label="Контент"
          name="content"
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview data={formData} />
      </Grid.Col>
    </Grid>
  );
};
