import type { ContentType } from "@entities/Channel/model/types";

export interface Publication {
  id?: string;
  type: ContentType;
  channels: string[];
  previewUrl?: string;
}

export type PublicationWithId = Publication & { id: string };

export interface PublicationFormValues {
  publishDate: Date;
  publications: Publication[];
}

export type PublicationFieldName = keyof PublicationFormValues;
