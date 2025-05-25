import type { Event } from "../../model/types";
import type { GetEventByIdOutputDto } from "./output.dto";

export const transformGetEventByIdResponseToModel = (
  event: GetEventByIdOutputDto,
): Event => {
  return {
    ...event,
    date: new Date(event.date),
    recurrenceStart: event.recurrenceStart
      ? new Date(event.recurrenceStart)
      : void 0,
    recurrenceEnd: event.recurrenceEnd ? new Date(event.recurrenceEnd) : void 0,
  };
};
