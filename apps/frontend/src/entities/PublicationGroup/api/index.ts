import createPublicationGroup from "./createPublicationGroup";
import deletePublicationGroup from "./deletePublicationGroup";
import depublishGroup from "./depublishGroup";
import getPublicationGroupById from "./getPublicationGroupById";
import publishGroup from "./publishGroup";
import updatePublicationGroupById from "./updatePublicationGroupById";

export const PublicationGroupApi = {
  createPublicationGroup,
  getPublicationGroupById,
  updatePublicationGroupById,
  deletePublicationGroup,
  publishGroup,
  depublishGroup,
};
