import axios from "axios";
import { transformCreateEventResponseToModel } from "./transform";
import type { CreateEventInputDto } from "./input.dto";
import type { CreateEventOutputDto } from "./output.dto";

const createEvent = async (
  inputDto: CreateEventInputDto,
): Promise<CreateEventOutputDto> => {
  const response = await axios.post<CreateEventOutputDto>(
    "http://localhost:4000/events",
    inputDto,
    {
      withCredentials: true,
    },
  );

  return transformCreateEventResponseToModel(response.data);
};

export default createEvent;
