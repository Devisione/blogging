import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Grid } from "@mantine/core";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { useDisabled } from "../../../model/store/useDisabled";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubeShortsForm = () => {
  const { control } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);
  const disabled = useDisabled();

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="video/*"
          disabled={disabled}
          groupName={`publications.${index}`}
          label="Видео"
          name={`publications.${index}.video_url`}
        />
        <RichTextEditor
          control={control}
          disabled={disabled}
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
