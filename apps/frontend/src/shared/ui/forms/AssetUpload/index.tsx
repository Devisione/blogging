import { useRef } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Box, FileInput, Group, Text } from "@mantine/core";

interface AssetUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  multiple?: boolean;
}

export const AssetUpload = <T extends FieldValues>({
  control,
  name,
  label,
  accept,
  multiple = false,
}: AssetUploadProps<T>) => {
  const fileInputRef = useRef<HTMLButtonElement>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <Group gap="xs" mb="xs">
            <Text size="sm">{label}</Text>
          </Group>

          <FileInput
            accept={accept}
            error={error?.message}
            multiple={multiple}
            onChange={(files) => {
              onChange(files);
            }}
            placeholder="Upload file"
            ref={fileInputRef}
            value={
              // eslint-disable-next-line no-nested-ternary -- не хочу выносить
              multiple
                ? value || []
                : value && typeof value === "object" && "type" in value
                  ? value
                  : null
            }
          />
        </Box>
      )}
    />
  );
};
