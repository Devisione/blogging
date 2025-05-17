import { useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Button, Flex, Select, Stack, Tabs } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import YoutubeShortsForm from "./YouTube/Shorts";
import YoutubeVideoForm from "./YouTube/Video";
import YoutubePostForm from "./YouTube/Post";
import YoutubeStoriesForm from "./YouTube/Stories";
import VKStoriesForm from "./VK/Stories";
import VKPostForm from "./VK/Post";
import VKShortForm from "./VK/Short";
import VKVideoForm from "./VK/Video";
import TelegramPostForm from "./Telegram/Post";
import TelegramStoriesForm from "./Telegram/Stories";
import classes from "./index.module.css";

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

type PlatformContentTypes = {
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
};

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

type PlatformSpecificContentType<P extends Platform> = keyof PlatformContentTypes[P];

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

  const availableContentTypes = Object.keys(PLATFORM_CONTENT[tab.platform]).map(type => ({
    value: type,
    label: CONTENT_TYPE_LABELS[type as ContentType]
  }));

  const isContentTypeAvailable = (platform: Platform, type: ContentType): boolean => {
    return type in PLATFORM_CONTENT[platform];
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Tabs.Tab w="100%" value={tab.id}>
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
              value={tab.platform}
              onChange={(value) => {
                if (value && Object.values(Platform).includes(value as Platform)) {
                  onPlatformChange(tab.id, value as Platform);
                }
              }}
              data={Object.values(Platform)}
              style={{ flex: 1 }}
            />
            <ActionIcon
              component="div"
              size="xs"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tab.id);
              }}
              ml="xs"
            >
              <IconX size={10} />
            </ActionIcon>
          </Flex>
          <Select
            value={tab.contentType}
            onChange={(value) => value && onContentTypeChange(tab.id, value as ContentType)}
            data={availableContentTypes}
            style={{ marginLeft: 24 }}
          />
        </Stack>
      </Tabs.Tab>
    </div>
  );
};

export default function EditableTabs() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      platform: Platform.YouTube,
      contentType: ContentType.SHORT,
    },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const isContentTypeAvailable = (platform: Platform, type: ContentType): boolean => {
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

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);
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
            contentType: availableContentTypes[0] as ContentType
          };
        }
        return tab;
      })
    );
  };

  const handleContentTypeChange = (id: string, contentType: ContentType) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, contentType } : tab)));
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value!);
        }}
        orientation="vertical"
        classNames={{ tabLabel: classes.tabLabel }}
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tabs.map((tab) => tab.id)}
            strategy={verticalListSortingStrategy}
          >
            <Tabs.List w={300}>
              <Button
                component="div"
                mb={12}
                onClick={addTab}
                variant="outline"
                rightSection={
                  <ActionIcon variant="light" size="sm" ml="xs">
                    <IconPlus size={16} />
                  </ActionIcon>
                }
              >
                Добавить канал публикации
              </Button>
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  onRemove={removeTab}
                  onPlatformChange={handlePlatformChange}
                  onContentTypeChange={handleContentTypeChange}
                />
              ))}
            </Tabs.List>
          </SortableContext>
        </DndContext>

        {tabs.map((tab) => (
          <Tabs.Panel value={tab.id} key={tab.id} pt="xs" ml={24}>
            {isContentTypeAvailable(tab.platform, tab.contentType) && 
              PLATFORM_CONTENT[tab.platform][tab.contentType as keyof typeof PLATFORM_CONTENT[typeof tab.platform]]}
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
