import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { ActionIcon, Flex, Grid } from "@mantine/core";
import { IconPrompt } from "@tabler/icons-react";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { useGenerateDescription } from "../../../model/store/useGenerateDescription";
import { useGenerateTitle } from "../../../model/store/useGenerateTitle";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubePostForm = () => {
  const { control } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const generateDescription = useGenerateDescription(
    `publications.${index}.content`,
  );

  const generateTitle = useGenerateTitle(`publications.${index}.title`);

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
          <ActionIcon
            ml={12}
            mr={12}
            mt={6}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- пофиг
            onClick={generateTitle}
            radius="xl"
            variant="light"
          >
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
          <ActionIcon
            ml={12}
            mr={12}
            mt={6}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- пофиг
            onClick={generateDescription}
            radius="xl"
            variant="light"
          >
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
