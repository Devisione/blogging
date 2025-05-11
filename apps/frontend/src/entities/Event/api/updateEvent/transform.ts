import type { UpdateEventOutputDto } from "./output.dto";

export const transformUpdateEventResponseToModel = (
  params: UpdateEventOutputDto,
): UpdateEventOutputDto => {
  return params;
};
