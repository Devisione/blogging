import { Card, Stack, Text } from '@mantine/core';

interface PreviewProps {
  title: string;
  publishDate: Date;
  children: React.ReactNode;
}

export const Preview = ({ title, publishDate, children }: PreviewProps) => {
  return (
    <Card padding="lg" radius="md" shadow="sm" withBorder>
      <Stack>
        <Text fw={500} size="lg">
          {title}
        </Text>
        {children}
        <Text c="dimmed" size="xs">
          Дата публикации: {publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </Card>
  );
} 