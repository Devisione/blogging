import axios from "axios";
import { transformGetEventByIdResponseToModel } from "./transform";
import type { Event } from "../../model/types/index";
import type { GetEventByIdInputDto } from "./input.dto";
import type { GetEventByIdOutputDto } from "./output.dto";

const getEventById = async (inputDto: GetEventByIdInputDto): Promise<Event> => {
  const response = await axios.get<GetEventByIdOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${inputDto.id}`,
    {
      withCredentials: true,
    },
  );
  return transformGetEventByIdResponseToModel(response.data);
};

export default getEventById;
