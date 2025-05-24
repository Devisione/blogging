import axios from "axios";
import { transformRemoveResponseToModel } from "./transform";
import type { RemoveInputDto } from "./input.dto";
import type { RemoveOutputDto } from "./output.dto";

const removeChannel = async (inputDto: RemoveInputDto): Promise<any> => {
  const response = await axios.delete<RemoveOutputDto>(
    `http://localhost:4000/channels/${inputDto.id}`,
    {
      withCredentials: true,
    },
  );
  return transformRemoveResponseToModel(response.data);
};

export default removeChannel;
