import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mantine/core";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubeVideoForm = () => {
  const { control } = useFormContext<PublicationFormValues>();

  const { index } = useContext(FieldPathContext);

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="video/*"
          groupName={`publications.${index}`}
          label="Видео"
          name={`publications.${index}.preview_url`}
        />
        <RichTextEditor
          control={control}
          label="Описание"
          name={`publications.${index}.content`}
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview />
      </Grid.Col>
    </Grid>
  );
};
