import type { ContentType } from "@entities/Channel/model/types";

export interface Publication {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  channels: string[];
  video?: File;
  preview?: File;
}

export interface PublicationFormValues {
  publishDate: Date;
  publications: Publication[];
}

export type PublicationFieldName = keyof PublicationFormValues;
