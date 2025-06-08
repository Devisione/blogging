import type { ContentType } from "../../../Channel/model/types";

export interface PublicationGroup {
  id: string;
  eventId: string;
  name: string;
  status: string;
  updatedAt: Date;
  createdAt: Date;

  publications: {
    id: string;
    content: string;
    groupId: string;
    options: object;
    type: ContentType;
    preview_url?: string;
    title?: string;
    video_url?: string;
    channels: string[];
  }[];
}
