import type { CreateEventOutputDto } from "./output.dto";

export const transformCreateEventResponseToModel = (
  params: CreateEventOutputDto,
): CreateEventOutputDto => {
  return params;
};
