import axios from "axios";
import type { DeleteEventInputDto } from "./input.dto";

const deleteEvent = async (inputDto: DeleteEventInputDto): Promise<boolean> => {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${inputDto.id}`,
    {
      withCredentials: true,
    },
  );

  return response.status === 200;
};

export default deleteEvent;
