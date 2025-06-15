import axios from "axios";
import { transformRemoveResponseToModel } from "./transform";
import type { RemoveInputDto } from "./input.dto";
import type { RemoveOutputDto } from "./output.dto";

const removeChannel = async (inputDto: RemoveInputDto): Promise<any> => {
  const response = await axios.delete<RemoveOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/${inputDto.id}`,
    {
      withCredentials: true,
    },
  );
  return transformRemoveResponseToModel(response.data);
};

export default removeChannel;
