import axios from "axios";
import type { DeletePublicationGroupInputDto } from "./input.dto";

const deletePublicationGroup = async (
  inputDto: DeletePublicationGroupInputDto,
): Promise<boolean> => {
  const { status } = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/publication-group/${inputDto.groupId}`,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default deletePublicationGroup;
