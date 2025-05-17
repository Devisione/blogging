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
import { ActionIcon, Button, Flex, Select, Stack, Tabs } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
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

interface PlatformContentTypes {
  [Platform.VK]: {
    [ContentType.POST]: JSX.Element;
    [ContentType.SHORT]: JSX.Element;
    [ContentType.STORIES]: JSX.Element;
    [ContentType.VIDEO]: JSX.Element;
  };
  [Platform.Telegram]: {
    [ContentType.POST]: JSX.Element;
    [ContentType.STORIES]: JSX.Element;
  };
  [Platform.YouTube]: {
    [ContentType.POST]: JSX.Element;
    [ContentType.SHORT]: JSX.Element;
    [ContentType.STORIES]: JSX.Element;
    [ContentType.VIDEO]: JSX.Element;
  };
}

const PLATFORM_CONTENT: PlatformContentTypes = {
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

interface Tab {
  id: string;
  platform: Platform;
  contentType: ContentType;
}

const SortableTab = ({
  tab,
  onRemove,
  onPlatformChange,
  onContentTypeChange,
}: {
  tab: Tab;
  onRemove: (id: string) => void;
  onPlatformChange: (id: string, platform: Platform) => void;
  onContentTypeChange: (id: string, type: ContentType) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const availableContentTypes = Object.keys(PLATFORM_CONTENT[tab.platform]).map(
    (type) => ({
      value: type,
      label: CONTENT_TYPE_LABELS[type as ContentType],
    }),
  );

  return (
    <div ref={setNodeRef} style={style}>
      <Tabs.Tab value={tab.id} w="100%">
        <Stack gap="xs">
          <Flex align="center" w="100%">
            <span
              {...attributes}
              {...listeners}
              style={{ cursor: "grab", marginRight: 8 }}
            >
              ⠿
            </span>
            <Select
              data={Object.values(Platform)}
              onChange={(value) => {
                if (
                  value &&
                  Object.values(Platform).includes(value as Platform)
                ) {
                  onPlatformChange(tab.id, value as Platform);
                }
              }}
              style={{ flex: 1 }}
              value={tab.platform}
            />
            <ActionIcon
              color="red"
              component="div"
              ml="xs"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tab.id);
              }}
              size="xs"
            >
              <IconX size={10} />
            </ActionIcon>
          </Flex>
          <Select
            data={availableContentTypes}
            onChange={(value) => {
              value && onContentTypeChange(tab.id, value as ContentType);
            }}
            style={{ marginLeft: 24 }}
            value={tab.contentType}
          />
        </Stack>
      </Tabs.Tab>
    </div>
  );
};

const EditableTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      platform: Platform.YouTube,
      contentType: ContentType.SHORT,
    },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const isContentTypeAvailable = (
    platform: Platform,
    type: ContentType,
  ): boolean => {
    return type in PLATFORM_CONTENT[platform];
  };

  const addTab = () => {
    const id = Date.now().toString();
    const platform = Platform.YouTube;
    const newTab = {
      id,
      platform,
      contentType: Object.keys(PLATFORM_CONTENT[platform])[0] as ContentType,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(id);
  };

  const removeTab = (id: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over?.id);
      setTabs(arrayMove(tabs, oldIndex, newIndex));
    }
  };

  const handlePlatformChange = (id: string, platform: Platform) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === id) {
          const availableContentTypes = Object.keys(PLATFORM_CONTENT[platform]);
          return {
            ...tab,
            platform,
            contentType: availableContentTypes[0] as ContentType,
          };
        }
        return tab;
      }),
    );
  };

  const handleContentTypeChange = (id: string, contentType: ContentType) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, contentType } : tab)));
  };

  return (
    <Tabs
      classNames={{ tabLabel: classes.tabLabel }}
      onChange={(value) => {
        if (value) {
          setActiveTab(value);
        }
      }}
      orientation="vertical"
      value={activeTab}
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={tabs.map((tab) => tab.id)}
          strategy={verticalListSortingStrategy}
        >
          <Tabs.List w={300}>
            <Button
              component="div"
              mb={12}
              onClick={addTab}
              rightSection={
                <ActionIcon ml="xs" size="sm" variant="light">
                  <IconPlus size={16} />
                </ActionIcon>
              }
              variant="outline"
            >
              Добавить канал публикации
            </Button>
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                onContentTypeChange={handleContentTypeChange}
                onPlatformChange={handlePlatformChange}
                onRemove={removeTab}
                tab={tab}
              />
            ))}
          </Tabs.List>
        </SortableContext>
      </DndContext>

      {tabs.map((tab) => (
        <Tabs.Panel key={tab.id} ml={24} pt="xs" value={tab.id}>
          {isContentTypeAvailable(tab.platform, tab.contentType) &&
            PLATFORM_CONTENT[tab.platform][
              tab.contentType as keyof (typeof PLATFORM_CONTENT)[typeof tab.platform]
            ]}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default EditableTabs;
