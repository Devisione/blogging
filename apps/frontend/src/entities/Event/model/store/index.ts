import { createQuery } from "@farfetched/core";
import { onChangePageEv } from "@services/Router/model";
import { combine, createEffect, sample } from "effector";
import { EventApi } from "../../api";
import createEvent from "../../api/createEvent";
import deleteEvent from "../../api/deleteEvent";
import updateEvent from "../../api/updateEvent";
import type { CreateEventInputDto } from "../../api/createEvent/input.dto";
import type { DeleteEventInputDto } from "../../api/deleteEvent/input.dto";
import type { UpdateEventInputDto } from "../../api/updateEvent/input.dto";

const $events = createQuery({
  handler: () => {
    return EventApi.getEventsByCurrentUser();
  },
});

const $preparedCalendarEvents = combine($events.$data, (events) => {
  if (events) {
    return events.map((event) => {
      const endDate = new Date(event.date);
      endDate.setMinutes(event.date.getMinutes() + event.duration);

      return {
        ...event,
        start: event.date,
        end: endDate,
      };
    });
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

const onUpdateEvent = createEffect({
  handler: (input: UpdateEventInputDto) => {
    return updateEvent(input);
  },
});
sample({ clock: onUpdateEvent.finally, target: $events.start });

export {
  $events,
  $preparedCalendarEvents,
  onCreateEvent,
  onDeleteEvent,
  onUpdateEvent,
};
