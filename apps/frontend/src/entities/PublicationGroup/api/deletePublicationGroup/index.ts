import axios from "axios";
import type { DeletePublicationGroupInputDto } from "./input.dto";

const deletePublicationGroup = async (
  inputDto: DeletePublicationGroupInputDto,
): Promise<boolean> => {
  const { status } = await axios.delete(
    `http://localhost:4000/publication-group/${inputDto.groupId}`,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default deletePublicationGroup;
