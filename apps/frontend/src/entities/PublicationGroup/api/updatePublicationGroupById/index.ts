import axios from "axios";
import { transformUpdatePublicationGroupByIdResponseToModel } from "./transform";
import type { PublicationGroup } from "../../model/types";
import type { UpdatePublicationGroupByIdInputDto } from "./input.dto";
import type { UpdatePublicationGroupByIdOutputDto } from "./output.dto";

const updatePublicationGroupById = async (
  inputDto: UpdatePublicationGroupByIdInputDto,
): Promise<PublicationGroup> => {
  const { groupId, ...other } = inputDto;
  const { data } = await axios.put<UpdatePublicationGroupByIdOutputDto>(
    `http://localhost:4000/publication-group/${groupId}`,
    other,
    {
      withCredentials: true,
    },
  );
  return transformUpdatePublicationGroupByIdResponseToModel(data);
};

export default updatePublicationGroupById;
