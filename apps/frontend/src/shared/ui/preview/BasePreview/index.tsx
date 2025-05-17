import { Box, Paper, Text } from '@mantine/core';

interface BasePreviewProps {
  title?: string;
  children: React.ReactNode;
}

export function BasePreview({ title, children }: BasePreviewProps) {
  return (
    <Box>
      {title && <Text size="sm" mb="xs" fw={500}>{title}</Text>}
      <Paper shadow="sm" p="md" withBorder>
        {children}
      </Paper>
    </Box>
  );
} 