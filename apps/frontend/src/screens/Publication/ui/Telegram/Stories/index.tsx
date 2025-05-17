import { Controller, useForm } from "react-hook-form";
import { Grid, SegmentedControl } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { DatePicker } from "@shared/ui/forms/DatePicker";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { Preview } from "./Preview";

interface TelegramStoriesFormData {
  publishDate: Date;
  media: File | string;
  caption: string;
  isVideo: boolean;
}

export const TelegramStoriesForm = () => {
  const { control, watch } = useForm<TelegramStoriesFormData>({
    defaultValues: {
      publishDate: new Date(),
      media: "",
      caption: "",
      isVideo: false,
    },
  });

  const formData = watch();
  const isVideo = watch("isVideo");

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <DatePicker
          control={control}
          label="Дата публикации"
          name="publishDate"
        />
        <Controller
          control={control}
          name="isVideo"
          render={({ field }) => (
            <SegmentedControl
              {...field}
              data={[
                { label: "Изображение", value: "false" },
                { label: "Видео", value: "true" },
              ]}
              mb="sm"
              onChange={(value) => {
                field.onChange(value === "true");
              }}
              value={field.value.toString()}
            />
          )}
        />
        <AssetUpload
          accept={isVideo ? "video/*" : "image/*"}
          control={control}
          label={isVideo ? "Видео" : "Изображение"}
          name="media"
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
