import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Box, FileInput, Group, Text } from "@mantine/core";
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
  const { control } = useFormContext();
  const publicationId = useWatch({ name: groupName, control });

  const onUpload = async (file: File) => {
    const { url } = await AttachmentApi.uploadAttachment({
      file,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- g
      publicationId: publicationId.id,
      multiple,
    });

    return url;
  };

  return (
    <Box>
      <Group gap="xs" mb="xs">
        <Text size="sm">{label}</Text>
      </Group>

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
          />
        )}
      />
    </Box>
  );
};
