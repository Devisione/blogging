import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { ActionIcon, Flex, Grid } from "@mantine/core";
import { IconPrompt } from "@tabler/icons-react";
import { RichTextEditor } from "@shared/ui/forms/RichTextEditor";
import { FieldPathContext } from "../../../model/store/content";
import { useDisabled } from "../../../model/store/useDisabled";
import { useGenerateDescription } from "../../../model/store/useGenerateDescription";
import { AssetUpload } from "../../AssetUpload";
import { Preview } from "./Preview";
import type { PublicationFormValues } from "../../../model/types";

export const YoutubePostForm = () => {
  const { control } = useFormContext<PublicationFormValues>();
  const { index } = useContext(FieldPathContext);

  const disabled = useDisabled();

  const generateDescription = useGenerateDescription(
    `publications.${index}.content`,
  );

  return (
    <Grid w="1040px">
      <Grid.Col span={6}>
        <AssetUpload
          accept="image/*"
          disabled={disabled}
          groupName={`publications.${index}`}
          label="Обложка"
          name={`publications.${index}.preview_url`}
        />
        <Flex align="center">
          <RichTextEditor
            control={control}
            disabled={disabled}
            label="Описание"
            name={`publications.${index}.content`}
            toolbar={false}
          />
          <ActionIcon
            ml={12}
            mr={12}
            mt={6}
            radius="xl"
            variant="light"
            disabled={disabled}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- пофиг
            onClick={generateDescription}
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
