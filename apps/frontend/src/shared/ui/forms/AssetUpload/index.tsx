import { useRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Box, FileInput, Group, Text } from '@mantine/core';

interface AssetUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  accept?: string;
  multiple?: boolean;
}

export function AssetUpload<T extends FieldValues>({ 
  control, 
  name, 
  label, 
  accept,
  multiple = false 
}: AssetUploadProps<T>) {
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
            ref={fileInputRef}
            placeholder="Upload file"
            value={multiple ? (value || []) : (value && typeof value === 'object' && 'type' in value ? value : null)}
            onChange={(files) => onChange(files)}
            error={error?.message}
            accept={accept}
            multiple={multiple}
          />
        </Box>
      )}
    />
  );
} 