import React from "react";
import { useRouter } from "next/router";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
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

  const startTime = format(preparedEvent.date, "HH:mm");

  const endDate = new Date(preparedEvent.date);
  endDate.setMinutes(preparedEvent.date.getMinutes() + preparedEvent.duration);

  const router = useRouter();

  return (
    <Flex align="center" direction="column">
      <div>
        <Text component="span" size="xs">
          {startTime} -{" "}
          {getHumanReadableDifference(new Date(event.date), new Date(endDate))}
        </Text>{" "}
        {preparedEvent.title}
      </div>
      <hr style={{ width: "100%" }} />
      <Flex align="center" justify="center" mb={4} w="100%">
        <ActionIcon
          aria-label="Settings"
          color="rgba(255, 255, 255, 1)"
          onClick={(e) => {
            e.stopPropagation();
            void router.push(`/publication/${event.id}`);
          }}
          radius="xl"
          variant="subtle"
        >
          <IconPlus />
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default MonthEvent;
