import axios from "axios";
import { transformGetUserInfoResponseToModel } from "./transform";
import type { User } from "../../model/types";
import type { GetUserInfoOutputDto } from "./output.dto";

const getUserInfo = async (): Promise<User> => {
  const response = await axios.get<GetUserInfoOutputDto>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
    {
      withCredentials: true,
    },
  );

  return transformGetUserInfoResponseToModel(response.data);
};

export default getUserInfo;
