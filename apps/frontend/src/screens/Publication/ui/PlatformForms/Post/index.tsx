import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { ActionIcon, Flex, Grid } from "@mantine/core";
import { IconPrompt } from "@tabler/icons-react";
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
        <Flex align="center">
          <RichTextEditor
            control={control}
            label="Название"
            name={`publications.${index}.title`}
            toolbar={false}
          />
          <ActionIcon ml={12} mr={12} mt={6} radius="xl" variant="light">
            <IconPrompt size={32} />
          </ActionIcon>
        </Flex>
        <Flex align="center">
          <RichTextEditor
            control={control}
            label="Описание"
            name={`publications.${index}.content`}
            toolbar={false}
          />
          <ActionIcon ml={12} mr={12} mt={6} radius="xl" variant="light">
            <IconPrompt size={32} />
          </ActionIcon>
        </Flex>
      </Grid.Col>
      <Grid.Col span={6}>
        <Preview />
      </Grid.Col>
    </Grid>
  );
};
