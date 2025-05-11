import type { Event } from "../../model/types";

export interface EventSubbed extends Partial<Omit<Event, "id">> {}

export interface UpdateEventInputDto extends EventSubbed, Pick<Event, "id"> {
  useWeekday?: boolean;
}
