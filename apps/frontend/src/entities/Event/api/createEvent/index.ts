import axios from "axios";
import { transformCreateEventResponseToModel } from "./transform";
import type { CreateEventInputDto } from "./input.dto";
import type { CreateEventOutputDto } from "./output.dto";

const createEvent = async (
  inputDto: CreateEventInputDto,
): Promise<CreateEventOutputDto> => {
  const response = await axios.post<CreateEventOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`,
    inputDto,
    {
      withCredentials: true,
    },
  );

  return transformCreateEventResponseToModel(response.data);
};

export default createEvent;
