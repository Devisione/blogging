import { createMutation, createQuery } from "@farfetched/core";
import { $router, onChangePageEv } from "@services/Router/model";
import { sample } from "effector";
import { $events } from "../../../Event/model/store";
import { PublicationGroupApi } from "../../api";

export const $publicationGroup = createQuery({
  handler: (id: string) => {
    return PublicationGroupApi.getPublicationGroupById({ groupId: id });
  },
});

sample({
  source: $router,
  clock: onChangePageEv,
  fn: (router, _pathname) => {
    return router?.query.publicationId as string;
  },
  filter: (router, pathname) => {
    return (
      pathname.includes("/publication") && Boolean(router?.query.publicationId)
    );
  },
  target: $publicationGroup.start,
});

export const deletePublicationGroupMutation = createMutation({
  handler: PublicationGroupApi.deletePublicationGroup,
});

sample({
  source: $router,
  clock: deletePublicationGroupMutation.$succeeded,
  filter: (_router, success) => success,
  target: $events.start,
});
