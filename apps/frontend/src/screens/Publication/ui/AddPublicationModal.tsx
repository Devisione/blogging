import {
  Card,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  CONTENT_TYPE_ICONS,
  CONTENT_TYPE_LABELS,
  PLATFORM_CAPABILITIES,
  PLATFORM_ICONS,
} from "@entities/Channel/config/constants";
import { ContentType } from "@entities/Channel/model/types";
import type { Platform } from "@entities/Channel/model/types";

export const AddPublicationModal = ({
  opened,
  onClose,
  onAdd,
}: {
  opened: boolean;
  onClose: () => void;
  onAdd: (contentType: ContentType) => void;
}) => {
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      size="lg"
      title="Выберите тип контента"
    >
      <Grid>
        {Object.values(ContentType).map((type) => (
          <Grid.Col key={type} span={4}>
            <ContentTypeCard
              onSelect={(selectedType) => {
                onAdd(selectedType);
                onClose();
              }}
              type={type}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Modal>
  );
};

const ContentTypeCard = ({
  type,
  onSelect,
}: {
  type: ContentType;
  onSelect: (type: ContentType) => void;
}) => {
  const Icon = CONTENT_TYPE_ICONS[type];

  // Подсчитываем, в скольких платформах доступен этот тип контента
  const availablePlatforms = Object.entries(PLATFORM_CAPABILITIES)
    .filter(([_, types]) => types.has(type))
    .map(([platform]) => platform as Platform);

  return (
    <UnstyledButton
      onClick={() => {
        onSelect(type);
      }}
      style={{ width: "100%" }}
    >
      <Card padding="lg" radius="md" shadow="sm" withBorder>
        <Stack align="center" gap="xs">
          <Icon size={32} />
          <Text size="lg">{CONTENT_TYPE_LABELS[type]}</Text>
          <Group gap={4}>
            {availablePlatforms.map((platform) => {
              const PlatformIcon = PLATFORM_ICONS[platform];
              return <PlatformIcon key={platform} size={16} />;
            })}
          </Group>
        </Stack>
      </Card>
    </UnstyledButton>
  );
};
