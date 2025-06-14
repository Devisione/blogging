import type { PublicationGroup } from "../../model/types";
import type { GetPublicationGroupByIdOutputDto } from "./output.dto";

export const transformGetPublicationGroupByIdResponseToModel = (
  params: GetPublicationGroupByIdOutputDto,
): PublicationGroup => {
  return {
    id: params.id,
    name: params.name,
    status: params.status,
    updatedAt: new Date(params.updatedAt),
    createdAt: new Date(params.createdAt),

    publications: params.publications.map((publication) => ({
      id: publication.id,
      groupId: publication.groupId,
      title: publication.title,
      content: publication.content,
      type: publication.platform,
      video_url: publication.attachments.find(({ mimetype }) =>
        mimetype.includes("video"),
      )?.url,
      preview_url: publication.attachments.find(({ mimetype }) =>
        mimetype.includes("image"),
      )?.url,
      options: publication.options,
      channels: publication.publicationChannels.map(
        ({ channel }) => channel.id,
      ),
    })),
  } as PublicationGroup;
};
