import { useState } from "react";
import { createPortal } from "react-dom";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import type { MantineTheme } from "@mantine/core";
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
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandTelegram,
  IconBrandVk,
  IconBrandYoutube,
  IconMessage,
  IconPhotoVideo,
  IconPlus,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { useUnit } from "effector-react";
import { $userState } from "@entities/User/model/store";
import type { Channel as UserChannel } from "@entities/User/model/types";
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
  YouTube = "youtube",
  VK = "vk",
  Telegram = "telegram",
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
  [Platform.YouTube]: new Set([
    ContentType.VIDEO,
    ContentType.SHORT,
    ContentType.POST,
    ContentType.STORIES,
  ]),
  [Platform.VK]: new Set([
    ContentType.POST,
    ContentType.VIDEO,
    ContentType.STORIES,
  ]),
  [Platform.Telegram]: new Set([ContentType.POST]),
} as const;

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

interface Channel extends Omit<UserChannel, "channelId"> {
  platform: Platform;
}

// Remove MOCK_CHANNELS since we're using real data now
const PLATFORM_COLORS = {
  [Platform.YouTube]: "#FF0000", // YouTube Red
  [Platform.VK]: "#0077FF", // VK Blue
  [Platform.Telegram]: "#229ED9", // Telegram Blue
} as const;

interface PublicationTarget {
  channelId: string;
  platform: Platform;
}

interface Publication {
  id: string;
  contentType: ContentType;
  targets: PublicationTarget[];
}

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

const ChannelAvatar = ({
  channel,
  selected = false,
}: {
  channel: Channel;
  selected?: boolean;
}) => {
  const PlatformIcon = PLATFORM_ICONS[channel.platform];
  return (
    <Box p={4} pos="relative">
      <Avatar
        radius="xl"
        size="md"
        src={channel.avatarUrl}
        style={{
          border: selected ? "2px solid var(--mantine-color-blue-6)" : "none",
          opacity: selected ? 1 : 0.7,
        }}
        title={channel.name}
      />
      <Box
        pos="absolute"
        right={0}
        style={{
          background: PLATFORM_COLORS[channel.platform],
          borderRadius: "50%",
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        }}
        top={0}
      >
        <PlatformIcon size={12} style={{ flexShrink: 0, color: "white" }} />
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
  const userState = useUnit($userState);
  const channels = userState.data?.channels || [];

  // Filter channels based on content type compatibility and map to our Channel type
  const availableChannels = channels
    .map((channel) => ({
      ...channel,
      platform: channel.type.toLowerCase() as Platform,
    }))
    .filter((channel) => {
      const platformCapabilities = PLATFORM_CAPABILITIES[channel.platform];
      return platformCapabilities.has(contentType) || false;
    });

  // Group channels by platform for better organization
  const channelsByPlatform = availableChannels.reduce<
    Record<Platform, Channel[]>
  >(
    (acc, channel) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- тут всё ок
      if (!acc[channel.platform]) {
        acc[channel.platform] = [];
      }
      acc[channel.platform].push(channel);
      return acc;
    },
    // eslint-disable-next-line -- всё ок
    {} as Record<Platform, Channel[]>,
  );

  return (
    <ScrollArea>
      <Stack gap="md">
        {(Object.entries(channelsByPlatform) as [Platform, Channel[]][]).map(
          ([platform, platformChannels]) => (
            <div key={platform}>
              <Text fw={500} mb="xs" size="sm">
                {platform}
              </Text>
              <Group gap="sm" wrap="nowrap">
                {platformChannels.map((channel) => {
                  const platformCapabilities =
                    PLATFORM_CAPABILITIES[channel.platform];
                  const isAvailable =
                    platformCapabilities.has(contentType) || false;

                  return (
                    <UnstyledButton
                      key={channel.id}
                      onClick={() => {
                        if (isAvailable) {
                          onChannelToggle(channel.id, channel.platform);
                        }
                      }}
                      style={() => ({
                        opacity: isAvailable ? 1 : 0.5,
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        transition: "transform 150ms ease",
                        "&:hover": {
                          transform: isAvailable ? "scale(1.05)" : "none",
                        },
                      })}
                      title={
                        !isAvailable
                          ? `${contentType} недоступен для ${platform}`
                          : undefined
                      }
                    >
                      <ChannelAvatar
                        channel={channel}
                        selected={selectedChannels.includes(channel.id)}
                      />
                    </UnstyledButton>
                  );
                })}
              </Group>
            </div>
          ),
        )}
      </Stack>
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: publication.id,
    });

  const userState = useUnit($userState);
  const channels = userState.data?.channels || [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const ContentTypeIcon = CONTENT_TYPE_ICONS[publication.contentType];

  const selectedChannelsInfo = channels
    .filter((channel) =>
      publication.targets.some((target) => target.channelId === channel.id),
    )
    .map((channel) => ({
      ...channel,
      platform: channel.type.toLowerCase() as Platform,
    }));

  return (
    <div ref={setNodeRef} style={style}>
      <Tabs.Tab
        style={(theme: MantineTheme) => ({
          backgroundColor: active ? theme.colors.blue[0] : "transparent",
          "&:hover": {
            backgroundColor: active
              ? theme.colors.blue[1]
              : theme.colors.gray[0],
          },
          transition: "background-color 150ms ease",
          padding: theme.spacing.xs,
          marginBottom: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        })}
        value={publication.id}
        w="100%"
      >
        <Stack gap="xs" w="100%">
          <Group gap="xs" justify="space-between" w="100%">
            <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
              <span {...attributes} {...listeners} style={{ cursor: "grab" }}>
                ⠿
              </span>
              <ContentTypeIcon size={20} style={{ flexShrink: 0 }} />
              <Text fw={500} lineClamp={1} size="sm">
                {CONTENT_TYPE_LABELS[publication.contentType]}
              </Text>
            </Group>
            <ActionIcon
              color="red"
              ml="xs"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(publication.id);
              }}
              size="md"
              variant="subtle"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
          {selectedChannelsInfo.length > 0 && (
            <Group gap="xs" ml={24}>
              {selectedChannelsInfo.map((channel) => (
                <ChannelAvatar channel={channel} key={channel.id} selected />
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
    <Card mb="md" withBorder>
      <Stack gap="xs">
        <Text fw={500} size="sm">
          Выберите каналы для публикации
        </Text>
        <ChannelSelector
          contentType={publication.contentType}
          onChannelToggle={onChannelToggle}
          selectedChannels={publication.targets.map((t) => t.channelId)}
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

export const Publication = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activePublication, setActivePublication] = useState<string | null>(
    null,
  );
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

  const handleChannelToggle = (
    publicationId: string,
    channelId: string,
    platform: Platform,
  ) => {
    setPublications(
      publications.map((pub) => {
        if (pub.id !== publicationId) return pub;

        const hasChannel = pub.targets.some(
          (target) => target.channelId === channelId,
        );
        const newTargets = hasChannel
          ? pub.targets.filter((target) => target.channelId !== channelId)
          : [...pub.targets, { channelId, platform }];

        return { ...pub, targets: newTargets };
      }),
    );
  };

  return (
    <>
      {createPortal(
        <>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            Создание публикации
          </h1>
          <Button style={{ marginLeft: "12px" }} variant="default">
            Опубликовать
          </Button>
          <Button style={{ marginLeft: "12px" }}>Запланировать</Button>
        </>,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- всё там есть
        document.querySelector("#header-portal")!,
      )}
      <Tabs
        classNames={{
          tabLabel: classes.tabLabel,
        }}
        onChange={setActivePublication}
        orientation="vertical"
        style={(theme: MantineTheme) => ({
          ".mantine-Tabs-panel": {
            paddingLeft: theme.spacing.md,
          },
        })}
        value={activePublication}
      >
        <Group align="flex-start" style={{ flex: 1 }}>
          <Stack gap="md" w={300}>
            <Button
              fullWidth
              leftSection={<IconPlus size={16} />}
              onClick={open}
            >
              Добавить публикацию
            </Button>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={publications}
                strategy={verticalListSortingStrategy}
              >
                <Tabs.List>
                  {publications.map((publication) => (
                    <SortableTab
                      active={publication.id === activePublication}
                      key={publication.id}
                      onRemove={removePublication}
                      publication={publication}
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
                  onChannelToggle={(channelId, platform) => {
                    handleChannelToggle(publication.id, channelId, platform);
                  }}
                  publication={publication}
                />
                {PLATFORM_CONTENT[Platform.YouTube][publication.contentType]}
              </Tabs.Panel>
            ))}
          </Stack>
        </Group>

        <AddPublicationModal
          onAdd={addPublication}
          onClose={close}
          opened={opened}
        />
      </Tabs>
    </>
  );
};

export default Publication;
