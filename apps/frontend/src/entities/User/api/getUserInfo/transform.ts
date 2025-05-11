import type { User } from "../../model/types";
import type { GetUserInfoOutputDto } from "./output.dto";

export const transformGetUserInfoResponseToModel = (
  params: GetUserInfoOutputDto,
): User => {
  return { id: params.id, name: params.name, email: params.email };
};
