import type { Channel, ContentType } from "../../../Channel/model/types";

export interface UpdatePublicationGroupByIdOutputDto {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  createdAt: string;

  publications: {
    id: string;
    content: string;
    groupId: string;
    options: object;
    platform: ContentType;
    title?: string;
    publicationChannels: { channel: Channel; id: string; status: string }[];
    attachments: {
      filename: string;
      id: string;
      mimetype: string;
      size: number;
      url: string;
    }[];
  }[];
}
