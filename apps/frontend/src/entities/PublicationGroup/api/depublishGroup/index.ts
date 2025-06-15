import axios from "axios";
import type { DepublishGroupInputDto } from "./input.dto";

const depublishGroup = async (
  inputDto: DepublishGroupInputDto,
): Promise<boolean> => {
  const { status } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/publication-group/${inputDto.groupId}/depublish`,
    void 0,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default depublishGroup;
