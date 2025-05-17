import { Card, Stack, Text } from '@mantine/core';

interface PreviewProps {
  title: string;
  publishDate: Date;
  children: React.ReactNode;
}

export function Preview({ title, publishDate, children }: PreviewProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Text size="lg" fw={500}>
          {title}
        </Text>
        {children}
        <Text size="xs" c="dimmed">
          Дата публикации: {publishDate.toLocaleDateString('ru-RU')}
        </Text>
      </Stack>
    </Card>
  );
} 