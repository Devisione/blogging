import type { PublicationGroup } from "../../model/types";
import type { UpdatePublicationGroupByIdOutputDto } from "./output.dto";

export const transformUpdatePublicationGroupByIdResponseToModel = (
  params: UpdatePublicationGroupByIdOutputDto,
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
      video_url: publication.video_url,
      preview_url: publication.preview_url,
      options: publication.options,
      channels: publication.publicationChannels.map(
        ({ channel }) => channel.id,
      ),
    })),
  } as PublicationGroup;
};
