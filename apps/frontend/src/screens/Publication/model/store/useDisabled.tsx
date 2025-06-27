import { useUnit } from "effector-react";
import { $publicationGroup } from "@entities/PublicationGroup/model/store/publicationGroups";

export const useDisabled = () => {
  const publicationGroup = useUnit($publicationGroup.$data);

  console.log(publicationGroup);

  return publicationGroup?.status === "published";
};
