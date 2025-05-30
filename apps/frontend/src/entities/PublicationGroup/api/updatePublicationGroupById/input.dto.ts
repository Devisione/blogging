import type { ContentType } from "../../../Channel/model/types";

export interface UpdatePublicationGroupByIdInputDto {
  groupId: string;

  name: string;
  publications: {
    id: string;
    type: ContentType;
    channels: string[];
    content: string;
    title: string;
  }[];
}
