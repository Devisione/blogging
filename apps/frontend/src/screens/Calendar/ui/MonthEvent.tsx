import React from "react";
import { Text } from "@mantine/core";
import { format } from "date-fns";
import { getHumanReadableDifference } from "@shared/utils/date";

const MonthEvent = ({
  event,
}: {
  event: { start: string; end: string; title: string };
}) => {
  const startTime = format(event.start, "HH:mm"); // или 'hh:mm A' для 12-часового формата

  return (
    <span>
      <Text component="span" size="xs">
        {startTime} -{" "}
        {getHumanReadableDifference(new Date(event.start), new Date(event.end))}
      </Text>{" "}
      {event.title}
    </span>
  );
};

export default MonthEvent;
