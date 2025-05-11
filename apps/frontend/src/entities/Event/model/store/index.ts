import { createQuery } from "@farfetched/core";
import { onChangePageEv } from "@services/Router/model";
import { combine, createEffect, sample } from "effector";
import { EventApi } from "../../api";
import createEvent from "../../api/createEvent";
import deleteEvent from "../../api/deleteEvent";
import type { CreateEventInputDto } from "../../api/createEvent/input.dto";
import type { DeleteEventInputDto } from "../../api/deleteEvent/input.dto";

const $events = createQuery({
  handler: () => {
    return EventApi.getEventsByCurrentUser();
  },
});

const $preparedCalendarEvents = combine($events.$data, (events) => {
  if (events) {
    return events.map((event) => ({
      ...event,
      start: event.date,
      end: event.date,
    }));
  }
  return null;
});

sample({
  clock: onChangePageEv,
  filter: (pathname) => pathname.includes("calendar"),
  target: $events.start,
});

const onCreateEvent = createEffect({
  handler: (input: CreateEventInputDto) => {
    return createEvent(input);
  },
});
sample({ clock: onCreateEvent.finally, target: $events.start });

const onDeleteEvent = createEffect({
  handler: (input: DeleteEventInputDto) => {
    return deleteEvent(input);
  },
});
sample({ clock: onDeleteEvent.finally, target: $events.start });

export { $events, $preparedCalendarEvents, onCreateEvent, onDeleteEvent };
