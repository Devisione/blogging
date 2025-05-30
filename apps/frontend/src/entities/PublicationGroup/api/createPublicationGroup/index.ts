import axios from "axios";
import { transformCreatePublicationGroupResponseToModel } from "./transform";
import type { CreatePublicationGroupInputDto } from "./input.dto";
import type { CreatePublicationGroupOutputDto } from "./output.dto";

const createPublicationGroup = async (
  inputDto: CreatePublicationGroupInputDto,
): Promise<any> => {
  const { data } = await axios.post<CreatePublicationGroupOutputDto>(
    `http://localhost:4000/publication-group`,
    inputDto,
    {
      withCredentials: true,
    },
  );

  return transformCreatePublicationGroupResponseToModel(data);
};

export default createPublicationGroup;
