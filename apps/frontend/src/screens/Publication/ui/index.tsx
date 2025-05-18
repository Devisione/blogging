import { useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// eslint-disable-next-line import/no-extraneous-dependencies -- в дев депсах
import { CSS } from "@dnd-kit/utilities";
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
  Avatar,
  rem,
  MantineTheme,
  Badge,
  Box,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrandTelegram,
  IconBrandVk,
  IconBrandYoutube,
  IconPlus,
  IconX,
  IconMessage,
  IconVideo,
  IconPhotoVideo,
} from "@tabler/icons-react";
import classes from "./index.module.css";
import { TelegramPostForm } from "./Telegram/Post";
import { TelegramStoriesForm } from "./Telegram/Stories";
import { VKPostForm } from "./VK/Post";
import { VKShortForm } from "./VK/Short";
import { VKStoriesForm } from "./VK/Stories";
import { VKVideoForm } from "./VK/Video";
import { YoutubePostForm } from "./YouTube/Post";
import { YoutubeShortsForm } from "./YouTube/Shorts";
import { YoutubeStoriesForm } from "./YouTube/Stories";
import { YoutubeVideoForm } from "./YouTube/Video";

enum Platform {
  YouTube = "YouTube",
  VK = "VK",
  Telegram = "Telegram",
}

enum ContentType {
  POST = "post",
  SHORT = "short",
  STORIES = "stories",
  VIDEO = "video",
}

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  [ContentType.POST]: "Сообщение",
  [ContentType.SHORT]: "Shorts",
  [ContentType.STORIES]: "Stories",
  [ContentType.VIDEO]: "Видео",
};

const PLATFORM_ICONS = {
  [Platform.YouTube]: IconBrandYoutube,
  [Platform.VK]: IconBrandVk,
  [Platform.Telegram]: IconBrandTelegram,
};

const CONTENT_TYPE_ICONS = {
  [ContentType.POST]: IconMessage,
  [ContentType.SHORT]: IconPhotoVideo,
  [ContentType.STORIES]: IconPhotoVideo,
  [ContentType.VIDEO]: IconVideo,
};

// Определяем доступные типы контента для каждой платформы
const PLATFORM_CAPABILITIES = {
  [Platform.YouTube]: new Set([ContentType.VIDEO, ContentType.SHORT]),
  [Platform.VK]: new Set([ContentType.POST, ContentType.VIDEO, ContentType.STORIES]),
  [Platform.Telegram]: new Set([ContentType.POST, ContentType.STORIES]),
} as const;

// Функция для проверки доступности типа контента для платформы
const isContentTypeAvailableForPlatform = (platform: Platform, contentType: ContentType): boolean => {
  return PLATFORM_CAPABILITIES[platform].has(contentType);
};

type ContentMap = Record<Platform, Partial<Record<ContentType, JSX.Element>>>;

// Определяем компоненты для каждой платформы и типа контента
const PLATFORM_CONTENT: ContentMap = {
  [Platform.VK]: {
    [ContentType.POST]: <VKPostForm />,
    [ContentType.SHORT]: <VKShortForm />,
    [ContentType.STORIES]: <VKStoriesForm />,
    [ContentType.VIDEO]: <VKVideoForm />,
  },
  [Platform.Telegram]: {
    [ContentType.POST]: <TelegramPostForm />,
    [ContentType.STORIES]: <TelegramStoriesForm />,
  },
  [Platform.YouTube]: {
    [ContentType.POST]: <YoutubePostForm />,
    [ContentType.SHORT]: <YoutubeShortsForm />,
    [ContentType.STORIES]: <YoutubeStoriesForm />,
    [ContentType.VIDEO]: <YoutubeVideoForm />,
  },
};

interface Channel {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
}

// Временные данные для демонстрации, потом нужно будет заменить на реальные
const MOCK_CHANNELS: Channel[] = [
  {
    id: '1',
    name: 'Мой YouTube канал',
    avatar: 'https://picsum.photos/32',
    platform: Platform.YouTube
  },
  {
    id: '2',
    name: 'Личный блог',
    avatar: 'https://picsum.photos/32',
    platform: Platform.YouTube
  },
  {
    id: '3',
    name: 'Группа ВКонтакте',
    avatar: 'https://picsum.photos/32',
    platform: Platform.VK
  },
  {
    id: '4',
    name: 'Паблик ВКонтакте',
    avatar: 'https://picsum.photos/32',
    platform: Platform.VK
  },
  {
    id: '5',
    name: 'Telegram канал',
    avatar: 'https://picsum.photos/32',
    platform: Platform.Telegram
  }
];

interface PublicationTarget {
  channelId: string;
  platform: Platform;
}

interface Publication {
  id: string;
  contentType: ContentType;
  targets: PublicationTarget[];
}

const PLATFORM_COLORS = {
  [Platform.YouTube]: '#FF0000', // YouTube Red
  [Platform.VK]: '#0077FF', // VK Blue
  [Platform.Telegram]: '#229ED9', // Telegram Blue
} as const;

const PlatformCard = ({ platform, onSelect }: { platform: Platform; onSelect: (platform: Platform) => void }) => {
  const Icon = PLATFORM_ICONS[platform];
  
  return (
    <UnstyledButton onClick={() => onSelect(platform)} style={{ width: '100%' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="center">
          <Icon size={32} />
          <Text size="lg">{platform}</Text>
        </Group>
      </Card>
    </UnstyledButton>
  );
};

const ContentTypeCard = ({ type, onSelect }: { type: ContentType; onSelect: (type: ContentType) => void }) => {
  const Icon = CONTENT_TYPE_ICONS[type];
  
  // Подсчитываем, в скольких платформах доступен этот тип контента
  const availablePlatforms = Object.entries(PLATFORM_CAPABILITIES)
    .filter(([_, types]) => types.has(type))
    .map(([platform]) => platform as Platform);
  
  return (
    <UnstyledButton onClick={() => onSelect(type)} style={{ width: '100%' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
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

const ChannelAvatar = ({ channel, selected = false }: { channel: Channel; selected?: boolean }) => {
  const PlatformIcon = PLATFORM_ICONS[channel.platform];
  return (
    <Box pos="relative" p={4}>
      <Avatar
        src={channel.avatar}
        size="md"
        radius="xl"
        title={channel.name}
        style={{
          border: selected ? '2px solid var(--mantine-color-blue-6)' : 'none',
          opacity: selected ? 1 : 0.7,
        }}
      />
      <Box
        pos="absolute"
        top={0}
        right={0}
        style={{
          background: PLATFORM_COLORS[channel.platform],
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 4px rgba(0,0,0,0.1)',
        }}
      >
        <PlatformIcon size={12} style={{ flexShrink: 0, color: 'white' }} />
      </Box>
    </Box>
  );
};

const ChannelSelector = ({
  contentType,
  selectedChannels,
  onChannelToggle,
}: {
  contentType: ContentType;
  selectedChannels: string[];
  onChannelToggle: (channelId: string, platform: Platform) => void;
}) => {
  // Группируем каналы по платформам
  const availableChannels = MOCK_CHANNELS.filter(channel => 
    PLATFORM_CAPABILITIES[channel.platform].has(contentType)
  );

  return (
    <ScrollArea>
      <Group gap="sm" wrap="nowrap">
        {availableChannels.map((channel) => (
          <UnstyledButton
            key={channel.id}
            onClick={() => onChannelToggle(channel.id, channel.platform)}
            style={(theme) => ({
              transition: 'transform 150ms ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            })}
          >
            <ChannelAvatar 
              channel={channel} 
              selected={selectedChannels.includes(channel.id)} 
            />
          </UnstyledButton>
        ))}
      </Group>
    </ScrollArea>
  );
};

const SortableTab = ({
  publication,
  onRemove,
  active,
}: {
  publication: Publication;
  onRemove: (id: string) => void;
  active: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: publication.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const ContentTypeIcon = CONTENT_TYPE_ICONS[publication.contentType];
  
  const selectedChannelsInfo = MOCK_CHANNELS.filter(channel => 
    publication.targets.some(target => target.channelId === channel.id)
  );

  return (
    <div ref={setNodeRef} style={style}>
      <Tabs.Tab 
        value={publication.id} 
        w="100%"
        style={(theme: MantineTheme) => ({
          backgroundColor: active ? theme.colors.blue[0] : 'transparent',
          '&:hover': {
            backgroundColor: active ? theme.colors.blue[1] : theme.colors.gray[0],
          },
          transition: 'background-color 150ms ease',
          padding: theme.spacing.xs,
          marginBottom: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        })}
      >
        <Stack gap="xs" w="100%">
          <Group gap="xs" justify="space-between" w="100%">
            <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
              <span {...attributes} {...listeners} style={{ cursor: "grab" }}>
                ⠿
              </span>
              <ContentTypeIcon size={20} style={{ flexShrink: 0 }} />
              <Text size="sm" fw={500} lineClamp={1}>
                {CONTENT_TYPE_LABELS[publication.contentType]}
              </Text>
            </Group>
            <ActionIcon
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(publication.id);
              }}
              size="md"
              variant="subtle"
              ml="xs"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
          {selectedChannelsInfo.length > 0 && (
            <Group gap="xs" ml={24}>
              {selectedChannelsInfo.map((channel) => (
                <ChannelAvatar key={channel.id} channel={channel} selected />
              ))}
            </Group>
          )}
        </Stack>
      </Tabs.Tab>
    </div>
  );
};

const SelectedChannelsHeader = ({
  publication,
  onChannelToggle,
}: {
  publication: Publication;
  onChannelToggle: (channelId: string, platform: Platform) => void;
}) => {
  return (
    <Card withBorder mb="md">
      <Stack gap="xs">
        <Text fw={500} size="sm">Выберите каналы для публикации</Text>
        <ChannelSelector
          contentType={publication.contentType}
          selectedChannels={publication.targets.map(t => t.channelId)}
          onChannelToggle={onChannelToggle}
        />
      </Stack>
    </Card>
  );
};

const AddPublicationModal = ({
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
      opened={opened}
      onClose={onClose}
      title="Выберите тип контента"
      size="lg"
    >
      <Grid>
        {Object.values(ContentType).map((type) => (
          <Grid.Col span={4} key={type}>
            <ContentTypeCard
              type={type}
              onSelect={(selectedType) => {
                onAdd(selectedType);
                onClose();
              }}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Modal>
  );
};

export const Publication = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activePublication, setActivePublication] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPublications((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addPublication = (contentType: ContentType) => {
    const newPublication = {
      id: Date.now().toString(),
      contentType,
      targets: [],
    };
    setPublications([...publications, newPublication]);
    setActivePublication(newPublication.id);
  };

  const removePublication = (id: string) => {
    setPublications(publications.filter((pub) => pub.id !== id));
    if (activePublication === id && publications.length > 0) {
      setActivePublication(publications[0].id);
    }
  };

  const handleChannelToggle = (publicationId: string, channelId: string, platform: Platform) => {
    setPublications(publications.map(pub => {
      if (pub.id !== publicationId) return pub;
      
      const hasChannel = pub.targets.some(target => target.channelId === channelId);
      const newTargets = hasChannel
        ? pub.targets.filter(target => target.channelId !== channelId)
        : [...pub.targets, { channelId, platform }];
      
      return { ...pub, targets: newTargets };
    }));
  };

  return (
    <Tabs
      value={activePublication}
      onChange={setActivePublication}
      orientation="vertical"
      style={(theme: MantineTheme) => ({
        '.mantine-Tabs-panel': {
          paddingLeft: theme.spacing.md,
        }
      })}
      classNames={{
        tabLabel: classes.tabLabel
      }}
    >
      <Group align="flex-start" style={{ flex: 1 }}>
        <Stack gap="md" w={300}>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={open}
            fullWidth
          >
            Добавить публикацию
          </Button>
          
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={publications} strategy={verticalListSortingStrategy}>
              <Tabs.List>
                {publications.map((publication) => (
                  <SortableTab
                    key={publication.id}
                    publication={publication}
                    onRemove={removePublication}
                    active={publication.id === activePublication}
                  />
                ))}
              </Tabs.List>
            </SortableContext>
          </DndContext>
        </Stack>

        <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
          {publications.map((publication) => (
            <Tabs.Panel key={publication.id} value={publication.id}>
              <SelectedChannelsHeader
                publication={publication}
                onChannelToggle={(channelId, platform) => 
                  handleChannelToggle(publication.id, channelId, platform)
                }
              />
              {PLATFORM_CONTENT[Platform.YouTube][publication.contentType]}
            </Tabs.Panel>
          ))}
        </Stack>
      </Group>

      <AddPublicationModal
        opened={opened}
        onClose={close}
        onAdd={addPublication}
      />
    </Tabs>
  );
};

export default Publication;
