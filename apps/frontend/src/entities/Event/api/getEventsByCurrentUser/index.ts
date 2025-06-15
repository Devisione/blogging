import axios from "axios";
import { transformGetEventsByCurrentUserResponseToModel } from "./transform";
import type { Event } from "../../model/types";
import type { GetEventsByCurrentUserOutputDto } from "./output.dto";

const getEventsByCurrentUser = async (): Promise<Event[]> => {
  const response = await axios.get<GetEventsByCurrentUserOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/user`,
    {
      withCredentials: true,
    },
  );

  return transformGetEventsByCurrentUserResponseToModel(response.data);
};

export default getEventsByCurrentUser;
