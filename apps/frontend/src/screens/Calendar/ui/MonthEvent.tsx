import React from "react";
import { useRouter } from "next/router";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import { useUnit } from "effector-react";
import { deletePublicationGroupMutation } from "@entities/PublicationGroup/model/store/publicationGroups";
import { getHumanReadableDifference } from "@shared/utils/date";
import { mergeWithParent } from "@shared/utils/object";
import type { Event } from "@entities/Event/model/types";

export type EventWithDates = Event & {
  start: string;
  end: string;
  parent?: Event;
};

const MonthEvent = ({ event }: { event: EventWithDates }) => {
  const preparedEvent = mergeWithParent(event, event.parent);
  const deletePublicationGroup = useUnit(deletePublicationGroupMutation);

  const startTime = format(preparedEvent.date, "HH:mm");

  const endDate = new Date(preparedEvent.date);
  endDate.setMinutes(preparedEvent.date.getMinutes() + preparedEvent.duration);

  const router = useRouter();

  return (
    <Flex align="center" direction="column" style={{ position: "relative" }}>
      <div>
        <ActionIcon
          aria-label="Settings"
          color="rgba(255, 255, 255, 1)"
          onClick={(e) => {
            e.stopPropagation();
            void router.push(`/publication/${event.id}`);
          }}
          radius="xl"
          style={{ position: "absolute", right: 0, top: 0 }}
          variant="subtle"
        >
          <IconPlus />
        </ActionIcon>
        <Text component="span" size="xs">
          {startTime} -{" "}
          {getHumanReadableDifference(new Date(event.date), new Date(endDate))}
        </Text>{" "}
        {preparedEvent.title}
      </div>
      {event.publicationGroups ? <hr style={{ width: "100%" }} /> : null}
      <Flex align="start" justify="start" mb={4} w="100%" direction="column">
        {event.publicationGroups?.map(({ name, id }) => (
          <Flex align="center" justify="space-between" key={id} w="100%">
            <Text
              fw="bold"
              onClick={(e) => {
                e.stopPropagation();
                void router.push(`/publication/${event.id}/${id}`);
              }}
            >
              - {name}
            </Text>
            <ActionIcon
              aria-label="delete"
              color="rgba(255, 255, 255, 1)"
              onClick={(e) => {
                e.stopPropagation();
                console.log("delete");
                deletePublicationGroup.start({ groupId: id });
              }}
              radius="xl"
              variant="subtle"
            >
              <IconTrash />
            </ActionIcon>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default MonthEvent;
