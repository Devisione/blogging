import type { ContentType } from "@entities/Channel/model/types";

export interface Publication {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  channels: string[];
  video?: File;
  video_url?: string;
  preview?: File;
  preview_url?: string;
}

export interface PublicationFormValues {
  name: string;
  publishDate: Date;
  publications: Publication[];
}

export type PublicationFieldName = keyof PublicationFormValues;
