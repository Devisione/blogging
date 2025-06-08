import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { AspectRatio, Grid, Stack, Text } from "@mantine/core";
import { AssetUpload } from "@shared/ui/forms/AssetUpload";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { Preview } from "../../Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubeVideoForm = () => {
  const { control, watch } = useFormContext<PublicationFormValues>();

  const formData = watch();
  const { index } = useContext(FieldPathContext);

  const videoUrl =
    formData.publications[index].video instanceof File
      ? URL.createObjectURL(formData.publications[index].video)
      : formData.publications[index].video;

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="video/*"
          control={control}
          label="Видео"
          name={`publications.${index}.video`}
        />
        <RichTextEditor
          control={control}
          label="Описание"
          name={`publications.${index}.content`}
          toolbar
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview
          publishDate={formData.publishDate}
          title="Предпросмотр YouTube Video"
        >
          <Stack>
            <AspectRatio maw={560} ratio={16 / 9}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- всё ок */}
              <video
                controls
                src={videoUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  overflow: "auto",
                  backgroundColor: "black",
                }}
              />
            </AspectRatio>
            <Text fw={500} size="lg" style={{ wordWrap: "break-word" }}>
              {formData.name}
            </Text>
            <Text size="sm" style={{ wordWrap: "break-word" }}>
              {formData.publications[index].content}
            </Text>
          </Stack>
        </Preview>
      </Grid.Col>
    </Grid>
  );
};
