import axios from "axios";
import type { PublishGroupInputDto } from "./input.dto";

const publishGroup = async (
  inputDto: PublishGroupInputDto,
): Promise<boolean> => {
  const { status } = await axios.post(
    `http://localhost:4000/publication-group/${inputDto.groupId}/publish`,
    void 0,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default publishGroup;
