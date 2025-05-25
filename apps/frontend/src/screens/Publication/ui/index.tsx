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
import { ActionIcon, Button, Group, Stack, Tabs, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useUnit } from "effector-react";
import {
  CONTENT_TYPE_ICONS,
  CONTENT_TYPE_LABELS,
  PLATFORM_CONTENT,
} from "@entities/Channel/config/constants";
import { Platform } from "@entities/Channel/model/types";
import { ChannelAvatar } from "@entities/Channel/ui/ChannelAvatar";
import { $event } from "@entities/Event/model/store/event";
import { $userState } from "@entities/User/model/store";
import type { ContentType } from "@entities/Channel/model/types";
import { AddPublicationModal } from "./AddPublicationModal";
import { ChannelSelector } from "./ChannelSelector";
import { Field } from "./Field";
import classes from "./index.module.css";

interface PublicationTarget {
  channelId: string;
  platform: Platform;
}

interface Publication {
  id: string;
  contentType: ContentType;
  targets: PublicationTarget[];
}

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

  const { data: event } = useUnit($event);

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
          <Field
            disabled={Boolean(event)}
            name="publishDate"
            render={({ field }) => {
              return (
                <DateTimePicker
                  ml={12}
                  placeholder="Дата публикации"
                  {...field}
                />
              );
            }}
          />
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
                <ChannelSelector
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
