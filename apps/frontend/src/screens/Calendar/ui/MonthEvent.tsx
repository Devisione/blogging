import React from "react";
import { Text } from "@mantine/core";
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

  return (
    <span>
      <Text component="span" size="xs">
        {startTime} -{" "}
        {getHumanReadableDifference(new Date(event.date), new Date(endDate))}
      </Text>{" "}
      {preparedEvent.title}
    </span>
  );
};

export default MonthEvent;
