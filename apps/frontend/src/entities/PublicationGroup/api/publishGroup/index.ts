import axios from "axios";
import type { PublishGroupInputDto } from "./input.dto";

const publishGroup = async (
  inputDto: PublishGroupInputDto,
): Promise<boolean> => {
  const { status } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/publication-group/${inputDto.groupId}/publish`,
    void 0,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default publishGroup;
