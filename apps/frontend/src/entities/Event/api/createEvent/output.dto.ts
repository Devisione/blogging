import type { Event } from "../../model/types";

export interface CreateEventOutputDto {
  event: Event;
  childEvents: Event[];
}
