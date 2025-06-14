import createEvent from "./createEvent";
import deleteEvent from "./deleteEvent";
import getEventById from "./getEventById";
import getEventsByCurrentUser from "./getEventsByCurrentUser";
import updateEvent from "./updateEvent";

export const EventApi = {
  getEventById,
  getEventsByCurrentUser,
  createEvent,
  deleteEvent,
  updateEvent,
};
