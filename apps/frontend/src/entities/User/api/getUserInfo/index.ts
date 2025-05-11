import axios from "axios";
import { transformGetUserInfoResponseToModel } from "./transform";
import type { User } from "../../model/types";
import type { GetUserInfoOutputDto } from "./output.dto";

const getUserInfo = async (): Promise<User> => {
  const response = await axios.get<GetUserInfoOutputDto>(
    "http://localhost:4000/users/me",
    {
      withCredentials: true,
    },
  );

  return transformGetUserInfoResponseToModel(response.data);
};

export default getUserInfo;
