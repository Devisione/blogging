import type { Event } from "../../model/types";

export interface CreateEventInputDto extends Omit<Event, "id"> {}
