import axios from "axios";
import type { DeleteEventInputDto } from "./input.dto";

const deleteEvent = async (inputDto: DeleteEventInputDto): Promise<boolean> => {
  const response = await axios.delete(
    `http://localhost:4000/events/${inputDto.id}`,
    {
      withCredentials: true,
    },
  );

  return response.status === 200;
};

export default deleteEvent;
