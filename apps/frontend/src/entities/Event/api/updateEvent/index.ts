import axios from "axios";
import { transformUpdateEventResponseToModel } from "./transform";
import type { UpdateEventInputDto } from "./input.dto";
import type { UpdateEventOutputDto } from "./output.dto";

const updateEvent = async (
  inputDto: UpdateEventInputDto,
): Promise<UpdateEventOutputDto> => {
  const response = await axios.put<UpdateEventOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${inputDto.id}`,
    inputDto,
    {
      withCredentials: true,
    },
  );
  return transformUpdateEventResponseToModel(response.data);
};

export default updateEvent;
