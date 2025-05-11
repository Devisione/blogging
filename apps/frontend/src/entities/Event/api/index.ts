import createEvent from "./createEvent";
import deleteEvent from "./deleteEvent";
import getEventsByCurrentUser from "./getEventsByCurrentUser";

export const EventApi = {
  getEventsByCurrentUser,
  createEvent,
  deleteEvent,
};
