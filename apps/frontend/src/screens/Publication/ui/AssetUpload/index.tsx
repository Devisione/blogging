import { Box, FileInput, Group, Text } from "@mantine/core";

interface AssetUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
}

export const AssetUpload = ({
  label,
  accept,
  multiple = false,
}: AssetUploadProps) => {
  return (
    <Box>
      <Group gap="xs" mb="xs">
        <Text size="sm">{label}</Text>
      </Group>

      <FileInput
        accept={accept}
        multiple={multiple}
        // onChange={(files) => {}}
        placeholder="Upload file"
      />
    </Box>
  );
};
