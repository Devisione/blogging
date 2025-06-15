import axios from "axios";
import { transformCreatePublicationGroupResponseToModel } from "./transform";
import type { PublicationGroup } from "../../model/types";
import type { CreatePublicationGroupInputDto } from "./input.dto";
import type { CreatePublicationGroupOutputDto } from "./output.dto";

const createPublicationGroup = async (
  inputDto: CreatePublicationGroupInputDto,
): Promise<PublicationGroup> => {
  const { data } = await axios.post<CreatePublicationGroupOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/publication-group`,
    inputDto,
    {
      withCredentials: true,
    },
  );

  return transformCreatePublicationGroupResponseToModel(data);
};

export default createPublicationGroup;
