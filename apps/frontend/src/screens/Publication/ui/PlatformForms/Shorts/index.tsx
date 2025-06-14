import { useContext } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Grid } from "@mantine/core";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubeShortsForm = () => {
  const { control } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const { field } = useController({
    control,
    name: `publications.${index}.id`,
  });

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload accept="video/*" id={field.value} label="Видео" />
        <RichTextEditor
          control={control}
          label="Описание"
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
