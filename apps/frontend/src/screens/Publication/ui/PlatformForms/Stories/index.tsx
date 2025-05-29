import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubeStoriesForm = () => {
  const { control, getValues } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const formData = getValues(`publications.${index}`);

  console.log(formData);

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="video/*"
          control={control}
          label="Видео"
          name={`publications.${index}.video`}
        />
        <AssetUpload
          accept="image/*"
          control={control}
          label="Обложка"
          name={`publications.${index}.preview`}
        />
        <RichTextEditor
          control={control}
          label="Подпись"
          name={`publications.${index}.content`}
          toolbar={false}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview />
      </Grid.Col>
    </Grid>
  );
};
