import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ActionIcon, Box, FileInput, Flex, Group, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { AttachmentApi } from "@entities/Attachment/api";

interface AssetUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  name: string;
  groupName: string;
}

export const AssetUpload = ({
  label,
  accept,
  multiple = false,
  name,
  groupName,
}: AssetUploadProps) => {
  const { control, setValue } = useFormContext();
  const publicationId = useWatch({ name: groupName, control });
  const value = useWatch({ name, control }) as string;

  const onUpload = async (file: File) => {
    const { url } = await AttachmentApi.uploadAttachment({
      file,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- g
      publicationId: publicationId.id,
      multiple,
    });

    return url;
  };

  const onDelete = () => {
    void (async () => {
      await AttachmentApi.deleteAttachment({ fileUrl: value });

      setValue(name, void 0);
    })();
  };

  return (
    <>
      <Group gap="xs" mb="xs">
        <Text size="sm">{label}</Text>
      </Group>
      <Flex>
        <Box flex={1}>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <FileInput
                accept={accept}
                multiple={multiple}
                onChange={(files) => {
                  void (async () => {
                    if (files) {
                      const url = await onUpload(
                        Array.isArray(files) ? files[0] : files,
                      );

                      field.onChange(url);
                    }
                  })();
                }}
                placeholder="Upload file"
                style={{ width: "100%" }}
              />
            )}
          />
        </Box>
        {value ? (
          <Flex align="center">
            <ActionIcon
              ml={12}
              mr={12}
              mt={6}
              onClick={onDelete}
              radius="xl"
              variant="subtle"
            >
              <IconTrash />
            </ActionIcon>
          </Flex>
        ) : null}
      </Flex>
    </>
  );
};
