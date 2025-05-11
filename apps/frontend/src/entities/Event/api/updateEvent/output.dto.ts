import type { Event } from "../../model/types";

export interface UpdateEventOutputDto {
  event: Event;
  childEvents: Event[];
}
