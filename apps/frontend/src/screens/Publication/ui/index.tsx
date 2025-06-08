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
import { v4 as uuidv4 } from "uuid";
import {
  CONTENT_TYPE_ICONS,
  CONTENT_TYPE_LABELS,
  PLATFORM_CONTENT,
} from "@entities/Channel/config/constants";
import { ChannelAvatar } from "@entities/Channel/ui/ChannelAvatar";
import { $event } from "@entities/Event/model/store/event";
import { $publicationGroup } from "@entities/PublicationGroup/model/store/publicationGroups";
import { $userState } from "@entities/User/model/store";
import { Input } from "@shared/ui/forms/Input";
import type { ContentType, Platform } from "@entities/Channel/model/types";
import { FieldPathContext } from "../model/store/content";
import { useSubmit } from "../model/store/useSubmit";
import { AddPublicationModal } from "./AddPublicationModal";
import { ChannelSelector } from "./ChannelSelector";
import { Field } from "./Field";
import classes from "./index.module.css";
import type {
  PublicationFormValues,
  Publication as PublicationType,
} from "../model/types";

const SortableTab = ({
  publication,
  onRemove,
  active,
}: {
  publication: PublicationType;
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
                <ChannelAvatar channel={channel} key={channel.id} />
              ))}
            </Group>
          )}
        </Stack>
      </Tabs.Tab>
    </div>
  );
};

export const Publication = () => {
  const { data: publicationsGroup } = useUnit($publicationGroup);

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
    keyName: "_id",
  });

  const [activePublication, setActivePublication] = useState<string | null>(
    publications[0]?.id || null,
  );
  const [opened, { open, close }] = useDisclosure(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = publications.findIndex((item) => item.id === active.id);
      const newIndex = publications.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addPublication = (contentType: ContentType) => {
    const id = uuidv4();
    const newPublication: PublicationType = {
      id,
      type: contentType,
      channels: [],
      title: "",
      content: "",
    };
    append(newPublication);
    setActivePublication(id);
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

    const publication = publications[index] as unknown as PublicationType;
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

  const { submit, schedule, deSchedule } = useSubmit();

  return (
    <>
      {createPortal(
        <>
          <Input control={control} name="name" />
          {publicationsGroup?.status !== "published" && (
            <Button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises -- всё ок
              onClick={submit}
              style={{ marginLeft: "12px" }}
            >
              Сохранить
            </Button>
          )}
          <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- всё ок
            onClick={
              publicationsGroup?.status === "draft" ? schedule : deSchedule
            }
            style={{ marginLeft: "12px" }}
            variant="default"
          >
            {publicationsGroup?.status === "draft" && "Запланировать"}
            {publicationsGroup?.status === "scheduled" && "Отменить"}
          </Button>
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
                      publication={publication as unknown as PublicationType}
                    />
                  ))}
                </Tabs.List>
              </SortableContext>
            </DndContext>
          </Stack>

          <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            {publications.map((publication, index) => (
              <Tabs.Panel key={publication.id} value={publication.id}>
                <FieldPathContext.Provider value={{ index }}>
                  <ChannelSelector
                    onChannelToggle={(channelId, _platform) => {
                      handleChannelToggle(publication.id, channelId);
                    }}
                    publication={publication as unknown as PublicationType}
                  />
                  {PLATFORM_CONTENT[publication.type]}
                </FieldPathContext.Provider>
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
