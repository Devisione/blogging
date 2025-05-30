import type { ContentType } from "../../../Channel/model/types";

export interface CreatePublicationGroupInputDto {
  eventId?: string;

  name: string;
  publications: {
    type: ContentType;
    channels: string[];
    content: string;
    title: string;
  }[];
}
