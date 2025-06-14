import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mantine/core";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubePostForm = () => {
  const { control } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload accept="image/*" label="Обложка" />
        <RichTextEditor
          control={control}
          label="Название"
          name={`publications.${index}.title`}
          toolbar={false}
        />
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
