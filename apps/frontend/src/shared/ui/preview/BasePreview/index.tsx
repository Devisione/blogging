import { Box, Paper, Text } from '@mantine/core';

interface BasePreviewProps {
  title?: string;
  children: React.ReactNode;
}

export const BasePreview = ({ title, children }: BasePreviewProps) => {
  return (
    <Box>
      {title ? <Text fw={500} mb="xs" size="sm">{title}</Text> : null}
      <Paper p="md" shadow="sm" withBorder>
        {children}
      </Paper>
    </Box>
  );
} 