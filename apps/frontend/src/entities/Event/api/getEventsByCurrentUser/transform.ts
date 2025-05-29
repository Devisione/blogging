import type { Event } from "../../model/types";
import type { GetEventsByCurrentUserOutputDto } from "./output.dto";

export const transformGetEventsByCurrentUserResponseToModel = (
  params: GetEventsByCurrentUserOutputDto,
): Event[] => {
  return params.map((event) => ({
    ...event,
    date: new Date(event.date),
    recurrenceStart: event.recurrenceStart
      ? new Date(event.recurrenceStart)
      : void 0,
    recurrenceEnd: event.recurrenceEnd ? new Date(event.recurrenceEnd) : void 0,
    publicationGroups:
      event.publicationGroups.length > 0
        ? event.publicationGroups.map((publicationGroup) => ({
            id: publicationGroup.id,
            name: publicationGroup.name,
            status: publicationGroup.status,
          }))
        : void 0,
  }));
};
