import type { Channel, ContentType } from "../../../Channel/model/types";

export interface CreatePublicationGroupOutputDto {
  id: string;
  name: string;
  status: string;

  publications?: {
    id: string;
    content: string;
    groupId: string;
    options: object;
    platform: ContentType;
    preview_url?: string;
    title?: string;
    video_url?: string;
    publicationChannels: { channel: Channel; id: string; status: string }[];
  }[];
}
