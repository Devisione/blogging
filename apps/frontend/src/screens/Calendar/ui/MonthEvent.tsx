import React from "react";
import { Text } from "@mantine/core";
import { format } from "date-fns";

const MonthEvent = ({
  event,
}: {
  event: { start: string; end: string; title: string };
}) => {
  const startTime = format(event.start, "HH:mm"); // или 'hh:mm A' для 12-часового формата
  const endTime = format(event.end, "HH:mm"); // или 'hh:mm A' для 12-часового формата

  return (
    <span>
      <Text component="span" size="xs">
        {startTime} - {endTime}
      </Text>{" "}
      {event.title}
    </span>
  );
};

export default MonthEvent;
