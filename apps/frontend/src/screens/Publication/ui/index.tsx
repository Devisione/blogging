import { useState } from "react";
import { createPortal } from "react-dom";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import type { MantineTheme } from "@mantine/core";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
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
import { ContentType, Platform } from "@entities/Channel/model/types";
import { ChannelAvatar } from "@entities/Channel/ui/ChannelAvatar";
import { $event } from "@entities/Event/model/store/event";
import { $userState } from "@entities/User/model/store";
import { AddPublicationModal } from "./AddPublicationModal";
import { ChannelSelector } from "./ChannelSelector";
import { Field } from "./Field";
import classes from "./index.module.css";
import type {
  PublicationFormValues,
  Publication as PublicationType,
  PublicationWithId,
} from "../model/types";

const SortableTab = ({
  publication,
  onRemove,
  active,
}: {
  publication: PublicationWithId;
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

  const ContentTypeIcon = CONTENT_TYPE_ICONS[publication.type];

  const selectedChannelsInfo = channels
    .filter((channel) => publication.channels.includes(channel.id))
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
                {CONTENT_TYPE_LABELS[publication.type]}
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
  const [activePublication, setActivePublication] = useState<string | null>(
    null,
  );
  const [opened, { open, close }] = useDisclosure(false);
  const { control } = useFormContext<PublicationFormValues>();

  const {
    fields: publications,
    append,
    remove,
    move,
    update,
  } = useFieldArray({
    control,
    name: "publications",
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = publications.findIndex((item) => item.id === active.id);
      const newIndex = publications.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addPublication = (contentType: ContentType) => {
    const newPublication: PublicationType = {
      type: contentType,
      channels: [],
    };
    append(newPublication);
    setActivePublication(Date.now().toString());
  };

  const removePublication = (id: string) => {
    const index = publications.findIndex((pub) => pub.id === id);
    if (index !== -1) {
      remove(index);
      if (activePublication === id && publications.length > 0) {
        setActivePublication(publications[0].id);
      }
    }
  };

  const handleChannelToggle = (publicationId: string, channelId: string) => {
    const index = publications.findIndex((pub) => pub.id === publicationId);
    if (index === -1) return;

    const publication = publications[index] as unknown as PublicationWithId;
    const hasChannel = publication.channels.includes(channelId);

    const newChannels = hasChannel
      ? publication.channels.filter((ch: string) => ch !== channelId)
      : [...publication.channels, channelId];

    update(index, {
      ...publication,
      channels: newChannels,
    });
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
            render={({ field }) => (
              <DateTimePicker
                ml={12}
                placeholder="Дата публикации"
                {...field}
                value={field.value instanceof Date ? field.value : new Date()}
              />
            )}
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
                      publication={publication as unknown as PublicationWithId}
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
                  onChannelToggle={(channelId, _platform) => {
                    handleChannelToggle(publication.id, channelId);
                  }}
                  publication={publication as unknown as PublicationWithId}
                />
                {PLATFORM_CONTENT[Platform.YouTube][publication.type]}
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
