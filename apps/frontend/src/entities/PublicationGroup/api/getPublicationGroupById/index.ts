import axios from "axios";
import { transformGetPublicationGroupByIdResponseToModel } from "./transform";
import type { PublicationGroup } from "../../model/types";
import type { GetPublicationGroupByIdInputDto } from "./input.dto";
import type { GetPublicationGroupByIdOutputDto } from "./output.dto";

const getPublicationGroupById = async (
  inputDto: GetPublicationGroupByIdInputDto,
): Promise<PublicationGroup> => {
  const { data } = await axios.get<GetPublicationGroupByIdOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/publication-group/${inputDto.groupId}`,
    {
      withCredentials: true,
    },
  );

  return transformGetPublicationGroupByIdResponseToModel(data);
};

export default getPublicationGroupById;
